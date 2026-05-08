const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/user.model');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for user seeding...');

    // Delete existing students to avoid duplicates
    await User.deleteMany({ role: 'student' });
    console.log('Cleared existing students');

    const studentsData = [];
    const realisticNames = [
      'Arjun Sharma', 'Priya Patel', 'Rohan Gupta', 'Sneha Reddy', 
      'Vikram Singh', 'Ananya Iyer', 'Rahul Verma', 'Neha Malhotra', 
      'Siddharth Joshi', 'Ishani Saxena', 'Karan Mehra', 'Riya Kapoor'
    ];
    
    // Create 2 students for each semester (1-6)
    for (let sem = 1; sem <= 6; sem++) {
      for (let i = 0; i < 2; i++) {
        const nameIndex = ((sem - 1) * 2 + i) % realisticNames.length;
        const fullName = realisticNames[nameIndex];
        const firstName = fullName.split(' ')[0].toLowerCase();
        
        // Generate a realistic email like arjun836@gmail.com
        const randomNum = Math.floor(100 + Math.random() * 900);
        const email = `${firstName}${randomNum}@gmail.com`;
        
        studentsData.push({
          name: fullName,
          email: email,
          password: 'password123',
          role: 'student',
          semester: sem
        });
      }
    }

    // Use User.create to ensure password hashing middleware runs
    for (const data of studentsData) {
      await User.create(data);
      console.log(`Created student: ${data.name} - ${data.email} (Semester ${data.semester})`);
    }

    console.log('User seeding completed successfully with realistic data');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
