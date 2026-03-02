/**
 * Vercel Serverless Function - Upload API
 * POST /api/upload  (handles /api/upload/file via rewrite)
 * Parses uploaded CSV files and returns processed data + AI insights.
 */

const Papa = require('papaparse');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

// CORS helper
function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

// Configure multer for memory storage (no disk on Vercel)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['text/csv', 'application/vnd.ms-excel', 'text/plain', 'application/csv'];
    if (allowed.includes(file.mimetype) || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are supported'), false);
    }
  }
});

// Parse CSV and compute stats
function processCSV(csvString, filename) {
  const parsed = Papa.parse(csvString, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  });

  const data = parsed.data.slice(0, 5000);
  const fields = parsed.meta.fields || [];

  // Detect column types
  const columnTypes = {};
  fields.forEach(field => {
    const values = data.map(r => r[field]).filter(v => v !== null && v !== undefined && v !== '');
    const numericCount = values.filter(v => typeof v === 'number' && !isNaN(v)).length;
    columnTypes[field] = numericCount > values.length * 0.7 ? 'numeric' : 'categorical';
  });

  // Calculate basic stats for numeric columns
  const statistics = {};
  fields.filter(f => columnTypes[f] === 'numeric').forEach(field => {
    const nums = data.map(r => r[field]).filter(v => typeof v === 'number' && !isNaN(v));
    if (nums.length === 0) return;
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = sum / nums.length;
    const sorted = [...nums].sort((a, b) => a - b);
    statistics[field] = {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: Math.round(avg * 100) / 100,
      sum: Math.round(sum * 100) / 100,
      count: nums.length
    };
  });

  // Prepare chart data - top categorical breakdown for first categorical column
  const chartData = {};
  const catColumns = fields.filter(f => columnTypes[f] === 'categorical');
  const numColumns = fields.filter(f => columnTypes[f] === 'numeric');

  if (catColumns.length > 0 && numColumns.length > 0) {
    const catCol = catColumns[0];
    const numCol = numColumns[0];
    const grouped = {};
    data.forEach(row => {
      const key = String(row[catCol] || 'Unknown');
      if (!grouped[key]) grouped[key] = 0;
      if (typeof row[numCol] === 'number') grouped[key] += row[numCol];
    });
    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]).slice(0, 10);
    chartData.barChart = sorted.map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));
    chartData.labelX = catCol;
    chartData.labelY = numCol;
  }

  // KPIs
  const kpis = numColumns.slice(0, 4).map(field => ({
    label: field,
    value: statistics[field]?.sum ?? statistics[field]?.avg ?? 0,
    avg: statistics[field]?.avg,
    min: statistics[field]?.min,
    max: statistics[field]?.max
  }));

  return {
    metadata: { totalRows: data.length, columns: fields.length, filename, columnTypes },
    statistics,
    chartData,
    kpis,
    sampleData: data.slice(0, 10),
    fields
  };
}

async function generateInsights(processedData) {
  const summary = `Dataset: ${processedData.metadata.totalRows} rows, ${processedData.metadata.columns} cols. ` +
    `Columns: ${Object.entries(processedData.metadata.columnTypes).map(([k, v]) => `${k}(${v})`).join(', ')}. ` +
    `Top KPIs: ${processedData.kpis.slice(0, 3).map(k => `${k.label}: avg ${k.avg}`).join(', ')}.`;

  let reply = null;

  // Try Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(
        `Analyze this dataset and provide 3-4 key business insights in bullet points:\n${summary}`
      );
      reply = result.response.text();
    } catch (e) { console.warn('Gemini insights failed:', e.message); }
  }

  // Fallback to Groq
  if (!reply && process.env.GROQ_API_KEY) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: `Analyze this dataset and provide 3-4 key business insights in bullet points:\n${summary}` }],
        max_tokens: 400
      });
      reply = completion.choices[0]?.message?.content;
    } catch (e) { console.warn('Groq insights failed:', e.message); }
  }

  return reply || `Dataset loaded with ${processedData.metadata.totalRows} rows. Use the dashboard to explore patterns and trends in your data.`;
}

// Promisify multer middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Parse multipart form
    await runMiddleware(req, res, upload.single('file'));

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded. Please upload a CSV file.' });
    }

    const csvString = req.file.buffer.toString('utf8');
    const processedData = processCSV(csvString, req.file.originalname);
    const insights = await generateInsights(processedData);

    res.status(200).json({
      success: true,
      data: processedData,
      insights,
      filename: req.file.originalname
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed. Please try again.'
    });
  }
};

// Disable default body parser so multer can handle multipart
module.exports.config = {
  api: {
    bodyParser: false
  }
};
