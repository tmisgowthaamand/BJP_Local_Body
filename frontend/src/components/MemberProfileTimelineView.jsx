import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import API from '../utils/api';
import {
  ArrowLeft, User, Phone, MapPin, Award, Calendar, CheckCircle2, PhoneCall, AlertCircle, FileText, Shield, Sparkles, Building, Briefcase, Hash, Check, Share2, Globe, Edit, Save, Upload, Trash2, RefreshCw
} from 'lucide-react';

export const formatAppliedDateTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return '—';
  }
};

export const formatSchemeName = (schemeName) => schemeName || 'Candidate Position';
export const getSchemeBgImage = () => null;

const MemberProfileTimelineView = ({ voterData, onBack, onUpdateAppStatus, onSelectVoter }) => {
  if (!voterData) return null;

  const {
    _id,
    voterName = 'N/A',
    epicNo = 'N/A',
    mobile = 'N/A',
    district = 'Thiruvallur',
    assemblyName = 'Gummidipoondi',
    boothNo = '1',
    gender = 'Female',
    position = 'Village Panchayat Ward Member',
    bodyType = 'Urban',
    applicationId = '',
    applications = [],
    bjpMembershipId = '',
    pollingStation = '',
    unionOrMunicipality = '',
    panchayatOrCorporation = '',
    wardNumber = '',
    workExperience = '',
    localUnderstanding = '',
    facebookUrl = '',
    instagramUrl = '',
    twitterUrl = '',
    youtubeUrl = '',
    linkedinUrl = '',
    whatsappNo = '',
    telegramUrl = '',
    websiteUrl = '',
    role = 'confirmed',
    party = 'BJP'
  } = voterData;

  const rawAppId = applicationId || voterData.application_id || `BJP2026-${(mobile || '').slice(-6)}`;
  const resolvedAppId = (rawAppId || '').toUpperCase();
  const mainApp = applications[0] || { _id, status: voterData.status || 'Submitted', appliedAt: voterData.createdAt || Date.now() };

  const photoUrl = voterData.photo_url || voterData.photoUrl || voterData.photo || mainApp?.photo_url || mainApp?.photoUrl || '';
  const videoUrl = voterData.video_url || voterData.videoUrl || voterData.video || voterData.pitch_url || mainApp?.video_url || mainApp?.videoUrl || '';
  const docUrl   = voterData.profile_document_url || voterData.profileDocumentUrl || voterData.profile_doc || mainApp?.profile_document_url || mainApp?.profileDocumentUrl || '';
  const winStrat = voterData.win_strategy || voterData.winStrategy || mainApp?.win_strategy || 'Not provided';
  const govProf  = voterData.gov_profile || voterData.govProfile || mainApp?.gov_profile || 'None';

  const [currentStatus, setCurrentStatus] = useState(mainApp.status || 'Submitted');
  const [remarksNote, setRemarksNote] = useState(mainApp.adminRemarks || '');
  const [toastMsg, setToastMsg] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // ── Organiser Edit Mode State ──
  const [isEditing, setIsEditing] = useState(false);
  const [savingOrganiserUpdates, setSavingOrganiserUpdates] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [editForm, setEditForm] = useState({
    position: voterData.position || position || 'Village Panchayat Ward Member',
    body_type: voterData.body_type || voterData.bodyType || 'rural',
    voterName: voterData.voterName || voterData.full_name || voterName,
    epicNo: voterData.epicNo || voterData.voter_epic || epicNo,
    wardNumber: voterData.wardNumber || voterData.ward_number || wardNumber,
    unionOrMunicipality: voterData.unionOrMunicipality || voterData.union_or_municipality || unionOrMunicipality,
    panchayatOrCorporation: voterData.panchayatOrCorporation || voterData.panchayat_or_corporation || panchayatOrCorporation,
    workExperience: voterData.workExperience || voterData.work_experience || workExperience,
    win_strategy: winStrat !== 'Not provided' ? winStrat : '',
    localUnderstanding: voterData.localUnderstanding || voterData.local_understanding || localUnderstanding,
    photo_url: photoUrl,
    video_url: videoUrl,
    profile_document_url: docUrl
  });

  const availablePositions = [
    'Village Panchayat Ward Member',
    'Village Panchayat President',
    'Panchayat Union Ward Member',
    'District Panchayat Ward Member',
    'Town Panchayat Ward Member',
    'Town Panchayat President',
    'Municipality Councillor',
    'Municipality Chairman',
    'Corporation Councillor',
    'Corporation Mayor'
  ];

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await API.post('/registrations/upload-media', {
        fileData: base64,
        folderName: resolvedAppId || 'general',
        assetType: 'image'
      });
      if (res.data.success) {
        setEditForm(prev => ({ ...prev, photo_url: res.data.url }));
        setToastMsg('📸 New photo uploaded to Cloudinary! Click Save to confirm.');
        setTimeout(() => setToastMsg(''), 4000);
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      alert(err.response?.data?.message || 'Photo upload failed. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await API.post('/registrations/upload-media', {
        fileData: base64,
        folderName: resolvedAppId || 'general',
        assetType: 'video'
      });
      if (res.data.success) {
        setEditForm(prev => ({ ...prev, video_url: res.data.url }));
        setToastMsg('🎥 New pitch video uploaded to Cloudinary! Click Save to confirm.');
        setTimeout(() => setToastMsg(''), 4000);
      }
    } catch (err) {
      console.error('Video upload error:', err);
      alert(err.response?.data?.message || 'Video upload failed. Please try again.');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await API.post('/registrations/upload-media', {
        fileData: base64,
        folderName: resolvedAppId || 'general',
        assetType: 'raw'
      });
      if (res.data.success) {
        setEditForm(prev => ({ ...prev, profile_document_url: res.data.url }));
        setToastMsg('📄 New bio-data document uploaded to Cloudinary! Click Save to confirm.');
        setTimeout(() => setToastMsg(''), 4000);
      }
    } catch (err) {
      console.error('Document upload error:', err);
      alert(err.response?.data?.message || 'Document upload failed. Please try again.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleOrganiserSave = async () => {
    setSavingOrganiserUpdates(true);
    try {
      const targetId = _id || voterData._id || voterData.application_id || voterData.applicationId || voterData.mobile || mobile;
      const res = await API.put(`/admin/applications/${targetId}/update-candidate`, editForm);
      if (res.data.success) {
        setToastMsg('✅ Organiser updates saved! Position, candidate fields & Cloudinary files synced with MongoDB DB2.');
        setIsEditing(false);
        if (onSelectVoter && res.data.voter) {
          onSelectVoter({ ...voterData, ...editForm, ...res.data.voter });
        }
        setTimeout(() => setToastMsg(''), 5000);
      }
    } catch (err) {
      console.error('Organiser save error:', err);
      alert('Failed to save organiser updates. Please try again.');
    } finally {
      setSavingOrganiserUpdates(false);
    }
  };

  const handleDirectCall = async () => {
    window.location.href = `tel:${mobile}`;
    if (onUpdateAppStatus && mainApp._id) {
      try {
        await onUpdateAppStatus(mainApp._id, {
          status: 'Called',
          notes: `Tele-call placed to candidate ${voterName} (${mobile})`,
          isCallAction: true
        });
        setCurrentStatus('Called');
        setToastMsg(`Dialing ${mobile}... Call logged in application timeline.`);
        setTimeout(() => setToastMsg(''), 4000);
      } catch (err) {
        console.error('Call log error:', err);
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setCurrentStatus(newStatus);
      if (onUpdateAppStatus && mainApp._id) {
        await onUpdateAppStatus(mainApp._id, { status: newStatus, notes: remarksNote });
      }
      setToastMsg(`Candidate status updated to ${newStatus}`);
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNote(true);
    try {
      if (onUpdateAppStatus && mainApp._id) {
        await onUpdateAppStatus(mainApp._id, { status: currentStatus, notes: remarksNote });
      }
      setToastMsg('Candidate verification remarks saved!');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const isApproved = currentStatus === 'Approved';
  const isRejected = currentStatus === 'Rejected';
  const isCalled = currentStatus === 'Called';
  const isVerified = ['Verified', 'Approved', 'Completed'].includes(currentStatus);

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>

      {/* Top Back Navigation & Quick Actions */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={onBack}
          className="btn btn-ghost"
          style={{ padding: '8px 18px', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px' }}
        >
          <ArrowLeft size={18} /> Back to Candidate Applications
        </button>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="btn"
            style={{
              padding: '10px 22px', fontSize: '14px', fontWeight: '800', borderRadius: '10px',
              backgroundColor: isEditing ? '#C62828' : '#1B5E20', color: '#ffffff',
              display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer'
            }}
          >
            {isEditing ? <ArrowLeft size={16} /> : <Edit size={16} />}
            {isEditing ? 'Cancel Edit Mode' : '✏️ Edit Candidate Details (Steps 1–13)'}
          </button>

          <button
            type="button"
            onClick={handleDirectCall}
            className="btn"
            style={{ padding: '10px 22px', fontSize: '14px', fontWeight: '700', borderRadius: '10px', background: '#1d1d1f', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <PhoneCall size={16} /> Call Candidate ({mobile})
          </button>
        </div>
      </div>

      {toastMsg && (
        <div style={{ width: '100%', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {toastMsg}
        </div>
      )}

      {/* ── ORGANISER EDIT MODE PANEL (STEPS 1 - 13) ── */}
      {isEditing && (
        <div className="campsite-card" style={{ width: '100%', padding: '24px', boxSizing: 'border-box', marginBottom: '24px', background: '#F1F8E9', borderRadius: '16px', border: '2px solid #2E7D32', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #C8E6C9', paddingBottom: '14px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1B5E20', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                🛡️ DISTRICT ORGANISER EDIT MODE (STEPS 1 – 13)
              </h3>
              <div style={{ fontSize: '12.5px', color: '#33691E', marginTop: '4px' }}>
                Correct candidate position, voter details, strategy, and replace photo/video/PDF attachments. Changes update both candidate user-end and MongoDB DB2. Replacing Cloudinary assets automatically purges old storage!
              </div>
            </div>
            <button
              type="button"
              onClick={handleOrganiserSave}
              disabled={savingOrganiserUpdates}
              style={{
                backgroundColor: '#1B5E20', color: '#ffffff', border: 'none', padding: '10px 20px',
                borderRadius: '10px', fontSize: '14px', fontWeight: '800', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              {savingOrganiserUpdates ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}
              {savingOrganiserUpdates ? 'Saving to DB2 & Cloudinary...' : '💾 Save Organiser Updates'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

            {/* 1. Contested Position (Step 3 & 6) */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #C8E6C9' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#1B5E20', display: 'block', marginBottom: '6px' }}>
                🏛️ CONTESTED POSITION (STEP 3)
              </label>
              <select
                value={editForm.position}
                onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #2E7D32', fontWeight: 700, fontSize: '13px', color: '#0f172a' }}
              >
                {availablePositions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            {/* 2. Candidate Full Name (Step 4) */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #C8E6C9' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#1B5E20', display: 'block', marginBottom: '6px' }}>
                👤 CANDIDATE FULL NAME
              </label>
              <input
                type="text"
                value={editForm.voterName}
                onChange={(e) => setEditForm({ ...editForm, voterName: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '13px' }}
              />
            </div>

            {/* 3. EPIC Card No (Step 4) */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #C8E6C9' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#1B5E20', display: 'block', marginBottom: '6px' }}>
                🪪 VOTER EPIC CARD ID
              </label>
              <input
                type="text"
                value={editForm.epicNo}
                onChange={(e) => setEditForm({ ...editForm, epicNo: e.target.value.toUpperCase() })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, fontFamily: 'monospace', fontSize: '13px' }}
              />
            </div>

            {/* 4. Ward Number (Step 6) */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #C8E6C9' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#1B5E20', display: 'block', marginBottom: '6px' }}>
                🔢 WARD NUMBER
              </label>
              <input
                type="text"
                value={editForm.wardNumber}
                onChange={(e) => setEditForm({ ...editForm, wardNumber: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '13px' }}
              />
            </div>

            {/* 5. Union / Municipality (Step 6) */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #C8E6C9' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#1B5E20', display: 'block', marginBottom: '6px' }}>
                🏙️ UNION / MUNICIPALITY
              </label>
              <input
                type="text"
                value={editForm.unionOrMunicipality}
                onChange={(e) => setEditForm({ ...editForm, unionOrMunicipality: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '13px' }}
              />
            </div>

            {/* 6. Panchayat / Corporation (Step 6) */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #C8E6C9' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#1B5E20', display: 'block', marginBottom: '6px' }}>
                🏡 PANCHAYAT / CORPORATION
              </label>
              <input
                type="text"
                value={editForm.panchayatOrCorporation}
                onChange={(e) => setEditForm({ ...editForm, panchayatOrCorporation: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '13px' }}
              />
            </div>

            {/* 7. Work Experience (Step 7) */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #C8E6C9', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#1B5E20', display: 'block', marginBottom: '6px' }}>
                📝 WORK EXPERIENCE & PARTY SERVICE
              </label>
              <textarea
                rows={2}
                value={editForm.workExperience}
                onChange={(e) => setEditForm({ ...editForm, workExperience: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 500, fontSize: '12.5px', fontFamily: 'inherit' }}
              />
            </div>

            {/* 8. Ward Winning Strategy (Step 7) */}
            <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #C8E6C9', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#1B5E20', display: 'block', marginBottom: '6px' }}>
                🎯 WARD WINNING STRATEGY
              </label>
              <textarea
                rows={2}
                value={editForm.win_strategy}
                onChange={(e) => setEditForm({ ...editForm, win_strategy: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 500, fontSize: '12.5px', fontFamily: 'inherit' }}
              />
            </div>

            {/* 9, 10, 11: Cloudinary Replacement Cards (Aligned in same 3-column row) */}
            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>

              {/* 9. Photo Replacement */}
              <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #C8E6C9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '145px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#E65100', display: 'block', marginBottom: '6px' }}>
                    🖼️ REPLACE CANDIDATE PHOTO (CLOUDINARY)
                  </label>
                  {editForm.photo_url ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <img src={editForm.photo_url} alt="Candidate" style={{ width: '40px', height: '52px', borderRadius: '6px', objectFit: 'cover', objectPosition: 'top center' }} />
                      <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 700 }}>Current Photo Loaded</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '11px', color: '#888888', fontStyle: 'italic', marginBottom: '8px' }}>No photo uploaded</div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    style={{ fontSize: '12px', width: '100%' }}
                  />
                  {uploadingPhoto && <div style={{ fontSize: '11px', color: '#E65100', fontWeight: 700, marginTop: '4px' }}>⏳ Uploading new photo...</div>}
                </div>
              </div>

              {/* 10. Pitch Video Replacement */}
              <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #C8E6C9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '145px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#E65100', display: 'block', marginBottom: '6px' }}>
                    🎥 REPLACE PITCH VIDEO MP4 / LINK
                  </label>
                  <input
                    type="text"
                    placeholder="Or paste video URL (YouTube, Drive...)"
                    value={editForm.video_url}
                    onChange={(e) => setEditForm({ ...editForm, video_url: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginBottom: '8px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleVideoUpload}
                    disabled={uploadingVideo}
                    style={{ fontSize: '12px', width: '100%' }}
                  />
                  {uploadingVideo && <div style={{ fontSize: '11px', color: '#E65100', fontWeight: 700, marginTop: '4px' }}>⏳ Uploading video file...</div>}
                </div>
              </div>

              {/* 11. Bio-Data Document Replacement */}
              <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #C8E6C9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '145px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#E65100', display: 'block', marginBottom: '6px' }}>
                    📄 REPLACE BIO-DATA DOCUMENT (PDF / WORD)
                  </label>
                  {editForm.profile_document_url ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 700 }}>Current Document Loaded</span>
                      <a
                        href={editForm.profile_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '11px', backgroundColor: '#1B5E20', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', textDecoration: 'none', fontWeight: 700 }}
                      >
                        👁️ View File
                      </a>
                    </div>
                  ) : (
                    <div style={{ fontSize: '11px', color: '#888888', fontStyle: 'italic', marginBottom: '8px' }}>No document uploaded</div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleDocUpload}
                    disabled={uploadingDoc}
                    style={{ fontSize: '12px', width: '100%' }}
                  />
                  {uploadingDoc && <div style={{ fontSize: '11px', color: '#E65100', fontWeight: 700, marginTop: '4px' }}>⏳ Uploading document...</div>}
                </div>
              </div>

            </div>

            {/* Candidate Organiser Direct Requests Display */}
            {((voterData.organiser_requests && voterData.organiser_requests.length > 0) || (voterData.organiserRequests && voterData.organiserRequests.length > 0)) && (
              <div style={{
                backgroundColor: '#FFF8F3',
                padding: '16px',
                borderRadius: '12px',
                border: '1.5px solid #FF6600',
                marginTop: '16px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#E65100', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>📩 CANDIDATE DIRECT REQUESTS TO ORGANISER</span>
                  <span style={{ backgroundColor: '#FF6600', color: '#FFFFFF', fontSize: '11px', padding: '2px 10px', borderRadius: '12px', fontWeight: 800 }}>
                    {(voterData.organiser_requests || voterData.organiserRequests).length} Submissions
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(voterData.organiser_requests || voterData.organiserRequests).map((req, idx) => (
                    <div key={idx} style={{ backgroundColor: '#FFFFFF', padding: '12px 14px', borderRadius: '8px', border: '1px solid #FFE0B2', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#FF6600', textTransform: 'uppercase' }}>
                          📌 {req.request_type || 'General Request'}
                        </span>
                        <span style={{ fontSize: '11px', color: '#888888', fontWeight: 600 }}>
                          {req.created_at ? new Date(req.created_at).toLocaleString() : ''}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#1E293B', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
                        "{req.message}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button
              type="button"
              onClick={handleOrganiserSave}
              disabled={savingOrganiserUpdates}
              style={{
                backgroundColor: '#1B5E20', color: '#ffffff', border: 'none', padding: '12px 24px',
                borderRadius: '10px', fontSize: '14px', fontWeight: '800', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(27,94,32,0.3)'
              }}
            >
              {savingOrganiserUpdates ? <RefreshCw size={18} className="spin" /> : <Save size={18} />}
              {savingOrganiserUpdates ? 'Syncing with MongoDB DB2 & Cloudinary...' : '💾 SAVE ORGANISER UPDATES TO MONGODB & CLOUDINARY'}
            </button>
          </div>
        </div>
      )}

      {/* Main Full Page Card */}
      <div className="campsite-card" style={{ width: '100%', padding: '28px', boxSizing: 'border-box', marginBottom: '30px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>

        {/* Candidate Profile Header */}
        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#faf5ff', color: '#7c3aed', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', border: '1px solid #e9d5ff' }}>
                  APP ID: {resolvedAppId}
                </span>
                <span style={{ backgroundColor: '#fff7ed', color: '#FF6600', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', border: '1px solid #ffedd5' }}>
                  CANDIDATE REGISTRATION
                </span>
                <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', border: '1px solid #bfdbfe' }}>
                  POSITION: {position}
                </span>
                <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', border: '1px solid #bbf7d0' }}>
                  GENDER: {gender || 'Female'}
                </span>
              </div>

              <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
                {voterName}
              </h1>

              <div style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
                Application ID: <strong style={{ fontFamily: 'monospace', color: '#7c3aed', fontWeight: '800' }}>{resolvedAppId}</strong> • EPIC Card ID: <strong style={{ fontFamily: 'monospace', color: '#d97706', fontWeight: '800' }}>{epicNo || 'N/A'}</strong> • Mobile: <strong style={{ color: '#0f172a', fontWeight: '700' }}>{mobile}</strong> (OTP Verified ✅)
              </div>
            </div>

            {/* Jurisdiction Badge */}
            <div style={{ background: '#f8fafc', padding: '14px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin size={20} color="#FF6600" />
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                {district} • {assemblyName}
                <div style={{ fontSize: '12px', color: '#FF6600', fontWeight: '800', marginTop: '2px' }}>
                  Polling Booth #{boothNo}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Direct Request to Organiser Alert Banner */}
        {((voterData.organiser_requests && voterData.organiser_requests.length > 0) || (voterData.organiserRequests && voterData.organiserRequests.length > 0)) && (
          <div style={{
            backgroundColor: '#FFF8F3',
            padding: '16px 20px',
            borderRadius: '14px',
            border: '2px solid #FF6600',
            marginBottom: '24px',
            boxShadow: '0 4px 14px rgba(255,102,0,0.1)'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#E65100', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>📩</span>
                <span>CANDIDATE DIRECT REQUEST TO ORGANISER</span>
              </div>
              <span style={{ backgroundColor: '#FF6600', color: '#FFFFFF', fontSize: '11px', padding: '3px 12px', borderRadius: '12px', fontWeight: 800 }}>
                {(voterData.organiser_requests || voterData.organiserRequests).length} Request Received
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(voterData.organiser_requests || voterData.organiserRequests).map((req, idx) => (
                <div key={idx} style={{ backgroundColor: '#FFFFFF', padding: '14px 16px', borderRadius: '10px', border: '1px solid #FFE0B2', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#FF6600', textTransform: 'uppercase' }}>
                      📌 {req.request_type || 'General Request'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>
                      📅 Submitted: {req.created_at ? new Date(req.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'Recently'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#1E293B', fontWeight: 600, backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', lineHeight: 1.5 }}>
                    "{req.message}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2-Column Details Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(360px, 1fr)', gap: '28px', boxSizing: 'border-box' }}>

          {/* Left Column: 12-Step Registration Form Details */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="#FF6600" /> Submitted 12-Step Candidate Details
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Card 1: Application ID & Role */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={14} color="#FF6600" /> Step 1: Application ID &amp; Party Affiliation
                </div>
                <div style={{ fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Application ID: <strong style={{ fontFamily: 'monospace', color: '#7c3aed', fontWeight: '800' }}>{resolvedAppId}</strong></div>
                  <div>Party: <strong style={{ color: '#FF6600', fontWeight: '800' }}>{party}</strong></div>
                  <div>Role: <strong style={{ textTransform: 'capitalize' }}>{role}</strong></div>
                </div>
              </div>

              {/* Card 2: Contested Position & Local Body (Step 3 & 6) */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={14} color="#2563eb" /> Step 3 &amp; 6: Contested Position &amp; Local Body Details
                </div>
                <div style={{ fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Position Contested: <strong style={{ color: '#2563eb', fontWeight: '800' }}>{position}</strong></div>
                  <div>Local Body Type: <strong style={{ textTransform: 'capitalize', color: '#0f172a' }}>{bodyType}</strong></div>
                  <div>Union / Municipality: <strong>{unionOrMunicipality || assemblyName}</strong></div>
                  <div>Panchayat / Corporation: <strong>{panchayatOrCorporation || 'Ward 1'}</strong></div>
                  <div>Ward Number: <strong>Ward #{wardNumber || '1'}</strong></div>
                </div>
              </div>

              {/* Card 3: Voter ID & Electoral Roll (Step 4 & 5) */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} color="#16a34a" /> Step 4 &amp; 5: Voter ID &amp; Electoral Area
                </div>
                <div style={{ fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Candidate Name: <strong>{voterName}</strong></div>
                  <div>EPIC Card Number: <strong style={{ fontFamily: 'monospace', color: '#d97706' }}>{epicNo || 'N/A'}</strong></div>
                  <div>Gender: <strong>{gender || 'Female'}</strong></div>
                  <div>District: <strong>{district}</strong></div>
                  <div>Assembly: <strong>{assemblyName}</strong></div>
                  <div>Booth Number: <strong>Booth #{boothNo}</strong></div>
                  {pollingStation && <div>Polling Station: <strong>{pollingStation}</strong></div>}
                </div>
              </div>

              {/* Card 4: Work Experience & Strategy */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={14} color="#7c3aed" /> Step 7: Work Experience &amp; Strategy
                </div>
                <div style={{ fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>BJP Membership ID: <strong style={{ color: '#0f172a' }}>{bjpMembershipId || 'BJP-TN-2026'}</strong></div>
                  <div>
                    <strong>Work Experience Mentioned:</strong>
                    <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px', fontSize: '12px', color: '#0f172a', fontWeight: '600', lineHeight: '1.4' }}>
                      {workExperience || 'Active BJP Grassroots Candidate - Involved in local booth organizing and party welfare campaigns.'}
                    </div>
                  </div>
                  {localUnderstanding && (
                    <div style={{ marginTop: '4px' }}>
                      <strong>Local Governance Issues &amp; Focus:</strong>
                      <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px', fontSize: '12px', color: '#0f172a', fontWeight: '600', lineHeight: '1.4' }}>
                        {localUnderstanding}
                      </div>
                    </div>
                  )}
                  {winStrat && winStrat !== 'Not provided' && (
                    <div style={{ marginTop: '4px' }}>
                      <strong>🎯 Ward Winning Strategy:</strong>
                      <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px', fontSize: '12px', color: '#0f172a', fontWeight: '600', lineHeight: '1.4' }}>
                        {winStrat}
                      </div>
                    </div>
                  )}
                  {govProf && govProf !== 'None' && (
                    <div style={{ marginTop: '4px' }}>
                      <strong>🏛️ Govt / Public Service Background:</strong>
                      <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '4px', fontSize: '12px', color: '#0f172a', fontWeight: '600', lineHeight: '1.4' }}>
                        {govProf}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 5: Cloudinary Media & Document Attachments (Photo, Video/Link, Profile PDF/Word) */}
              <div style={{ background: '#FFF8F3', padding: '16px', borderRadius: '12px', border: '1.5px solid #FF6600' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#E65100', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ☁️ CANDIDATE MEDIA & DOCUMENT ATTACHMENTS
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Photo Preview */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '10px', border: '1px solid #FFE0B2', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {photoUrl ? (
                      <>
                        <img
                          src={photoUrl}
                          alt="Candidate Photo"
                          style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #FF6600', flexShrink: 0 }}
                        />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#1A1A1A' }}>
                            Candidate Profile Photo
                          </div>
                          <a
                            href={photoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '12px', color: '#FF6600', fontWeight: 700, textDecoration: 'none' }}
                          >
                            🔍 Open High-Res Photo ↗
                          </a>
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: '12.5px', color: '#888888', fontStyle: 'italic' }}>
                        🖼️ No Candidate Photo Uploaded
                      </div>
                    )}
                  </div>

                  {/* Video / Pitch Link Preview */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '10px', border: '1px solid #FFE0B2' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1A1A1A', marginBottom: '6px' }}>
                      🎬 Candidate Pitch Video / Media Link
                    </div>
                    {videoUrl ? (
                      videoUrl.includes('cloudinary.com') || videoUrl.match(/\.(mp4|mov|m4v|jpg|jpeg|png|webp)($|\?)/i) ? (
                        <div>
                          {videoUrl.match(/\.(jpg|jpeg|png|webp)($|\?)/i) || videoUrl.includes('/image/upload/') ? (
                            <img
                              src={videoUrl}
                              alt="Pitch Media"
                              style={{ maxHeight: '140px', borderRadius: '8px', objectFit: 'contain', border: '1px solid #FF6600' }}
                            />
                          ) : (
                            <video
                              src={videoUrl}
                              controls
                              style={{ width: '100%', maxHeight: '140px', borderRadius: '8px', backgroundColor: '#000000', marginBottom: '6px' }}
                            />
                          )}
                          <div>
                            <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#1565C0', fontWeight: 700 }}>
                              ▶️ Open Media Stream ↗
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div style={{ backgroundColor: '#E8F5E9', padding: '8px 12px', borderRadius: '8px', border: '1px solid #A5D6A7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1B5E20', wordBreak: 'break-all' }}>
                            ✅ Pitch Link: {videoUrl}
                          </span>
                          <a
                            href={videoUrl.startsWith('http') ? videoUrl : `https://${videoUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ backgroundColor: '#1B5E20', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
                          >
                            🌐 Open Link ↗
                          </a>
                        </div>
                      )
                    ) : (
                      <div style={{ fontSize: '12.5px', color: '#888888', fontStyle: 'italic' }}>
                        🎥 No Pitch Video / Link Provided
                      </div>
                    )}
                  </div>

                  {/* Profile Document PDF/Word Preview */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '10px', border: '1px solid #FFE0B2' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1A1A1A', marginBottom: '6px' }}>
                      📄 Candidate Profile Bio-Data Document (PDF / Word)
                    </div>
                    {docUrl ? (
                      <div style={{ backgroundColor: '#F1F8E9', padding: '10px 14px', borderRadius: '8px', border: '1px solid #C8E6C9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#2E7D32' }}>
                          📄 Document File Attached
                        </div>
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ backgroundColor: '#2E7D32', color: '#FFFFFF', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
                        >
                          👁️ Open PDF / Word ↗
                        </a>
                      </div>
                    ) : (
                      <div style={{ fontSize: '12.5px', color: '#888888', fontStyle: 'italic' }}>
                        📄 No Profile Document Attached
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Card 6: 8 Social Media Profiles (Step 8) */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Share2 size={14} color="#FF6600" /> Step 8: 8 Social Media &amp; Online Handles
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: '12px' }}>
                  <div>🌐 Facebook: <strong style={{ color: (voterData.facebook_url || facebookUrl) ? '#2563eb' : '#94a3b8' }}>{voterData.facebook_url || facebookUrl || 'Not Provided'}</strong></div>
                  <div>📸 Instagram: <strong style={{ color: (voterData.instagram_url || instagramUrl) ? '#e1306c' : '#94a3b8' }}>{voterData.instagram_url || instagramUrl || 'Not Provided'}</strong></div>
                  <div>🐦 Twitter / X: <strong style={{ color: (voterData.twitter_url || twitterUrl) ? '#0f172a' : '#94a3b8' }}>{voterData.twitter_url || twitterUrl || 'Not Provided'}</strong></div>
                  <div>🎥 YouTube: <strong style={{ color: (voterData.youtube_url || youtubeUrl) ? '#ff0000' : '#94a3b8' }}>{voterData.youtube_url || youtubeUrl || 'Not Provided'}</strong></div>
                  <div>💼 LinkedIn: <strong style={{ color: linkedinUrl ? '#0a66c2' : '#94a3b8' }}>{linkedinUrl || 'Not Provided'}</strong></div>
                  <div>💬 WhatsApp: <strong style={{ color: (whatsappNo || mobile) ? '#25d366' : '#94a3b8' }}>{whatsappNo || mobile || 'Not Provided'}</strong></div>
                  <div>✈️ Telegram: <strong style={{ color: telegramUrl ? '#0088cc' : '#94a3b8' }}>{telegramUrl || 'Not Provided'}</strong></div>
                  <div>🌐 Website: <strong style={{ color: websiteUrl ? '#FF6600' : '#94a3b8' }}>{websiteUrl || 'Not Provided'}</strong></div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Status Tracker & Admin Action Panel */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>

            {/* Tracker Header + Update Status Dropdown */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Application Status &amp; Decision
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Submitted on {formatAppliedDateTime(mainApp.appliedAt)}
                </div>
              </div>

              {/* Status Selector Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Status:</label>
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: '700', background: '#f8fafc', color: '#0f172a', cursor: 'pointer' }}
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Called">Called</option>
                  <option value="Verified">Verified</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Application Progress Tracker */}
            <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Step 1 */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '800' }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>1. Registration Submitted</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Submitted via 12-Step Candidate Portal</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{formatAppliedDateTime(mainApp.appliedAt)}</div>
                </div>
              </div>

              {/* Candidate Organiser Direct Requests Timeline Item */}
              {(voterData.organiser_requests || voterData.organiserRequests || []).map((req, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', backgroundColor: '#FFF8F3', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #FF6600' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FF6600', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '800', fontSize: '13px' }}>
                    📩
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#E65100', textTransform: 'uppercase' }}>
                      Organiser Request: {req.request_type || 'General Request'}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#1E293B', fontWeight: 600, marginTop: '3px', backgroundColor: '#FFFFFF', padding: '8px 10px', borderRadius: '6px', border: '1px solid #FFE0B2' }}>
                      "{req.message}"
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', fontWeight: 700 }}>
                      📅 {req.created_at ? formatAppliedDateTime(req.created_at) : 'Recently'}
                    </div>
                  </div>
                </div>
              ))}

              {/* Step 2 */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isCalled || isVerified || isApproved ? '#dcfce7' : '#f1f5f9', color: isCalled || isVerified || isApproved ? '#15803d' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '800' }}>
                  {isCalled || isVerified || isApproved ? '✓' : '2'}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>2. Tele-calling &amp; Candidate Verification</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {isCalled ? 'Tele-caller contacted candidate' : 'Assigned to Super Admin for verification'}
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isApproved ? '#dcfce7' : (isRejected ? '#fee2e2' : '#f1f5f9'), color: isApproved ? '#15803d' : (isRejected ? '#b91c1c' : '#64748b'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: '800' }}>
                  {isApproved ? '✓' : (isRejected ? '✕' : '3')}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: isApproved ? '#15803d' : (isRejected ? '#b91c1c' : '#0f172a') }}>
                    3. Final Nomination Approval
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {isApproved ? 'Candidate approved for contesting election' : (isRejected ? 'Candidate application rejected' : 'Pending final decision')}
                  </div>
                </div>
              </div>

            </div>

            {/* Admin Verification Remarks Box */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', display: 'block' }}>
                Admin Verification Remarks &amp; Log Notes
              </label>
              <textarea
                rows={4}
                value={remarksNote}
                onChange={(e) => setRemarksNote(e.target.value)}
                placeholder="Enter admin remarks, call follow-up details or verification notes..."
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }}
              />

              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={savingNote}
                style={{ marginTop: '12px', padding: '10px 20px', fontSize: '13px', fontWeight: '700', background: '#FF6600', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                {savingNote ? 'Saving Remarks…' : 'Save Remarks'}
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MemberProfileTimelineView;
