const mongoose = require('mongoose');

const connectDB = async () => {
  try {

    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/streamify';
    
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    

    process.exit(1);
  }
};

module.exports = connectDB;