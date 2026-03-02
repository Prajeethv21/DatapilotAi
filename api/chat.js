/**
 * Vercel Serverless Function - Chat API
 * POST /api/chat  (handles both /api/chat and /api/chat/message via rewrite)
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

// CORS helper
function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

// Lazy init AI clients
let geminiModel = null;
let groqClient = null;

function initAI() {
  if (!geminiModel && process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    } catch (e) { console.warn('Gemini init failed:', e.message); }
  }
  if (!groqClient && process.env.GROQ_API_KEY) {
    try {
      groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    } catch (e) { console.warn('Groq init failed:', e.message); }
  }
}

async function generateReply(messages) {
  initAI();

  // Try Gemini first
  if (geminiModel) {
    try {
      const history = messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      const chat = geminiModel.startChat({ history });
      const result = await chat.sendMessage(messages[messages.length - 1].content);
      return result.response.text();
    } catch (e) { console.warn('Gemini failed:', e.message); }
  }

  // Fallback to Groq
  if (groqClient) {
    try {
      const completion = await groqClient.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        max_tokens: 1000,
        temperature: 0.7
      });
      return completion.choices[0]?.message?.content || 'No response generated.';
    } catch (e) { console.warn('Groq failed:', e.message); }
  }

  return 'No AI provider is configured. Please add GEMINI_API_KEY or GROQ_API_KEY in your Vercel environment variables.';
}

async function detectIntent(message) {
  const lower = message.toLowerCase();
  const dashboardKw = ['create', 'show', 'generate', 'make', 'build', 'dashboard', 'chart', 'graph', 'visualize', 'plot', 'analysis', 'trend', 'stats'];
  const hits = dashboardKw.filter(k => lower.includes(k));
  if (hits.length >= 2) {
    const topic = message
      .replace(/create|show|generate|make|build|a|an|the|dashboard|about|for|me|chart|charts|graph|visualize|statistics|stats|data|analysis|trend|plot/gi, '')
      .replace(/\s+/g, ' ').trim();
    return { intent: 'dashboard', topic: topic || message };
  }
  return { intent: 'chat' };
}

// In-memory conversations (per cold-start instance)
const conversations = new Map();

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, conversationId, dashboardContext } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const cleanMessage = message.trim().slice(0, 2000);
    const convId = conversationId || 'default';

    if (!conversations.has(convId)) conversations.set(convId, []);
    const history = conversations.get(convId);

    const { intent, topic } = await detectIntent(cleanMessage);

    let responseData;

    if (intent === 'dashboard') {
      // Provide a helpful AI response about dashboard creation
      const aiHistory = [{
        role: 'user',
        content: `The user wants to create a dashboard about "${topic}". Explain what insights you'd visualize and mention that if they upload a CSV file, you can create real charts. Keep it concise and helpful.`
      }];
      const reply = await generateReply(aiHistory);
      responseData = { type: 'chat', reply };
    } else if (dashboardContext) {
      // Answer a question about the current dashboard
      const contextSummary = `Current dashboard context: ${JSON.stringify(dashboardContext).slice(0, 800)}`;
      history.push({ role: 'user', content: `${contextSummary}\n\nUser question: ${cleanMessage}` });
      const reply = await generateReply(history);
      history[history.length - 1] = { role: 'user', content: cleanMessage }; // clean up context from history
      history.push({ role: 'assistant', content: reply });
      responseData = { type: 'dashboard_answer', reply };
    } else {
      // Regular chat
      history.push({ role: 'user', content: cleanMessage });
      const reply = await generateReply(history);
      history.push({ role: 'assistant', content: reply });
      responseData = { type: 'chat', reply };
    }

    // Keep conversation history manageable
    if (history.length > 40) conversations.set(convId, history.slice(-30));

    res.status(200).json({ success: true, ...responseData });

  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({
      success: false,
      type: 'chat',
      reply: 'Sorry, something went wrong. Please try again!'
    });
  }
};
