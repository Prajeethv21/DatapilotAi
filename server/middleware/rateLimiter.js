/**
 * Rate Limiting Middleware
 * Implements OWASP recommendations for API rate limiting
 * Protects against brute force attacks and DoS
 */

const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

/**
 * General API rate limiter
 * Limits: 100 requests per 15 minutes per IP
 * OWASP: Prevents brute force attacks
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP',
    message: 'Please try again after 15 minutes',
    retryAfter: 900 // seconds
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Use IP address as key
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
  // Skip rate limiting for health checks
  skip: (req) => {
    return req.path === '/api/health';
  },
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: 900
    });
  }
});

/**
 * Strict rate limiter for AI analysis endpoint
 * Limits: 10 requests per 10 minutes per IP (AI operations are expensive)
 * OWASP: Prevents abuse of resource-intensive operations
 */
const aiAnalysisLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 AI analysis requests
  message: {
    error: 'AI analysis rate limit exceeded',
    message: 'You can perform 10 analyses per 10 minutes. Please wait before trying again.',
    retryAfter: 600
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
  handler: (req, res) => {
    console.warn(`⚠️ AI analysis rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Analysis rate limit exceeded',
      message: 'Too many analysis requests. AI operations are resource-intensive. Please wait 10 minutes.',
      retryAfter: 600
    });
  }
});

/**
 * Speed limiter - Progressively slow down requests
 * Slows down responses after 50 requests in 15 minutes
 * OWASP: Gentle degradation before hard rate limit
 */
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per 15 minutes at full speed
  delayMs: () => 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Max delay of 20 seconds
  // Skip for health checks
  skip: (req) => {
    return req.path === '/api/health';
  }
});

/**
 * Chat message limiter
 * Limits: 30 messages per 5 minutes (prevents spam)
 */
const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // 30 messages per window
  message: {
    error: 'Too many chat messages',
    message: 'Please slow down. You can send 30 messages per 5 minutes.',
    retryAfter: 300
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`⚠️ Chat rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Chat rate limit exceeded',
      message: 'Too many messages. Please wait a few minutes.',
      retryAfter: 300
    });
  }
});

module.exports = {
  generalLimiter,
  aiAnalysisLimiter,
  speedLimiter,
  chatLimiter
};
