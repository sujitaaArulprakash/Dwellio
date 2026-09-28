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

// Cached connection promise across serverless function invocations
let cachedPromise = null;

/**
 * Connects to MongoDB (Local or MongoDB Atlas) using MONGO_URI from environment variables.
 * Automatically caches connection in serverless environments to prevent reconnecting on every request.
 */
const connectDB = async () => {
  // Reuse existing connection if already connected (1) or connecting (2)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  // Reuse in-flight connection promise to avoid duplicate concurrent connections
  if (cachedPromise) {
    return cachedPromise;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MongoDB Connection Error: MONGO_URI is not defined in environment variables.');
    return;
  }

  // Detect if user has not yet replaced the placeholder in .env
  if (mongoUri.includes('<PASSWORD>') || mongoUri.includes('<password>')) {
    console.warn('⚠️  MongoDB Atlas Notice: MONGO_URI contains the <PASSWORD> placeholder.');
    console.warn('👉 Please update server/.env with your actual MongoDB Atlas database password.');
    return;
  }

  try {
    cachedPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    const conn = await cachedPromise;

    console.log(`✅ MongoDB Atlas Connected successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    cachedPromise = null;
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
  cachedPromise = null;
  console.warn('⚠️  MongoDB connection closed/disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`⚠️  MongoDB runtime error: ${err.message}`);
});

module.exports = connectDB;
