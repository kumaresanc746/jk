require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB Connection with improved error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocerymart';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log(`   Database: ${MONGODB_URI}`);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.error('   Please check:');
  console.error('   1. MongoDB is running');
  console.error('   2. Connection string is correct');
  console.error('   3. Network connectivity');
  // Don't exit - let the server start so health check works
});

// Health check endpoint (before other routes)
app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoStatus,
    uptime: process.uptime()
  });
});

// Routes with error handling
try {
  const authRoutes = require('./backend/routes/auth');
  const productRoutes = require('./backend/routes/products');
  const cartRoutes = require('./backend/routes/cart');
  const orderRoutes = require('./backend/routes/orders');
  const adminRoutes = require('./backend/routes/admin');

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/order', orderRoutes);
  app.use('/api/admin', adminRoutes);
  
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  process.exit(1);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Serve frontend (must be last)
app.get('*', (req, res) => {
  // Don't serve frontend for API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log('🚀 GroceryMart Server Started');
  console.log('='.repeat(50));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error('   Solutions:');
    console.error('   1. Kill the process using the port');
    console.error('   2. Change PORT in .env file');
    console.error(`   3. Run: lsof -ti:${PORT} | xargs kill -9`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

