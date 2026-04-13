const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to academiatrack_db for final cleanup...');
    
    // List of collections we created
    const collections = ['subjects', 'units', 'users'];
    
    for (const col of collections) {
      try {
        await mongoose.connection.db.dropCollection(col);
        console.log(`Dropped collection: ${col}`);
      } catch (e) {
        console.log(`Collection ${col} not found or already deleted.`);
      }
    }

    console.log('Cleanup of academiatrack_db completed.');
    process.exit();
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
};

cleanup();
