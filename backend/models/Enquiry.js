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
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'tbl_enquiry'
});

module.exports = mongoose.model('Enquiry', enquirySchema);
