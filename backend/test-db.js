require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/Users');

const testDB = async () => {
  try {
    // Connect to database
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/streamify';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB successfully');
    
    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@streamify.com' });
    if (adminUser) {
      console.log('✅ Admin user already exists:', adminUser.email);
    } else {
      console.log('❌ Admin user not found, creating one...');
      
      // Create admin user
      const newAdmin = new User({
        email: 'admin@streamify.com',
        password: 'test1',
        fullname: 'Admin User',
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('✅ Admin user created successfully!');
      console.log('   Email: admin@streamify.com');
      console.log('   Password: test1');
      console.log('   Role: admin');
    }
    
    // List all users
    const allUsers = await User.find({});
    console.log('\n📋 All users in database:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

testDB();

