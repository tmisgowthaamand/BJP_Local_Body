const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// App Write Database Connection (Mongoose)
const connectAppDb = async () => {
  const mongoUrl = process.env.MONGO_APP_URL || 'mongodb://127.0.0.1:27017/bjp_nalam_thittam_db';
  try {
    const dbName = process.env.MONGO_APP_DB_NAME || 'election_app';
    const conn = await mongoose.connect(mongoUrl, {
      dbName,
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[App DB] Connected successfully to Mongoose: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[App DB Connection Error]: Could not connect to MongoDB at ${mongoUrl}: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Voter Read-Only Database Client (Native MongoDB Client for fast cross-collection queries)
let voterClient = null;

const getVoterDbClient = async () => {
  if (!voterClient) {
    const voterUrl = process.env.MONGO_VOTER_URL || process.env.MONGO_APP_URL || 'mongodb://127.0.0.1:27017/voter_db';
    try {
      voterClient = new MongoClient(voterUrl);
      await voterClient.connect();
      console.log('[Voter DB] Native MongoClient connected');
    } catch (error) {
      console.error(`[Voter DB Connection Error]: Could not connect at ${voterUrl}: ${error.message}`);
      return null;
    }
  }
  return voterClient ? voterClient.db(process.env.MONGO_VOTER_DB_NAME || 'voter_db') : null;
};

module.exports = {
  connectAppDb,
  getVoterDbClient
};

