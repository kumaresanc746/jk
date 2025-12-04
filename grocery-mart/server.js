require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB Connection (supports in-memory server for dev)
async function connectMongo() {
  let MONGODB_URI = process.env.MONGODB_URI;

  // Use in-memory MongoDB only when explicitly requested via USE_IN_MEMORY='true'.
  // Otherwise prefer an external MongoDB provided via MONGODB_URI (recommended).
  if (process.env.USE_IN_MEMORY === 'true') {
    try {
      console.log('USE_IN_MEMORY=true — starting in-memory MongoDB for development');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      MONGODB_URI = mongod.getUri();

      // ensure mongod isn't garbage-collected while app runs
      process._mongoMemoryServer = mongod;
    } catch (err) {
      console.error('Failed to start in-memory MongoDB:', err);
    }
  } else if (!MONGODB_URI) {
    // If no URI provided and in production warn; in development default to local MongoDB
    if (process.env.NODE_ENV === 'production') {
      console.error('No MONGODB_URI provided in production - cannot connect');
    } else {
      console.log('No MONGODB_URI provided — defaulting to mongodb://localhost:27017/grocerymart');
      MONGODB_URI = 'mongodb://localhost:27017/grocerymart';
    }
  }

  MONGODB_URI = MONGODB_URI || 'mongodb://localhost:27017/grocerymart';

  try {
    await mongoose.connect(MONGODB_URI, {
      // Mongoose 7+ no longer requires these options, but safe to include
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
    // If using in-memory for development, run seed to populate sample data
    // Seeding can be skipped by setting SKIP_SEED=true in the environment.
    if (process.env.USE_IN_MEMORY === 'true' && process.env.SKIP_SEED !== 'true') {
      try {
        const { seedDatabaseNoExit } = require('./backend/scripts/seed-module');
        // run seeding in background (don't await long-running if not needed)
        seedDatabaseNoExit().catch(err => console.error('Seeding error:', err));
      } catch (err) {
        console.error('Could not run seed-module:', err);
      }
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    // rethrow to allow process exit if necessary
    throw err;
  }
}

connectMongo().catch(err => {
  console.error('Could not establish MongoDB connection, exiting.');
  process.exit(1);
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

// Development-only seed endpoint (only active when using in-memory DB)
if (process.env.USE_IN_MEMORY === 'true') {
  app.post('/dev/seed', async (req, res) => {
    try {
      const { seedDatabaseNoExit } = require('./backend/scripts/seed-module');
      await seedDatabaseNoExit();
      return res.json({ message: 'Re-seeded in-memory database' });
    } catch (err) {
      console.error('Dev seed failed:', err);
      return res.status(500).json({ error: err.message });
    }
  });
}

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

