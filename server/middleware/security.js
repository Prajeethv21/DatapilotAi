/**
 * Security Middleware
 * Implements OWASP security best practices
 */

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

/**
 * Configure Helmet for security headers
 * OWASP: Sets various HTTP headers for security
 */
const configureHelmet = () => {
  return helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for React
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'http://localhost:3000', 'http://localhost:5000'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    // DNS Prefetch Control
    dnsPrefetchControl: { allow: false },
    // Frameguard to prevent clickjacking
    frameguard: { action: 'deny' },
    // Hide powered by header
    hidePoweredBy: true,
    // HSTS (HTTP Strict Transport Security)
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    // IE No Open - prevents IE from executing downloads
    ieNoOpen: true,
    // Don't sniff MIME types
    noSniff: true,
    // Permissions Policy
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    // Referrer Policy
    referrerPolicy: { policy: 'no-referrer' },
    // XSS Filter
    xssFilter: true
  });
};

/**
 * Configure CORS securely
 * OWASP: Restrict cross-origin requests
 */
const configureCORS = () => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // 24 hours
  };
};

/**
 * Sanitize MongoDB queries
 * OWASP: Prevents NoSQL injection attacks
 */
const sanitizeData = () => {
  return mongoSanitize({
    replaceWith: '_', // Replace prohibited characters with underscore
    onSanitize: ({ req, key }) => {
      console.warn(`⚠️ Sanitized potentially malicious input in field: ${key}`);
    }
  });
};

/**
 * Request body size limiter
 * OWASP: Prevents large payload DoS attacks
 */
const bodyLimiter = (limit = '100kb') => {
  return (req, res, next) => {
    const contentLength = req.get('content-length');
    const maxSize = parseSize(limit);

    if (contentLength && parseInt(contentLength) > maxSize) {
      console.warn(`⚠️ Request body too large: ${contentLength} bytes from IP: ${req.ip}`);
      return res.status(413).json({
        error: 'Payload Too Large',
        message: `Request body exceeds ${limit} limit`,
        maxSize: limit
      });
    }

    next();
  };
};

/**
 * Parse size string to bytes
 */
const parseSize = (size) => {
  const units = { kb: 1024, mb: 1024 * 1024, gb: 1024 * 1024 * 1024 };
  const match = size.match(/^(\d+)(kb|mb|gb)$/i);
  if (!match) return 100 * 1024; // Default 100kb
  return parseInt(match[1]) * units[match[2].toLowerCase()];
};

/**
 * API key validation middleware
 * OWASP: Secure API authentication
 */
const validateAPIKey = (req, res, next) => {
  // Skip validation for health check
  if (req.path === '/api/health') {
    return next();
  }

  const apiKey = req.get('X-API-Key') || req.query.apiKey;

  // If API keys are configured, validate them
  if (process.env.REQUIRE_API_KEY === 'true') {
    const validKeys = (process.env.API_KEYS || '').split(',').filter(Boolean);

    if (!apiKey || !validKeys.includes(apiKey)) {
      console.warn(`⚠️ Invalid or missing API key from IP: ${req.ip}`);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Valid API key required'
      });
    }
  }

  next();
};

/**
 * Request logging for security audit
 */
const auditLogger = (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent')
  };

  // Log suspicious patterns
  const suspiciousPatterns = [
    /[<>'"]/,  // HTML/Script tags
    /\.\.\//,  // Path traversal attempts (../)
    /union.*select/i,  // SQL injection
    /javascript:/i,  // XSS
    /eval\(/i  // Code injection
  ];

  const fullUrl = req.originalUrl || req.url;
  const suspicious = suspiciousPatterns.some(pattern => 
    pattern.test(fullUrl) || pattern.test(JSON.stringify(req.body))
  );

  if (suspicious) {
    console.warn('🚨 SECURITY: Suspicious request detected:', logData);
  }

  next();
};

module.exports = {
  configureHelmet,
  configureCORS,
  sanitizeData,
  bodyLimiter,
  validateAPIKey,
  auditLogger,
  xssClean: xss,
  preventParameterPollution: hpp
};
