require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocerymart';

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const email = process.env.ADMIN_EMAIL || 'admin@grocerymart.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const name = process.env.ADMIN_NAME || 'Admin User';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }

    const user = new User({ name, email, password, role: 'admin' });
    await user.save();
    console.log('Admin user created:', email, 'password:', password);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message || err);
    process.exit(1);
  }
}

createAdmin();
