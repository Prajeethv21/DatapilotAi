/**
 * AI-BI Dashboard - Backend Server
 * Main Express application with AI-powered dataset discovery
 * Security: OWASP best practices implemented
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const dataRoutes = require('./routes/dataRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Security middlewares
const {
  configureHelmet,
  configureCORS,
  sanitizeData,
  bodyLimiter,
  validateAPIKey,
  auditLogger,
  xssClean,
  preventParameterPollution
} = require('./middleware/security');

const { 
  generalLimiter, 
  speedLimiter 
} = require('./middleware/rateLimiter');

const { 
  validateContentType 
} = require('./middleware/validator');

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================================================
// SECURITY MIDDLEWARE (OWASP Best Practices)
// =============================================================================

// 1. Helmet - Security HTTP headers
app.use(configureHelmet());

// 2. CORS - Restrict cross-origin requests
app.use(cors(configureCORS()));

// 3. Request body size limiter (prevent large payload DoS)
app.use(bodyLimiter('10mb'));  // Increased for data uploads

// 4. Body parsers with size limits
app.use(express.json({ limit: '10mb' }));  // Increased for large datasets
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Data sanitization against NoSQL injection
app.use(sanitizeData());

// 6. Data sanitization against XSS attacks
app.use(xssClean());

// 7. Prevent HTTP Parameter Pollution
app.use(preventParameterPollution());

// 8. Content-Type validation (only accept JSON)
app.use(validateContentType);

// 9. API key validation (if enabled)
app.use(validateAPIKey);

// 10. Security audit logging
app.use(auditLogger);

// 11. General rate limiting (applies to all routes)
app.use(generalLimiter);

// 12. Progressive speed limiting
app.use(speedLimiter);

// =============================================================================
// ROUTES
// =============================================================================

app.use('/api/chat', chatRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint (minimal info exposure)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist'
  });
});

// Global error handler (OWASP: Don't leak sensitive error details)
app.use((err, req, res, next) => {
  // Log full error server-side
  console.error('❌ Server Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Determine if error is operational or programming
  const isOperationalError = err.statusCode && err.statusCode < 500;

  // Send safe error response to client
  res.status(err.statusCode || 500).json({
    error: isOperationalError ? err.message : 'Internal server error',
    message: isOperationalError 
      ? err.message 
      : 'An unexpected error occurred. Please try again later.',
    // Only include details in development
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.details 
    })
  });
});

// =============================================================================
// SERVER STARTUP
// =============================================================================

// Validate environment variables on startup
const validateEnv = () => {
  const required = ['OPENAI_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('💡 Please check your .env file');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('⚠️  Continuing in development mode without required variables');
    }
  }
};

validateEnv();

// Start server
const server = app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 AI-BI Dashboard server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🔒 Security: ENABLED`);
  console.log(`   ✓ Rate limiting`);
  console.log(`   ✓ Input validation & sanitization`);
  console.log(`   ✓ XSS protection`);
  console.log(`   ✓ NoSQL injection prevention`);
  console.log(`   ✓ Security headers (Helmet)`);
  console.log(`   ✓ CORS restrictions`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;
