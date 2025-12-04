require('dotenv').config();
const mongoose = require('mongoose');

async function countProducts() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('No MONGODB_URI found in environment');
    process.exit(2);
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const Product = require('../models/Product');
    const count = await Product.countDocuments();
    console.log('Product count:', count);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Count failed:', err);
    try { await mongoose.disconnect(); } catch(e) {}
    process.exit(1);
  }
}

countProducts();
