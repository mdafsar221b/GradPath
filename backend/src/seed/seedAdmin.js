require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    const adminEmail = 'admin@gradpath.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = new User({
      name: 'Central Admin',
      email: adminEmail,
      password: 'admin123', // This will be hashed by the User model's pre-save middleware
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@gradpath.com');
    console.log('Password: admin123');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
