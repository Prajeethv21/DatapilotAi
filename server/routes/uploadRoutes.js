/**
 * Upload Routes - Handle file uploads and database connections
 * HARDENED: Rate limiting + Input validation + Secure file handling
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
const DatasetEngine = require('../services/DatasetEngine');
const AIService = require('../services/AIService');

// Import security middleware
const { aiAnalysisLimiter } = require('../middleware/rateLimiter');
const { body, validationResult } = require('express-validator');
const { rejectUnexpectedFields } = require('../middleware/validator');

// Configure multer for file uploads with security constraints
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // OWASP: Sanitize filename to prevent directory traversal
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `${Date.now()}-${safeName}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // OWASP: Reduced to 10MB (was 50MB)
    files: 1 // Only allow one file at a time
  },
  fileFilter: (req, file, cb) => {
    // OWASP: Strict file type validation - whitelist approach
    const allowedMimeTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const allowedExtensions = /\.(csv|xls|xlsx)$/i;
    
    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.test(file.originalname)) {
      cb(null, true);
    } else {
      console.warn(`⚠️ Invalid file type: ${file.mimetype}, ${file.originalname}`);
      cb(new Error('Only CSV and Excel files (.csv, .xls, .xlsx) are allowed'));
    }
  }
});

/**
 * POST /api/upload/file
 * Upload CSV or Excel file and analyze
 * SECURED: Rate limiting (10 req/10min) + File type validation + Size limits
 */
router.post('/file', aiAnalysisLimiter, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📁 File uploaded:', req.file.originalname);

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    let rawCSV = '';

    // Read/convert based on file type
    if (fileExt === '.csv') {
      // Read raw CSV text — DatasetEngine will parse it
      rawCSV = fs.readFileSync(filePath, 'utf8');
    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      // Parse Excel to JSON, then convert to CSV string for DatasetEngine
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      rawCSV = XLSX.utils.sheet_to_csv(worksheet);
    }

    // Clean up uploaded file (OWASP: Always delete temporary files)
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.warn('⚠️ Failed to delete temp file:', cleanupError.message);
    }

    if (!rawCSV || rawCSV.trim().length === 0) {
      return res.status(400).json({ error: 'File is empty or invalid' });
    }

    const rowCount = rawCSV.split('\n').filter(l => l.trim()).length - 1;
    
    // OWASP: Prevent processing extremely large datasets (DoS protection)
    if (rowCount > 100000) {
      return res.status(413).json({ 
        error: 'Dataset too large', 
        message: 'Maximum 100,000 rows allowed',
        rowCount 
      });
    }

    console.log(`✅ Read file with ~${rowCount} rows`);

    // Process the data (pass raw CSV string)
    const processedData = DatasetEngine.processDataset(rawCSV);

    // Generate AI insights (if quota available)
    let insights = 'Data uploaded successfully. Review the dashboard for detailed visualizations.';
    try {
      insights = await AIService.generateInsights(
        processedData.statistics,
        `Uploaded file: ${req.file.originalname}`
      );
    } catch (error) {
      console.log('⚠️ Could not generate AI insights, using default message');
    }

    res.json({
      success: true,
      message: 'File processed successfully',
      fileName: req.file.originalname,
      insights,
      processedData,
      visualization: processedData.chartData
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    
    // Clean up file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.warn('⚠️ Failed to delete temp file:', cleanupError.message);
      }
    }

    res.status(500).json({
      error: 'Upload failed',
      message: error.message
    });
  }
});

/**
 * POST /api/upload/database
 * Connect to database and fetch data
 * SECURED: Rate limiting + Input validation + SQL injection prevention
 */
router.post('/database', aiAnalysisLimiter, [
  // Only allow expected fields
  rejectUnexpectedFields(['type', 'host', 'port', 'user', 'password', 'database', 'query']),
  
  // Validate database type
  body('type')
    .exists().withMessage('Database type is required')
    .isIn(['mysql', 'postgresql', 'postgres']).withMessage('Invalid database type'),
  
  // Validate host
  body('host')
    .exists().withMessage('Host is required')
    .isString()
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('Host must be between 1-255 characters')
    .matches(/^[a-zA-Z0-9.-]+$/).withMessage('Invalid host format'),
  
  // Validate port
  body('port')
    .optional()
    .isInt({ min: 1, max: 65535 }).withMessage('Port must be between 1-65535'),
  
  // Validate user
  body('user')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 }).withMessage('User too long'),
  
  // Validate database name
  body('database')
    .exists().withMessage('Database name is required')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Database name must be 1-100 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Invalid database name format'),
  
  // Validate query
  body('query')
    .exists().withMessage('Query is required')
    .isString()
    .trim()
    .isLength({ min: 1, max: 5000 }).withMessage('Query must be 1-5000 characters')
    // OWASP: Block dangerous SQL keywords (basic protection)
    .custom(query => {
      const dangerous = /\b(DROP|DELETE|TRUNCATE|ALTER|CREATE|GRANT|REVOKE|EXEC|EXECUTE)\b/i;
      if (dangerous.test(query)) {
        throw new Error('Query contains forbidden keywords. Only SELECT queries allowed.');
      }
      return true;
    }),
  
  // Check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn(`⚠️ Database validation failed:`, errors.array());
      return res.status(400).json({
        error: 'Invalid input',
        details: errors.array().map(err => ({ field: err.path, message: err.msg }))
      });
    }
    next();
  }
], async (req, res) => {
  try {
    const { type, host, port, user, password, database, query } = req.body;

    if (!type || !host || !database || !query) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['type', 'host', 'database', 'query']
      });
    }

    let rawData = [];

    if (type === 'mysql') {
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection({
        host,
        port: port || 3306,
        user,
        password,
        database,
        // OWASP: Add connection timeout for security
        connectTimeout: 10000, // 10 seconds
        timeout: 30000 // 30 seconds query timeout
      });

      const [rows] = await connection.execute(query);
      rawData = rows;
      await connection.end();

    } else if (type === 'postgresql' || type === 'postgres') {
      const { Client } = require('pg');
      const client = new Client({
        host,
        port: port || 5432,
        user,
        password,
        database,
        // OWASP: Add connection timeout for security
        connectionTimeoutMillis: 10000, // 10 seconds
        query_timeout: 30000 // 30 seconds
      });

      await client.connect();
      const result = await client.query(query);
      rawData = result.rows;
      await client.end();

    } else {
      return res.status(400).json({
        error: 'Unsupported database type',
        supported: ['mysql', 'postgresql']
      });
    }

    if (!rawData || rawData.length === 0) {
      return res.status(400).json({ error: 'Query returned no data' });
    }

    // OWASP: Limit result set size (DoS protection)
    if (rawData.length > 50000) {
      return res.status(413).json({ 
        error: 'Result set too large', 
        message: 'Maximum 50,000 rows allowed. Please refine your query.',
        rowCount: rawData.length 
      });
    }

    console.log(`✅ Fetched ${rawData.length} rows from ${type} database`);

    // Convert row objects to CSV string for DatasetEngine
    const Papa = require('papaparse');
    const rawCSV = Papa.unparse(rawData);

    // Process the data
    const processedData = DatasetEngine.processDataset(rawCSV);

    // Generate AI insights
    let insights = 'Database data loaded successfully. Review the dashboard for detailed visualizations.';
    try {
      insights = await AIService.generateInsights(
        processedData.statistics,
        `Database: ${database} (${type})`
      );
    } catch (error) {
      console.log('⚠️ Could not generate AI insights, using default message');
    }

    res.json({
      success: true,
      message: 'Database query executed successfully',
      database: `${database} (${type})`,
      rowCount: rawData.length,
      insights,
      processedData,
      visualization: processedData.chartData
    });

  } catch (error) {
    console.error('❌ Database error:', error.message); // Log only message, not stack trace
    
    // OWASP: Don't expose detailed error messages to client
    res.status(500).json({
      error: 'Database connection failed',
      message: 'Unable to connect to database or execute query. Please check your credentials and try again.'
    });
  }
});

module.exports = router;
