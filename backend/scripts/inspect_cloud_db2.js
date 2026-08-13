const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']); } catch (e) {}

const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const { MongoClient } = require('mongodb');

async function inspectCloudDb2() {
  const username = 'tmisgowthaamand_db_user';
  const password = encodeURIComponent('UQZ0VVD9waDPex2l');
  const host = 'cluster0.5q8xfoa.mongodb.net';
  const dbName = 'election_app';

  const cloudUri = `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority&appName=Cluster0`;

  console.log('====================================================');
  console.log(' 🚀 INSPECTING DB2 (APP WRITE DB) ON CLOUD ATLAS');
  console.log(` Host: ${host}`);
  console.log(` Database: ${dbName}`);
  console.log('====================================================\n');

  try {
    const client = new MongoClient(cloudUri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    console.log('🎉 SUCCESS! Connected to DB2 on Cloud MongoDB Atlas!\n');

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log(`📂 Database [${dbName}] is ready (no candidate collections created yet).`);
    } else {
      console.log(`Found ${collections.length} Collection(s) in '${dbName}':\n`);
      for (const c of collections) {
        const count = await db.collection(c.name).estimatedDocumentCount();
        console.log(` 📦 Collection [${c.name}]: ${count.toLocaleString('en-IN')} documents`);
      }
    }

    await client.close();
    console.log('\n====================================================');
    console.log(' ✅ DB2 DIAGNOSTIC COMPLETE');
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ DB2 Connection Error:', err.message);
  }

  process.exit(0);
}

inspectCloudDb2();
