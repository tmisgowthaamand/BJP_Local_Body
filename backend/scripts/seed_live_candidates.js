const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({}, { strict: false, collection: 'tbl_enquiry' });
const Enquiry = mongoose.model('EnquirySeed', enquirySchema);

const liveCandidates = [
  {
    application_id: 'BJP2026-890316',
    mobile: '8903162114',
    full_name: 'K. Sundaramurthy',
    passcode: '123456',
    role: 'confirmed',
    affiliation: 'affiliated',
    party: 'BJP',
    district: 'Coimbatore',
    body_type: 'urban',
    position: 'Ward Councillor',
    union_or_municipality: 'Coimbatore Municipal Corporation',
    panchayat_or_corporation: 'Ward 14',
    ward_number: '14',
    bjp_membership_id: 'BJP-TN-1029384',
    voter_epic: 'AYR2682490',
    gender: 'Male',
    assembly_no: '118',
    booth_no: '42',
    polling_station: 'Government Primary School, Ward 14',
    photo_url: 'https://res.cloudinary.com/n9fgemea/image/upload/v1700000000/BJP_Local_Body_Candidates/BJP2026-890316/photo.jpg',
    video_url: 'https://res.cloudinary.com/n9fgemea/video/upload/v1700000000/BJP_Local_Body_Candidates/BJP2026-890316/pitch_video.mp4',
    profile_document_url: 'https://res.cloudinary.com/n9fgemea/raw/upload/v1700000000/BJP_Local_Body_Candidates/BJP2026-890316/Candidate_BioData.pdf',
    work_experience: '2020 - 2024: Ward General Secretary. Organized 15+ Central Welfare Scheme camps enrolling 500+ families.',
    local_understanding: 'Key priorities: Drinking water supply pipeline repair in Sector 3, daily doorstep sanitation, and Primary Health Sub-Centre.',
    win_strategy: 'Appoint 10 Page Pramukhs per booth across 8 booths and complete 3 rounds of door-to-door campaign covering 4,200 households.',
    gov_profile: 'Ex-Serviceman (Indian Army, 15 Yrs Service). Member, District Sainik Board.',
    extra_question_1: 'Organized 4 blood donation camps collecting 120 units during 2023 flood relief.',
    extra_question_2: '10 verified booth committees and 65 Page Pramukhs ready.',
    facebook_url: 'https://facebook.com/sundaram_bjp',
    instagram_url: 'https://instagram.com/sundaram_bjp',
    twitter_url: 'https://x.com/sundaram_bjp',
    youtube_url: 'https://youtube.com/@sundaram_bjp',
    bjp_membership_link_clicked: true,
    is_locked: true,
    cloudinary_folder: 'BJP_Local_Body_Candidates/BJP2026-890316',
    created_at: new Date()
  },
  {
    application_id: 'BJP2026-984210',
    mobile: '9842109876',
    full_name: 'S. Rajeshwari',
    passcode: '123456',
    role: 'confirmed',
    affiliation: 'affiliated',
    party: 'BJP',
    district: 'Chennai',
    body_type: 'urban',
    position: 'Ward Councillor',
    union_or_municipality: 'Greater Chennai Corporation',
    panchayat_or_corporation: 'Ward 112',
    ward_number: '112',
    bjp_membership_id: 'BJP-TN-8873910',
    voter_epic: 'TN/02/112/589412',
    gender: 'Female',
    assembly_no: '24',
    booth_no: '18',
    polling_station: 'St. Thomas Community Center',
    photo_url: 'https://res.cloudinary.com/n9fgemea/image/upload/v1700000000/BJP_Local_Body_Candidates/BJP2026-984210/photo.jpg',
    video_url: 'https://res.cloudinary.com/n9fgemea/video/upload/v1700000000/BJP_Local_Body_Candidates/BJP2026-984210/pitch_video.mp4',
    profile_document_url: 'https://res.cloudinary.com/n9fgemea/raw/upload/v1700000000/BJP_Local_Body_Candidates/BJP2026-984210/Rajeshwari_BioData.pdf',
    work_experience: 'Mahila Morcha District Vice President (2021-2025). Spearheaded self-help group financial literacy drives.',
    local_understanding: 'Focus on stormwater drain construction, street lighting, and women safety watch committees.',
    win_strategy: 'Deploy 5-member Mahila teams in every booth for 1-on-1 female voter engagement.',
    gov_profile: 'Former Co-operative Society Director',
    extra_question_1: 'Enrolled 350 women in PM Jan Dhan & Sukanya Samriddhi schemes.',
    extra_question_2: '8 booth committees active.',
    facebook_url: 'https://facebook.com/rajeshwari_bjp',
    instagram_url: 'https://instagram.com/rajeshwari_bjp',
    twitter_url: 'https://x.com/rajeshwari_bjp',
    youtube_url: 'https://youtube.com/@rajeshwari_bjp',
    bjp_membership_link_clicked: true,
    is_locked: true,
    cloudinary_folder: 'BJP_Local_Body_Candidates/BJP2026-984210',
    created_at: new Date()
  },
  {
    application_id: 'BJP2026-944332',
    mobile: '9443322110',
    full_name: 'M. Palaniswamy',
    passcode: '123456',
    role: 'confirmed',
    affiliation: 'affiliated',
    party: 'BJP',
    district: 'Salem',
    body_type: 'rural',
    position: 'Panchayat Union Union Councillor',
    union_or_municipality: 'Salem South Panchayat Union',
    panchayat_or_corporation: 'Gram Panchayat Ward 5',
    ward_number: '5',
    bjp_membership_id: 'BJP-TN-5510293',
    voter_epic: 'TN/08/045/992817',
    gender: 'Male',
    assembly_no: '88',
    booth_no: '12',
    polling_station: 'Panchayat Union Middle School',
    photo_url: 'https://res.cloudinary.com/n9fgemea/image/upload/v1700000000/BJP_Local_Body_Candidates/BJP2026-944332/photo.jpg',
    video_url: '',
    profile_document_url: '',
    work_experience: 'Kisan Morcha State Executive Member. Led agricultural canal water cleaning drives.',
    local_understanding: 'Drip irrigation subsidies for farmers, village road blacktopping, and PM Kisan scheme outreach.',
    win_strategy: 'Direct farmer group meetings across 5 villages in the panchayat union.',
    gov_profile: 'Kisan Committee Representative',
    extra_question_1: 'Organized soil testing camps for 200 farmers.',
    extra_question_2: '5 active booth teams.',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: '',
    bjp_membership_link_clicked: false,
    is_locked: true,
    cloudinary_folder: 'BJP_Local_Body_Candidates/BJP2026-944332',
    created_at: new Date()
  }
];

async function seedLiveCandidates() {
  const mongoUrl = process.env.MONGO_APP_URL || 'mongodb://127.0.0.1:27017/election_app';
  const dbName = process.env.MONGO_APP_DB_NAME || 'election_app';

  console.log(`Connecting to MongoDB for candidate seeding...`);

  try {
    try {
      await mongoose.connect(mongoUrl, { dbName, serverSelectionTimeoutMS: 4000 });
      console.log(`Connected to Cloud MongoDB.`);
    } catch (err) {
      console.warn(`Cloud connection failed (${err.message}). Connecting to Local MongoDB fallback...`);
      const localUrl = process.env.MONGO_LOCAL_URL || 'mongodb://127.0.0.1:27017/election_app';
      await mongoose.connect(localUrl, { dbName, serverSelectionTimeoutMS: 3000 });
      console.log(`Connected to Local MongoDB.`);
    }

    for (const candidate of liveCandidates) {
      await Enquiry.deleteMany({ mobile: candidate.mobile });
      await Enquiry.create(candidate);
      console.log(`✅ Seeded candidate: ${candidate.full_name} (+91 ${candidate.mobile}) - ${candidate.district}`);
    }

    console.log(`\n🎉 Live candidate data successfully seeded to MongoDB!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedLiveCandidates();
