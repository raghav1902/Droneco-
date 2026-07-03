/**
 * @file app.js
 * @description Application entry point for the Coaching Institute Lead Management System.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorHandler/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Global Middlewares
app.use(cors({
  origin: '*', // Allow all origins for simplicity in development
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date(), phase: 'In-Memory Development' });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/admin', require('./routes/admin'));

// 404 Route handler
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` SERVER RUNNING IN ${process.env.NODE_ENV || 'development'} MODE`);
  console.log(` Port: ${PORT}`);
  console.log(` Health: http://localhost:${PORT}/health`);
  console.log(`=============================================`);
});

module.exports = app;
