const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const { MongoClient } = require('mongodb');

async function resetDashboardToZero() {
  const urls = [
    { name: 'Cloud Atlas DB', url: process.env.MONGO_APP_URL },
    { name: 'Local MongoDB', url: 'mongodb://127.0.0.1:27017' }
  ];

  console.log(`🧹 Purging all candidate registrations and member records to reset dashboard to 0...`);

  for (const item of urls) {
    if (!item.url) continue;
    console.log(`\nProcessing ${item.name}...`);

    try {
      const client = new MongoClient(item.url, { serverSelectionTimeoutMS: 4000 });
      await client.connect();

      const adminDb = client.db().admin();
      const dbs = await adminDb.listDatabases();

      for (const dbInfo of dbs.databases) {
        if (['admin', 'local', 'config'].includes(dbInfo.name)) continue;
        const db = client.db(dbInfo.name);
        const collections = await db.listCollections().toArray();

        for (const colInfo of collections) {
          if (['tbl_enquiry', 'enquiries', 'schemeapplications', 'candidate_registrations'].includes(colInfo.name.toLowerCase())) {
            const col = db.collection(colInfo.name);
            const delRes = await col.deleteMany({});
            console.log(`  └─ [${dbInfo.name} -> ${colInfo.name}]: Deleted ${delRes.deletedCount} record(s). Dashboard count reset to 0.`);
          }
        }
      }
      await client.close();
    } catch (err) {
      console.warn(`  └─ ${item.name} purge skipped/failed: ${err.message}`);
    }
  }

  console.log(`\n✨ All member and candidate application records purged. Dashboard is now at 0!`);
  process.exit(0);
}

resetDashboardToZero();
