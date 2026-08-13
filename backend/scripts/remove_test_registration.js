const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({}, { strict: false, collection: 'tbl_enquiry' });
const Enquiry = mongoose.model('EnquiryClean', enquirySchema);

async function removeTestRegistration() {
  const mongoUrl = process.env.MONGO_APP_URL || 'mongodb://127.0.0.1:27017/election_app';
  const dbName = process.env.MONGO_APP_DB_NAME || 'election_app';
  const mobileToRemove = '8903162114';

  console.log(`Connecting to MongoDB at ${mongoUrl}...`);

  let conn;
  try {
    conn = await mongoose.connect(mongoUrl, { dbName, serverSelectionTimeoutMS: 5000 });
  } catch (err) {
    console.warn(`Cloud connection failed (${err.message}). Trying local fallback...`);
    const localUrl = process.env.MONGO_LOCAL_URL || 'mongodb://127.0.0.1:27017/election_app';
    conn = await mongoose.connect(localUrl, { dbName, serverSelectionTimeoutMS: 3000 });
  }

  console.log(`Connected to DB. Removing test registrations for mobile ${mobileToRemove}...`);
  const result = await Enquiry.deleteMany({ mobile: mobileToRemove });
  console.log(`✅ Removed ${result.deletedCount} candidate registration(s) matching mobile ${mobileToRemove}.`);

  await mongoose.disconnect();
  process.exit(0);
}

removeTestRegistration().catch(err => {
  console.error('Error removing test registration:', err);
  process.exit(1);
});
