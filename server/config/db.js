const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retry logic.
 * Reads MONGO_URI from environment variables.
 * Retries up to 5 times with exponential backoff on failure.
 */
const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        // Mongoose 8 uses the new connection string parser and unified topology by default
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      retries += 1;
      console.error(
        `MongoDB connection attempt ${retries}/${MAX_RETRIES} failed: ${error.message}`
      );

      if (retries >= MAX_RETRIES) {
        console.error('Max retries reached. Exiting process.');
        process.exit(1);
      }

      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const backoff = Math.pow(2, retries) * 1000;
      console.log(`Retrying in ${backoff / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
};

module.exports = connectDB;
