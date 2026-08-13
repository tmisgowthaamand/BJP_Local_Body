const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const { MongoClient } = require('mongodb');

async function deepCleanMobile() {
  const targetMobile = '8903162114';
  const urls = [
    { name: 'Cloud Atlas DB', url: process.env.MONGO_APP_URL },
    { name: 'Local MongoDB', url: 'mongodb://127.0.0.1:27017' }
  ];

  console.log(`🔍 Starting deep clean for mobile: ${targetMobile}...`);

  for (const item of urls) {
    if (!item.url) continue;
    console.log(`\nChecking ${item.name} (${item.url.split('@')[1] || item.url})...`);

    let client;
    try {
      client = new MongoClient(item.url, { serverSelectionTimeoutMS: 4000 });
      await client.connect();
      
      const adminDb = client.db().admin();
      const dbs = await adminDb.listDatabases();
      
      for (const dbInfo of dbs.databases) {
        if (['admin', 'local', 'config'].includes(dbInfo.name)) continue;
        const db = client.db(dbInfo.name);
        const collections = await db.listCollections().toArray();

        for (const colInfo of collections) {
          const col = db.collection(colInfo.name);
          
          // Count documents matching mobile
          const count = await col.countDocuments({
            $or: [
              { mobile: targetMobile },
              { mobile_number: targetMobile },
              { MOBILE_NUMBER: targetMobile },
              { phone: targetMobile }
            ]
          });

          if (count > 0) {
            const delRes = await col.deleteMany({
              $or: [
                { mobile: targetMobile },
                { mobile_number: targetMobile },
                { MOBILE_NUMBER: targetMobile },
                { phone: targetMobile }
              ]
            });
            console.log(`  └─ [${dbInfo.name} -> ${colInfo.name}]: Removed ${delRes.deletedCount} document(s).`);
          }
        }
      }
      await client.close();
    } catch (err) {
      console.warn(`  └─ ${item.name} check skipped/failed: ${err.message}`);
    }
  }

  console.log(`\n✨ Deep clean complete for mobile ${targetMobile}!`);
  process.exit(0);
}

deepCleanMobile();
