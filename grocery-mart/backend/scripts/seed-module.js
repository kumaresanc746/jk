const Product = require('../models/Product');
const User = require('../models/User');

const products = require('./seed-data');

const adminUser = {
  name: 'Admin User',
  email: 'admin@grocerymart.com',
  password: 'admin123',
  role: 'admin'
};

async function seedDatabaseNoExit() {
  try {
    // Clear existing products
    await Product.deleteMany({});

    // Insert products
    const inserted = await Product.insertMany(products);

    // Add relatedProducts based on category
    const allProducts = await Product.find().lean();
    const byCategory = {};
    allProducts.forEach(p => {
      (byCategory[p.category] = byCategory[p.category] || []).push(p);
    });

    for (const p of allProducts) {
      const candidates = (byCategory[p.category] || []).filter(c => c._id.toString() !== p._id.toString());
      const related = [];
      while (related.length < 3 && candidates.length > 0) {
        const idx = Math.floor(Math.random() * candidates.length);
        related.push(candidates[idx]._id);
        candidates.splice(idx, 1);
      }
      await Product.findByIdAndUpdate(p._id, { relatedProducts: related });
    }

    // Create admin user if not exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
      await User.create(adminUser);
    }

    console.log('Database seeded (no-exit)');
  } catch (error) {
    console.error('Error in seedDatabaseNoExit:', error);
    throw error;
  }
}

module.exports = { seedDatabaseNoExit };
