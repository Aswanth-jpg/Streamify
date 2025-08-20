require('dotenv').config();
const mongoose = require('mongoose');
const dbConnect = require('../config/db');
const User = require('../models/Users');

const ADMIN_EMAIL = 'admin@streamify.com';
const ADMIN_PASSWORD = 'test1';
const ADMIN_FULLNAME = 'Admin User';

const createAdminUser = async () => {
  console.log('Attempting to connect to the database...');
  await dbConnect();
  console.log('Database connection successful.');

  try {
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('An admin user with this email already exists.');
      return;
    }

    const adminUser = new User({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      fullname: ADMIN_FULLNAME,
      role: 'admin',
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD} (Saved as plain text)`);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from the database.');
  }
};

createAdminUser();