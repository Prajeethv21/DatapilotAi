require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { configureHelmet, sanitizeData, xssClean, preventParameterPollution, auditLogger } = require('./middleware/security');
const { generalLimiter, speedLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(configureHelmet());
app.use(auditLogger);

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006', 'http://localhost:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeData());
app.use(xssClean());
app.use(preventParameterPollution());
app.use(generalLimiter);
app.use(speedLimiter);

// Routes
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

// Public Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/data/status', (req, res) => {
  res.json({
    status: 'operational',
    services: { ai: 'ready', datasetFinder: 'ready', datasetEngine: 'ready' }
  });
});

// Error Handling
app.use((req, res) => {
  console.warn(`⚠️ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'An error occurred. Please try again later.';

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : err.message,
    message: message
  });
});

const server = app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 DataPilot AI Server - SECURED`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`🔒 Security: Helmet, CORS, Rate Limiting, Input Validation`);
  console.log(`🤖 AI Providers:`);
  console.log(`   - Gemini: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   - Groq: ${process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   - OpenAI: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGTERM', () => { 
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => { 
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;
