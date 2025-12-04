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
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log(`   Database: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.error('   Please check MongoDB is running and connection string is correct');
});

// Routes
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

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoStatus,
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log('🚀 GroceryMart Server Started');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
  console.log('='.repeat(50));
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error(`   Run: lsof -ti:${PORT} | xargs kill -9`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

