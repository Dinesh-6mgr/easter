const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./src/config/database');
const scoreRoutes = require('./src/routes/scoreRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/scores', scoreRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
