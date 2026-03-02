/**
 * Input Validation Middleware
 * Implements OWASP Input Validation best practices
 * Validates and sanitizes all user inputs
 */

const { body, validationResult } = require('express-validator');

/**
 * Validation middleware wrapper
 * Checks validation results and returns errors if any
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    for (let validation of validations) {
      const result = await validation.run(req);
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn(`⚠️ Validation failed for ${req.path}:`, errors.array());
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Request validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      });
    }

    next();
  };
};

/**
 * Validation rules for AI analysis request
 * OWASP: Input validation, length limits, type checks
 * UPDATED: Relaxed for natural conversation
 */
const validateAnalysisRequest = validate([
  body('prompt')
    .exists().withMessage('Prompt is required')
    .notEmpty().withMessage('Prompt cannot be empty')
    .isString().withMessage('Prompt must be a string')
    .trim()
    .isLength({ min: 1, max: 2000 }).withMessage('Prompt must be between 1 and 2000 characters')
    // Relaxed pattern - allows most characters except dangerous ones
    .matches(/^[^<>{}[\]\\]+$/).withMessage('Prompt contains potentially dangerous characters')
    .customSanitizer(value => {
      // Remove multiple spaces
      return value.replace(/\s+/g, ' ').trim();
    })
]);

/**
 * Validation rules for chat message
 * OWASP: String validation, XSS prevention, length limits
 */
const validateChatMessage = validate([
  body('message')
    .exists().withMessage('Message is required')
    .notEmpty().withMessage('Message cannot be empty')
    .isString().withMessage('Message must be a string')
    .trim()
    .isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters')
    .customSanitizer(value => {
      // Basic XSS prevention - escape HTML entities
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    })
]);

/**
 * Reject unexpected fields middleware
 * OWASP: Prevents parameter pollution and injection attacks
 */
const rejectUnexpectedFields = (allowedFields) => {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return next();
    }

    const receivedFields = Object.keys(req.body);
    const unexpectedFields = receivedFields.filter(field => !allowedFields.includes(field));

    if (unexpectedFields.length > 0) {
      console.warn(`⚠️ Unexpected fields detected: ${unexpectedFields.join(', ')}`);
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Request contains unexpected fields',
        unexpectedFields: unexpectedFields,
        allowedFields: allowedFields
      });
    }

    next();
  };
};

/**
 * Sanitize output data
 * Ensures no sensitive information leaks to client
 */
const sanitizeOutput = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Remove sensitive keys
  const sensitiveKeys = ['apiKey', 'secret', 'password', 'token', 'auth'];
  const sanitized = { ...data };

  const removeSensitiveData = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    for (let key in obj) {
      // Check if key contains sensitive terms
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        delete obj[key];
        continue;
      }

      // Recursively sanitize nested objects
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        obj[key] = removeSensitiveData(obj[key]);
      }
    }

    return obj;
  };

  return removeSensitiveData(sanitized);
};

/**
 * Content-Type validation
 * OWASP: Only accept JSON payloads (except for file uploads)
 */
const validateContentType = (req, res, next) => {
  // Skip validation for file upload routes
  if (req.path.includes('/upload/file')) {
    return next();
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.get('Content-Type');
    
    if (!contentType || !contentType.includes('application/json')) {
      console.warn(`⚠️ Invalid Content-Type: ${contentType} from IP: ${req.ip}`);
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: 'Content-Type must be application/json',
        received: contentType || 'none'
      });
    }
  }
  next();
};

module.exports = {
  validate,
  validateAnalysisRequest,
  validateChatMessage,
  rejectUnexpectedFields,
  sanitizeOutput,
  validateContentType
};
