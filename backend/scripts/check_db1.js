const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

async function testDatabaseConnections() {
  console.log('====================================================');
  console.log('      🔍 TESTING DATABASE CONNECTIONS (DB1 & DB2)   ');
  console.log('====================================================\n');

  // 1. App DB Test (MONGO_APP_URL)
  const appUrl = process.env.MONGO_APP_URL || 'mongodb://127.0.0.1:27017/election_app';
  console.log(`1️⃣  App DB (MONGO_APP_URL): ${appUrl.split('@')[1] || appUrl}`);
  try {
    const appConn = await mongoose.connect(appUrl, {
      dbName: process.env.MONGO_APP_DB_NAME || 'election_app',
      serverSelectionTimeoutMS: 4000
    });
    console.log(`   ✅ SUCCESS: Connected to Cloud App DB host [${appConn.connection.host}]\n`);
    await mongoose.disconnect();
  } catch (err) {
    console.warn(`   ⚠️ CLOUD APP DB WARNING: ${err.message}`);
    console.log('   🔄 Attempting Local App DB Fallback (mongodb://127.0.0.1:27017/election_app)...');
    try {
      const localAppConn = await mongoose.connect('mongodb://127.0.0.1:27017/election_app', { serverSelectionTimeoutMS: 3000 });
      console.log(`   ✅ SUCCESS: Connected to Local App DB [${localAppConn.connection.host}]\n`);
      await mongoose.disconnect();
    } catch (localErr) {
      console.error(`   ❌ LOCAL APP DB ERROR: ${localErr.message}\n`);
    }
  }

  // 2. Voter DB1 Test (MONGO_VOTER_URL)
  const voterUrl = process.env.MONGO_VOTER_URL || process.env.MONGO_APP_URL || 'mongodb://127.0.0.1:27017/voter_db';
  console.log(`2️⃣  Voter DB1 (MONGO_VOTER_URL): ${voterUrl.split('@')[1] || voterUrl}`);
  try {
    const voterClient = new MongoClient(voterUrl, { serverSelectionTimeoutMS: 4000 });
    await voterClient.connect();
    const db1 = voterClient.db(process.env.MONGO_VOTER_DB_NAME || 'voter_db');
    const cols = await db1.listCollections().toArray();
    console.log(`   ✅ SUCCESS: Connected to DB1 Voter DB. Found ${cols.length} collections.`);
    await voterClient.close();
  } catch (err) {
    console.warn(`   ⚠️ CLOUD DB1 WARNING: ${err.message}`);
    console.log('   🔄 Attempting Local DB1 Fallback (mongodb://127.0.0.1:27017/voter_db)...');
    try {
      const localVoterClient = new MongoClient('mongodb://127.0.0.1:27017/voter_db', { serverSelectionTimeoutMS: 3000 });
      await localVoterClient.connect();
      const localDb1 = localVoterClient.db('voter_db');
      const localCols = await localDb1.listCollections().toArray();
      console.log(`   ✅ SUCCESS: Connected to Local DB1. Found ${localCols.length} collections.\n`);
      await localVoterClient.close();
    } catch (localErr) {
      console.error(`   ❌ LOCAL DB1 ERROR: ${localErr.message}\n`);
    }
  }

  console.log('====================================================');
  process.exit(0);
}

testDatabaseConnections();
