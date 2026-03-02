/**
 * Chat Routes - Full conversational AI + Dashboard generation
 * HARDENED: Rate limiting + Input validation + OWASP best practices
 */

const express = require('express');
const router = express.Router();
const AIService = require('../services/AIService');
const DatasetFinder = require('../services/DatasetFinder');
const DatasetEngine = require('../services/DatasetEngine');

// Import security middleware
const { chatLimiter, aiAnalysisLimiter } = require('../middleware/rateLimiter');
const { rejectUnexpectedFields } = require('../middleware/validator');
const { body, validationResult } = require('express-validator');

// In-memory conversation store (per session via simple token)
const conversations = new Map();

/**
 * Validation middleware for chat message
 * OWASP: Input validation with length limits and type checks
 */
const validateChatMessage = [
  // Only allow expected fields
  rejectUnexpectedFields(['message', 'conversationId', 'dashboardContext']),
  
  // Validate message field
  body('message')
    .exists().withMessage('Message is required')
    .notEmpty().withMessage('Message cannot be empty')
    .isString().withMessage('Message must be a string')
    .trim()
    .isLength({ min: 1, max: 2000 }).withMessage('Message must be between 1 and 2000 characters')
    // Allow natural language but block dangerous characters
    .customSanitizer(value => value.replace(/\s+/g, ' ').trim()),
  
  // Validate conversationId if provided
  body('conversationId')
    .optional()
    .isString().withMessage('ConversationId must be a string')
    .isLength({ max: 100 }).withMessage('ConversationId too long'),
  
  // Validate dashboardContext if provided
  body('dashboardContext')
    .optional()
    .isObject().withMessage('DashboardContext must be an object'),
  
  // Check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn(`⚠️ Validation failed:`, errors.array());
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Request validation failed',
        details: errors.array().map(err => ({ field: err.path, message: err.msg }))
      });
    }
    next();
  }
];

/**
 * POST /api/chat/message
 * Main chat endpoint - handles all interactions
 * SECURED: Rate limiting (30 req/5min) + Input validation
 */
router.post('/message', chatLimiter, validateChatMessage, async (req, res) => {
  try {
    const { message, conversationId, dashboardContext } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const cleanMessage = message.trim().slice(0, 2000);
    const convId = conversationId || 'default';
    
    // Get or create conversation history
    if (!conversations.has(convId)) {
      conversations.set(convId, []);
    }
    const history = conversations.get(convId);
    history.push({ role: 'user', content: cleanMessage });

    // Detect intent - pass dashboardContext so it knows a dashboard is loaded
    const intent = await AIService.detectIntent(cleanMessage, !!dashboardContext);
    console.log(`💬 Intent: ${intent.intent}, Topic: ${intent.topic || 'N/A'}, HasDashboard: ${!!dashboardContext}`);

    let response;

    // Route based on detected intent
    // "chat" intent always goes to general chat, even when dashboard is loaded
    switch (intent.intent) {
      case 'dashboard':
        response = await handleDashboardRequest(cleanMessage, intent, history);
        break;
      
      case 'dashboard_question':
        response = await handleDashboardQuestion(cleanMessage, dashboardContext, history);
        break;
      
      case 'database':
        response = await handleDatabaseRequest(cleanMessage, history);
        break;
      
      default: // 'chat' - general conversation
        response = await handleChat(history, dashboardContext);
        break;
    }

    // Store bot response in history
    history.push({ role: 'assistant', content: response.reply || response.message || 'Done' });
    
    // Keep history manageable
    if (history.length > 40) {
      conversations.set(convId, history.slice(-30));
    }

    res.json({ success: true, ...response });

  } catch (error) {
    console.error('❌ Chat error:', error.message);
    res.status(500).json({
      success: false,
      type: 'chat',
      reply: "Sorry, something went wrong. Please try again!",
      error: error.message
    });
  }
});

/**
 * POST /api/chat/analyze
 * Direct analysis endpoint (backwards compatible)
 * SECURED: Strict rate limiting (10 req/10min) + Input validation
 */
router.post('/analyze', aiAnalysisLimiter, [
  // Only allow expected fields
  rejectUnexpectedFields(['prompt']),
  
  // Validate prompt field
  body('prompt')
    .exists().withMessage('Prompt is required')
    .notEmpty().withMessage('Prompt cannot be empty')
    .isString().withMessage('Prompt must be a string')
    .trim()
    .isLength({ min: 1, max: 2000 }).withMessage('Prompt must be between 1 and 2000 characters')
    .customSanitizer(value => value.replace(/\s+/g, ' ').trim()),
  
  // Check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid input',
        details: errors.array().map(err => ({ field: err.path, message: err.msg }))
      });
    }
    next();
  }
], async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const intent = await AIService.detectIntent(prompt);
    const result = await handleDashboardRequest(prompt, intent, []);
    
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('❌ Analysis error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== HANDLERS ====================

async function handleDashboardRequest(message, intent, history) {
  const topic = intent.topic || message;

  // Extract search keywords
  const keywords = await AIService.extractSearchKeywords(topic);
  
  // Find dataset from web
  const dataset = await DatasetFinder.findDataset(topic, keywords);
  
  // Process dataset
  const processedData = DatasetEngine.processDataset(dataset.rawData);
  
  // Generate insights
  const insights = await AIService.generateInsights(processedData.statistics, topic);

  const reply = `🎯 Found dataset: **${dataset.metadata.name}**\n\n${insights}\n\n📥 [Download Dataset](${dataset.metadata.downloadUrl || dataset.metadata.source})`;

  return {
    type: 'dashboard',
    reply,
    insights,
    dataset: {
      name: dataset.metadata.name,
      description: dataset.metadata.description,
      source: dataset.metadata.source,
      downloadUrl: dataset.metadata.downloadUrl || dataset.metadata.source,
      rowCount: dataset.metadata.rowCount
    },
    processedData: {
      dataset: {
        name: dataset.metadata.name,
        description: dataset.metadata.description,
        rowCount: dataset.metadata.rowCount
      },
      data: processedData
    }
  };
}

async function handleDashboardQuestion(message, dashboardContext, history) {
  const answer = await AIService.answerDashboardQuestion(message, dashboardContext || {});
  return {
    type: 'chat',
    reply: answer
  };
}

async function handleChat(history, dashboardContext) {
  const reply = await AIService.chat(history, null, dashboardContext);
  return {
    type: 'chat',
    reply
  };
}

async function handleDatabaseRequest(message, history) {
  return {
    type: 'chat',
    reply: "🗄️ **Database Connection**\n\nTo connect to your database, click the **Database** button in the top right of the dashboard. You can:\n\n1. **MySQL** - Connect to any MySQL/MariaDB database\n2. **PostgreSQL** - Connect to any PostgreSQL database\n\nFill in your connection details (host, port, user, password, database name) and write your SQL query. The results will be visualized automatically!\n\n💡 *Example query:* `SELECT * FROM sales_data LIMIT 5000`"
  };
}

module.exports = router;
