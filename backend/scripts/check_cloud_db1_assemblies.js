const dns = require('dns');
// Set custom public DNS servers to resolve MongoDB SRV records reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const { MongoClient } = require('mongodb');

async function checkCloudDb1Assemblies() {
  const voterUrl = process.env.MONGO_VOTER_URL || 'mongodb+srv://tmisgowthaamand:4jK12xXh7y8u8YxR@cluster0.bjp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const dbName = process.env.MONGO_VOTER_DB_NAME || 'voter_db';

  console.log('====================================================');
  console.log(' 🌐 STRICT CLOUD MONGODB DB1 (VOTER DB) CHECK       ');
  console.log('====================================================');
  console.log(`URI Target: ${voterUrl.split('@')[1]}`);
  console.log(`Target Database: ${dbName}\n`);

  try {
    const client = new MongoClient(voterUrl, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });

    console.log('Connecting to Cloud MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connection Successful!\n');

    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();

    console.log(`Found ${collections.length} total collections in '${dbName}':`);
    
    let assemblyCount = 0;
    const assembliesFound = [];

    for (const col of collections) {
      const docCount = await db.collection(col.name).estimatedDocumentCount();
      console.log(` 📦 Collection [${col.name}]: ${docCount.toLocaleString('en-IN')} documents`);
      
      assembliesFound.push({ name: col.name, count: docCount });
      assemblyCount++;
    }

    console.log('\n----------------------------------------------------');
    console.log(`📊 Summary of DB1 Assembly Data:`);
    console.log(`  • Total Assembly Collections Found: ${assemblyCount}`);
    console.log(`  • Assembly Names: ${assembliesFound.map(a => a.name).join(', ')}`);
    console.log('----------------------------------------------------');

    await client.close();
  } catch (err) {
    console.error('\n❌ STRICT CLOUD CONNECTION FAILED:');
    console.error(`Error details: ${err.message}`);
  }

  process.exit(0);
}

checkCloudDb1Assemblies();
