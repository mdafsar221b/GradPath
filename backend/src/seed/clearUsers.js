const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/user.model');

const clearUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for clearing non-admin users...');

    const result = await User.deleteMany({ role: { $ne: 'admin' } });
    console.log(`Successfully deleted ${result.deletedCount} non-admin users.`);

    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`Remaining admin users: ${adminCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error clearing users:', error);
    process.exit(1);
  }
};

clearUsers();
