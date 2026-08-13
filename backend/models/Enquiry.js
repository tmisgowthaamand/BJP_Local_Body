const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    index: true
  },
  full_name: {
    type: String,
    required: true
  },
  passcode: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['planning', 'confirmed', 'team'],
    default: 'confirmed'
  },
  affiliation: {
    type: String,
    default: 'affiliated'
  },
  party: {
    type: String,
    default: 'BJP'
  },
  district: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: ''
  },
  body_type: {
    type: String,
    enum: ['rural', 'urban'],
    required: true
  },
  position: {
    type: String,
    required: true
  },
  union_or_municipality: {
    type: String,
    default: ''
  },
  panchayat_or_corporation: {
    type: String,
    default: ''
  },
  ward_number: {
    type: String,
    default: ''
  },
  work_experience: {
    type: String,
    default: ''
  },
  local_understanding: {
    type: String,
    default: ''
  },
  facebook_url: {
    type: String,
    default: ''
  },
  instagram_url: {
    type: String,
    default: ''
  },
  twitter_url: {
    type: String,
    default: ''
  },
  youtube_url: {
    type: String,
    default: ''
  },
  bjp_membership_id: {
    type: String,
    default: ''
  },
  voter_epic: {
    type: String,
    default: '',
    index: true
  },
  assembly_no: {
    type: String,
    default: ''
  },
  booth_no: {
    type: String,
    default: ''
  },
  polling_station: {
    type: String,
    default: ''
  },
  preference_1: {
    type: Boolean,
    default: true
  },
  preference_2: {
    type: Boolean,
    default: false
  },
  preference_3: {
    type: Boolean,
    default: false
  },
  application_id: {
    type: String,
    required: true,
    unique: true
  },
  photo_url: {
    type: String,
    default: ''
  },
  video_url: {
    type: String,
    default: ''
  },
  win_strategy: {
    type: String,
    default: ''
  },
  gov_profile: {
    type: String,
    default: ''
  },
  extra_question_1: {
    type: String,
    default: ''
  },
  extra_question_2: {
    type: String,
    default: ''
  },
  profile_document_url: {
    type: String,
    default: ''
  },
  bjp_membership_link_clicked: {
    type: Boolean,
    default: false
  },
  is_locked: {
    type: Boolean,
    default: true
  },
  cloudinary_folder: {
    type: String,
    default: ''
  },
  updated_by_organiser: {
    type: String,
    default: ''
  },
  updated_at_organiser: {
    type: Date
  },
  organiser_requests: [{
    request_id: { type: String },
    request_type: { type: String, default: 'Correction / Document Update' },
    message: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    created_at: { type: Date, default: Date.now }
  }],
  created_at: {
    type: Date,
    default: Date.now
  }

}, {
  collection: 'tbl_enquiry',
  strict: false
});

module.exports = mongoose.model('Enquiry', enquirySchema);
