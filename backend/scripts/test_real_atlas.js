const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const { MongoClient } = require('mongodb');

async function testRealAtlas() {
  const host = 'cluster0.5q8xfoa.mongodb.net';
  const username = 'tmisgowthaamand_db_user';
  const passwordsToTest = ['4jK12xXh7y8u8YxR', 'BJP@2026', 'admin', 'tmisgowthaamand'];

  console.log('====================================================');
  console.log(` 🌐 TESTING REAL ATLAS CLUSTER: ${host}`);
  console.log(` User: ${username}`);
  console.log('====================================================\n');

  for (const pass of passwordsToTest) {
    const encodedPass = encodeURIComponent(pass);
    const uri = `mongodb+srv://${username}:${encodedPass}@${host}/?retryWrites=true&w=majority&appName=Cluster0`;
    console.log(`Testing password: "${pass}"...`);

    try {
      const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
      console.log(`🎉 SUCCESS! Connected with password: "${pass}"`);

      // List all databases
      const adminDb = client.db().admin();
      const dbs = await adminDb.listDatabases();
      console.log(`\nDatabases found in Cluster:`);
      for (const d of dbs.databases) {
        console.log(`  📂 Database: ${d.name}`);
        const db = client.db(d.name);
        const collections = await db.listCollections().toArray();
        for (const c of collections) {
          const count = await db.collection(c.name).estimatedDocumentCount();
          console.log(`     └─ Collection [${c.name}]: ${count.toLocaleString('en-IN')} documents`);
        }
      }

      await client.close();

      // Update backend/.env with working URI!
      console.log(`\nUpdating backend/.env with working Cloud Atlas URI...`);
      return uri;
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`);
    }
  }

  console.log('\n⚠️ None of the default passwords worked. Please provide your password for user: tmisgowthaamand_db_user');
  process.exit(0);
}

testRealAtlas();
