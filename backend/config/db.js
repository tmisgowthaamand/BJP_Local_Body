const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// DB2: READ & WRITE DATABASE (Mongoose Client for candidate registrations & organiser updates)
const connectAppDb = async () => {
  const mongoUrl = process.env.MONGO_APP_URL;
  const dbName = process.env.MONGO_APP_DB_NAME || 'election_app';

  try {
    const conn = await mongoose.connect(mongoUrl, {
      dbName,
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[DB2 App Read-Write DB] Connected successfully to Cloud Mongoose: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[DB2 App Connection Error]: Could not connect to Cloud MongoDB at ${mongoUrl}: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// DB1: READ-ONLY DATABASE (Native MongoClient for searching 13.72 Lakh voter roll records across 5 assemblies)
let voterClient = null;

const getVoterDbClient = async () => {
  if (!voterClient) {
    const voterUrl = process.env.MONGO_VOTER_URL || process.env.MONGO_APP_URL;
    try {
      voterClient = new MongoClient(voterUrl, { serverSelectionTimeoutMS: 5000 });
      await voterClient.connect();
      console.log('[DB1 Voter Read-Only DB] Native MongoClient connected to Cloud MongoDB');
    } catch (error) {
      console.error(`[Voter DB Connection Error]: Could not connect to Cloud Voter DB at ${voterUrl}: ${error.message}`);
      return null;
    }
  }
  return voterClient ? voterClient.db(process.env.MONGO_VOTER_DB_NAME || 'voter_db') : null;
};

module.exports = {
  connectAppDb,
  getVoterDbClient
};


