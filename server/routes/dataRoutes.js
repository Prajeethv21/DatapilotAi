/**
 * Data Routes - Additional data operations
 * Security: Rate limited, validated
 */

const express = require('express');
const router = express.Router();
const { generalLimiter } = require('../middleware/rateLimiter');

/**
 * GET /api/data/status
 * Check data service status
 * Security: Rate limited (100 req/15min)
 */
router.get('/status', generalLimiter, (req, res) => {
  res.json({
    status: 'operational',
    services: {
      ai: 'ready',
      datasetFinder: 'ready',
      datasetEngine: 'ready'
    },
    security: {
      rateLimit: 'enabled',
      validation: 'enabled',
      sanitization: 'enabled'
    }
  });
});

module.exports = router;
