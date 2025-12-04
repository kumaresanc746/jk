require('dotenv').config();
const mongoose = require('mongoose');
const { seedDatabaseNoExit } = require('./seed-module');

const MONGODB_URI = process.env.MONGODB_URI ;
async function runSeed() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding');

    await seedDatabaseNoExit();

    // close mongoose connection and exit
    await mongoose.disconnect();
    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

runSeed();

