/**
 * Chat Routes - Handles conversational AI interactions
 * Security: Rate limiting, input validation, sanitization
 */

const express = require('express');
const router = express.Router();
const AIService = require('../services/AIService');
const DatasetFinder = require('../services/DatasetFinder');
const DatasetEngine = require('../services/DatasetEngine');

// Security middlewares
const { aiAnalysisLimiter, chatLimiter } = require('../middleware/rateLimiter');
const { 
  validateAnalysisRequest, 
  validateChatMessage, 
  rejectUnexpectedFields,
  sanitizeOutput 
} = require('../middleware/validator');

/**
 * POST /api/chat/analyze
 * Main endpoint: User sends prompt, receives complete analysis
 * Security: Rate limited (10 req/10min), validated, sanitized
 */
router.post('/analyze', 
  aiAnalysisLimiter,  // Rate limiting: 10 requests per 10 minutes
  rejectUnexpectedFields(['prompt']),  // Only allow 'prompt' field
  validateAnalysisRequest,  // Validate and sanitize prompt
  async (req, res) => {
    try {
      const { prompt } = req.body;

      console.log('\n🤖 Received prompt:', prompt);

      // Step 1: AI extracts intent from prompt
      const intent = await AIService.extractIntent(prompt);
      console.log('🧠 Extracted intent:', intent);

      // Step 2: Find relevant dataset
      const dataset = await DatasetFinder.findDataset(intent);
      console.log('📊 Dataset found:', dataset.metadata.name);

      // Step 3: Process dataset
      const processedData = DatasetEngine.processDataset(dataset.rawData);
      console.log('✅ Dataset processed:', processedData.metadata);

      // Step 4: Generate AI insights
      const insights = await AIService.generateInsights(
        processedData.statistics,
        intent.dataType
      );
      console.log('💡 Insights generated');

      // Step 5: Sanitize and return response
      const response = {
        success: true,
        response: {
          message: `Analysis complete for: ${dataset.metadata.name}`,
          insights: insights,
          dataset: {
            name: dataset.metadata.name,
            description: dataset.metadata.description,
            rowCount: dataset.metadata.rowCount
          },
          data: processedData
        }
      };

      // Sanitize output to remove any sensitive data
      res.json(sanitizeOutput(response));

    } catch (error) {
      console.error('❌ Analysis Error:', error.message);
      
      // Don't leak internal error details
      const safeError = error.message.includes('locate relevant dataset') 
        ? error.message 
        : 'Failed to analyze request. Please try again.';
      
      res.status(500).json({
        success: false,
        error: safeError
      });
    }
  }
);

/**
 * POST /api/chat/message
 * Simple chat message endpoint
 * Security: Rate limited (30 req/5min), validated
 */
router.post('/message',
  chatLimiter,  // Rate limiting: 30 requests per 5 minutes
  rejectUnexpectedFields(['message']),  // Only allow 'message' field
  validateChatMessage,  // Validate and sanitize message
  async (req, res) => {
    try {
      const { message } = req.body;

      // Simple acknowledgment - sanitized message already validated
      res.json(sanitizeOutput({
        success: true,
        response: `Understood. Analyzing: "${message}". Searching for relevant data...`
      }));

    } catch (error) {
      console.error('Chat Error:', error.message);
      res.status(500).json({ 
        error: 'Chat processing failed',
        message: 'Unable to process message. Please try again.'
      });
    }
  }
);

module.exports = router;
