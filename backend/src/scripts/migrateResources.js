const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Resource = require('../models/resource.model');

const migrateCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for migration...');

    const result = await Resource.updateMany(
      { category: { $exists: false } },
      { $set: { category: 'notes' } }
    );

    console.log(`Migration complete. Updated ${result.modifiedCount} resources.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateCategories();
