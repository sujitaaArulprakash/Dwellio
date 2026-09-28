const mongoose = require('mongoose');
const dns = require('dns');

// Ensure reliable DNS resolution for MongoDB Atlas SRV records
// Campus / institutional Wi-Fi networks often block or refuse UDP SRV lookups with Node.js c-ares
if (dns && typeof dns.setServers === 'function') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch (e) {
    // Graceful fallback if custom DNS servers are restricted
  }
}

/**
 * Connects to MongoDB (Local or MongoDB Atlas) using MONGO_URI from environment variables.
 * Automatically sanitizes connection string to prevent leaking credentials in terminal or logs.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MongoDB Connection Error: MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }

  // Detect if user has not yet replaced the placeholder in .env
  if (mongoUri.includes('<PASSWORD>') || mongoUri.includes('<password>')) {
    console.warn('⚠️  MongoDB Atlas Notice: MONGO_URI contains the <PASSWORD> placeholder.');
    console.warn('👉 Please update server/.env with your actual MongoDB Atlas database password.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Atlas Connected successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    if (
      error.name === 'MongoServerSelectionError' ||
      error.message.includes('whitelist') ||
      error.message.includes('ETIMEDOUT') ||
      error.message.includes('querySrv')
    ) {
      console.error('💡 Tip: Ensure your current IP address is whitelisted in MongoDB Atlas (Network Access > Add IP Address).');
    } else if (
      error.message.includes('bad auth') ||
      error.message.includes('Authentication failed')
    ) {
      console.error('💡 Tip: Check that your database username and password in server/.env are correct.');
    }
  }
};

// Global connection event listeners
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB connection closed/disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`⚠️  MongoDB runtime error: ${err.message}`);
});

module.exports = connectDB;
