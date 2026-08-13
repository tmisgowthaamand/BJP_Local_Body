const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']); } catch (e) {}

const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const { MongoClient } = require('mongodb');

async function inspectCloudDb1() {
  const username = 'tmisgowthaamand_db_user';
  const password = encodeURIComponent('UQZ0VVD9waDPex2l');
  const host = 'cluster0.5q8xfoa.mongodb.net';

  const cloudUri = `mongodb+srv://${username}:${password}@${host}/?retryWrites=true&w=majority&appName=Cluster0`;

  console.log('====================================================');
  console.log(' 🚀 CONNECTING TO REAL CLOUD MONGODB CLUSTER');
  console.log(` Host: ${host}`);
  console.log(` User: ${username}`);
  console.log('====================================================\n');

  try {
    const client = new MongoClient(cloudUri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    console.log('🎉 SUCCESS! Connected to Cloud MongoDB Atlas!\n');

    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();

    console.log(`Found ${dbs.databases.length} Database(s) in Cluster:`);
    for (const d of dbs.databases) {
      console.log(`\n📂 Database: [${d.name}] (Size: ${(d.sizeOnDisk / (1024 * 1024)).toFixed(2)} MB)`);
      const db = client.db(d.name);
      const collections = await db.listCollections().toArray();
      for (const c of collections) {
        try {
          const count = await db.collection(c.name).estimatedDocumentCount();
          console.log(`   └─ 📦 Collection [${c.name}]: ${count.toLocaleString('en-IN')} documents`);
        } catch (e) {
          console.log(`   └─ 📦 Collection [${c.name}]`);
        }
      }
    }

    await client.close();
    console.log('\n====================================================');
    console.log(' ✅ DB1 DIAGNOSTIC COMPLETE');
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ Connection Error:', err.message);
  }

  process.exit(0);
}

inspectCloudDb1();
