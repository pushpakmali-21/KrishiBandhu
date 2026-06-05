const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/krishibandhu-test';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri, { family: 4 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting reconnect...');
  setTimeout(() => mongoose.connect(mongoUri, { family: 4 }), 5000);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

module.exports = connectDB;
