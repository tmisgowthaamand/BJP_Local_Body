const express = require('express');
const router = express.Router();
const OtpSession = require('../models/OtpSession');
const Enquiry = require('../models/Enquiry');
const { findVoterByEpic } = require('../services/voterSearchService');
const { sendSmsOtp } = require('../services/smsService');
const { getVoterDbClient } = require('../config/db');

// ── GET /api/registrations/assemblies?district=THIRUVALLUR ──────────────────
// Returns all assembly constituencies from the voter DB for a given district
router.get('/assemblies', async (req, res) => {
  try {
    const rawDist = (req.query.district || '').trim();
    const cleanDist = rawDist.toUpperCase().replace(/H/g, '');
    const rx = new RegExp(cleanDist.split('').join('H?'), 'i');

    const voterDb = await getVoterDbClient();
    const collections = await voterDb.listCollections().toArray();
    const assCols = collections.filter(c => c.name.startsWith('ass_')).map(c => c.name);

    const results = [];
    for (const colName of assCols) {
      const doc = await voterDb.collection(colName).findOne({});
      if (doc && doc.DISTRICT) {
        const docDistClean = doc.DISTRICT.toUpperCase().replace(/H/g, '');
        if (!rawDist || rx.test(doc.DISTRICT) || docDistClean === cleanDist) {
          results.push({
            assembly_no: String(doc.ASSEMBLY_NO || colName.replace('ass_', '')),
            assembly_name: doc.ASSEMBLY_NAME || doc.AC_NAME || `Assembly ${doc.ASSEMBLY_NO}`,
            district: doc.DISTRICT || '',
            collection: colName
          });
        }
      }
    }

    // Sort by assembly_no numerically
    results.sort((a, b) => Number(a.assembly_no) - Number(b.assembly_no));

    return res.status(200).json({ success: true, assemblies: results });
  } catch (err) {
    console.error('[registrations/assemblies Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load assemblies from DB' });
  }
});

// ── GET /api/registrations/booths?assembly_no=1 ─────────────────────────────
// Returns distinct booth (PART_NO) list for a given assembly from the voter DB
router.get('/booths', async (req, res) => {
  try {
    const assemblyNo = (req.query.assembly_no || '').trim();
    if (!assemblyNo) {
      return res.status(400).json({ success: false, message: 'assembly_no is required' });
    }

    const colName = `ass_${assemblyNo}`;
    const voterDb = await getVoterDbClient();

    const partNos = await voterDb.collection(colName).distinct('PART_NO');
    const booths = partNos
      .map(p => Number(p))
      .filter(n => !isNaN(n) && n > 0)
      .sort((a, b) => a - b)
      .map(n => ({ id: String(n), label: String(n) }));

    return res.status(200).json({ success: true, booths, total: booths.length });
  } catch (err) {
    console.error('[registrations/booths Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to load booths from DB' });
  }
});


const LOCAL_BODIES_DATA = {
  rural: [
    { id: 'lb_r_1', name: 'Periyanaickenpalayam Panchayat Union', type: 'Panchayat Union' },
    { id: 'lb_r_2', name: 'Pollachi North Panchayat Union', type: 'Panchayat Union' },
    { id: 'lb_r_3', name: 'Sarkarsamakulam Gram Panchayat', type: 'Gram Panchayat' },
    { id: 'lb_r_4', name: 'Karasamangalathur Gram Panchayat', type: 'Gram Panchayat' },
    { id: 'lb_r_5', name: 'Coimbatore District Panchayat', type: 'District Panchayat' },
    { id: 'lb_r_6', name: 'Madukkarai Block Council', type: 'Block Council' },
    { id: 'lb_r_7', name: 'Thondamuthur Village Council', type: 'Village Council' },
    { id: 'lb_r_8', name: 'Sulur Town Panchayat', type: 'Town Panchayat' }
  ],
  urban: [
    { id: 'lb_u_1', name: 'Coimbatore Municipal Corporation', type: 'Corporation' },
    { id: 'lb_u_2', name: 'Mettupalayam Municipality', type: 'Municipality' },
    { id: 'lb_u_3', name: 'Pollachi Municipality', type: 'Municipality' },
    { id: 'lb_u_4', name: 'Valparai Municipality', type: 'Municipality' },
    { id: 'lb_u_5', name: 'Gudalur Selection Grade Municipality', type: 'Selection Grade Municipality' },
    { id: 'lb_u_6', name: 'Karamadai Special Grade Municipality', type: 'Special Grade Municipality' },
    { id: 'lb_u_7', name: 'Irugur Town Panchayat', type: 'Town Panchayat' },
    { id: 'lb_u_8', name: 'Kannampalayam Town Panchayat', type: 'Town Panchayat' }
  ]
};

// 1. Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile || !/^\d{10}$/.test(mobile.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number' });
    }

    const cleanMobile = mobile.trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
      await OtpSession.deleteMany({ mobile: cleanMobile });
      await OtpSession.create({
        mobile: cleanMobile,
        otp,
        expiresAt
      });
    } catch (dbErr) {
      console.warn('[sendOtp DB Warning]:', dbErr.message);
    }

    // Fire-and-forget SMS dispatch via Fast2SMS
    sendSmsOtp(cleanMobile, otp).catch((err) => {
      console.warn('[sendOtp SMS Warning]:', err.message);
    });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      mobile: cleanMobile
    });
  } catch (error) {
    console.error('[registrations/send-otp Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
  }
});

// Helper to construct application object
const buildAppObject = (existing, cleanMobile) => {
  if (!existing) return null;
  return {
    applicationId: (existing.application_id || `BJP2026-${cleanMobile.slice(-6)}`).toUpperCase(),
    full_name: existing.full_name || 'Candidate',
    mobile: existing.mobile || cleanMobile,
    district: (existing.district || 'Thiruvallur').replace(/Tiruvallur/gi, 'Thiruvallur'),
    position: existing.position || 'Ward Member',
    body_type: existing.body_type || 'rural',
    union_or_municipality: existing.union_or_municipality || existing.district,
    panchayat_or_corporation: existing.panchayat_or_corporation || 'Ward 1',
    ward_number: existing.ward_number || '1',
    bjp_membership_id: existing.bjp_membership_id || '',
    voter_epic: existing.voter_epic || '',
    gender: existing.gender || 'Female',
    booth_no: existing.booth_no || '',
    polling_station: existing.polling_station || '',
    assembly_no: existing.assembly_no || '',
    submittedAt: existing.created_at || new Date()
  };
};

// 2. Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: 'Mobile and OTP are required' });
    }

    const cleanMobile = mobile.trim();
    const cleanOtp = otp.trim();

    // Allow demo OTP '123456' for instant testing
    const isDevBypass = cleanOtp === '123456';
    const session = await OtpSession.findOne({ mobile: cleanMobile, otp: cleanOtp });

    if (!session && !isDevBypass) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    if (session && session.expiresAt && new Date() > session.expiresAt && !isDevBypass) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (session) {
      session.verified = true;
      await session.save();
    }

    // Check if candidate registration already exists for this mobile number
    const existing = await Enquiry.findOne({ mobile: cleanMobile }).sort({ created_at: -1 });
    const existingApp = buildAppObject(existing, cleanMobile);

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      existingApplication: existingApp
    });
  } catch (error) {
    console.error('[registrations/verify-otp Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
});

// 3. Validate Voter by EPIC
router.get('/voter/:epicNo', async (req, res) => {
  try {
    const { epicNo } = req.params;
    if (!epicNo || epicNo.trim().length < 2) {
      return res.status(200).json({ found: false, message: 'Please enter a valid EPIC Voter ID card number' });
    }

    const cleanEpic = epicNo.trim().toUpperCase();
    const result = await findVoterByEpic(cleanEpic);

    if (!result || !result.doc) {
      return res.status(200).json({
        found: false,
        message: `EPIC '${cleanEpic}' not found in Tamil Nadu Voter Roll. Please check your voter ID card.`
      });
    }

    const doc = result.doc;
    const colName = result.colName || '';

    const voterObj = {
      VOTER_NAME_EN: doc.VOTER_NAME_EN || doc.NAME_EN || doc.VOTER_NAME || 'Verified Voter',
      VOTER_NAME: doc.VOTER_NAME || doc.VOTER_NAME_EN || doc.NAME_TA || 'வாக்காளர் பெயர்',
      EPIC_NO: doc.EPIC_NO || cleanEpic,
      MOBILE_NUMBER: doc.MOBILE_NUMBER || '',
      ASSEMBLY_NO: String(doc.ASSEMBLY_NO || colName.replace('ass_', '') || '1'),
      AC_NAME: doc.AC_NAME || doc.ASSEMBLY_NAME || ('Assembly ' + (doc.ASSEMBLY_NO || colName.replace('ass_', '') || '1')),
      PART_NO: String(doc.PART_NO || '1'),
      BOOTH_NAME: doc.BOOTH_NAME || ('Booth ' + (doc.PART_NO || '1')),
      SECTION_NAME: doc.SECTION_NAME || '',
      HOUSE_NO: doc.HOUSE_NO || '',
      RELATION_TYPE: doc.RELATION_TYPE || '',
      RELATION_NAME: doc.RELATION_NAME || '',
      GENDER: doc.GENDER || 'Unspecified',
      AGE: doc.AGE || '',
      DISTRICT: doc.DISTRICT || doc.DISTRICT_NAME || doc.district || 'Tamil Nadu'
    };

    return res.status(200).json({
      found: true,
      message: 'Voter found successfully',
      voter: voterObj
    });
  } catch (error) {
    console.error('[registrations/voter Error]:', error);
    return res.status(200).json({ found: false, message: 'Voter search completed' });
  }
});

// 4. Get Local Bodies by district + body_type
const { getLocalBodiesForDistrict } = require('../data/tnLocalBodiesData');

router.get('/local-bodies', (req, res) => {
  try {
    const { district, type } = req.query;
    const bodyType = (type || 'rural').toLowerCase();

    const localBodyTypes = bodyType === 'urban'
      ? ['Corporation', 'Municipality', 'Town Panchayat', 'Special Grade Municipality', 'Selection Grade Municipality', 'First Grade Municipality']
      : ['Gram Panchayat', 'Panchayat Union', 'District Panchayat', 'Town Panchayat', 'Village Council', 'Block Council'];

    const formattedBodies = getLocalBodiesForDistrict(district, bodyType);

    return res.status(200).json({
      localBodyTypes,
      localBodies: formattedBodies
    });
  } catch (error) {
    console.error('[registrations/local-bodies Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch local bodies' });
  }
});

// 5. Get Wards by local body
router.get('/wards', (req, res) => {
  try {
    const { localBodyId } = req.query;
    const wards = [];

    for (let i = 1; i <= 30; i++) {
      wards.push({
        id: `ward_${localBodyId || 'default'}_${i}`,
        name: `Ward ${i}`,
        ward_number: String(i)
      });
    }

    return res.status(200).json({ wards });
  } catch (error) {
    console.error('[registrations/wards Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch wards' });
  }
});

// 6. Submit Application
router.post('/submit', async (req, res) => {
  try {
    const data = req.body;
    if (!data.mobile || !data.full_name || !data.body_type || !data.position) {
      return res.status(400).json({
        success: false,
        message: 'Missing required candidate application details'
      });
    }

    // Generate unique Application ID format: BJP2026-XXXXXX
    const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
    const applicationId = `BJP2026-${randomSuffix}`;

    const enquiryDoc = await Enquiry.create({
      mobile: data.mobile,
      full_name: data.full_name,
      passcode: data.passcode || '',
      role: data.role || 'confirmed',
      affiliation: data.affiliation || 'affiliated',
      party: data.party || 'BJP',
      district: data.district || '',
      body_type: data.body_type,
      position: data.position,
      union_or_municipality: data.union_or_municipality || '',
      panchayat_or_corporation: data.panchayat_or_corporation || '',
      ward_number: String(data.ward_number || ''),
      work_experience: data.work_experience || '',
      local_understanding: data.local_understanding || '',
      facebook_url: data.facebook_url || '',
      instagram_url: data.instagram_url || '',
      twitter_url: data.twitter_url || '',
      youtube_url: data.youtube_url || '',
      bjp_membership_id: data.bjp_membership_id || '',
      voter_epic: data.voter_epic || '',
      gender: data.gender || '',
      assembly_no: data.assembly_no || '',
      booth_no: data.booth_no || '',
      polling_station: data.polling_station || '',
      preference_1: data.preference_1 !== undefined ? Boolean(data.preference_1) : true,
      preference_2: Boolean(data.preference_2),
      preference_3: Boolean(data.preference_3),
      application_id: applicationId,
      created_at: new Date()
    });

    return res.status(201).json({
      success: true,
      applicationId: enquiryDoc.application_id,
      submittedAt: enquiryDoc.created_at.toISOString(),
      message: 'Candidate application submitted successfully'
    });
  } catch (error) {
    console.error('[registrations/submit Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit application: ' + error.message
    });
  }
});

module.exports = router;
