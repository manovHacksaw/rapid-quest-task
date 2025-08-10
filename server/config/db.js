const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    // Re-throw the error to be caught by the server starter
    throw err;
  }
};

module.exports = connectDB;