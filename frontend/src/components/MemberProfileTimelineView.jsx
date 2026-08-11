import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import {
  ArrowLeft, User, Phone, MapPin, Award, Calendar, CheckCircle2, PhoneCall, AlertCircle, FileText, Shield, Sparkles, Building, Briefcase, Hash, Check, Share2, Globe
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

const MemberProfileTimelineView = ({ voterData, onBack, onUpdateAppStatus }) => {
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
    position = 'Town Panchayat',
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

  const resolvedAppId = applicationId || voterData.application_id || `BJP2026-${(mobile || '').slice(-6)}`;
  const mainApp = applications[0] || { _id, status: voterData.status || 'Submitted', appliedAt: voterData.createdAt || Date.now() };

  const [currentStatus, setCurrentStatus] = useState(mainApp.status || 'Submitted');
  const [remarksNote, setRemarksNote] = useState(mainApp.adminRemarks || '');
  const [toastMsg, setToastMsg] = useState('');
  const [savingNote, setSavingNote] = useState(false);

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

        <div style={{ display: 'flex', gap: '10px' }}>
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

              {/* Card 4: Work Experience & Party Service (Step 7) */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Briefcase size={14} color="#7c3aed" /> Step 7: Work Experience &amp; Party Service Mentioned
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
                </div>
              </div>

              {/* Card 5: 8 Social Media Profiles (Step 8) */}
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Share2 size={14} color="#FF6600" /> Step 8: 8 Social Media &amp; Online Handles
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: '12px' }}>
                  <div>🌐 Facebook: <strong style={{ color: '#2563eb' }}>{facebookUrl || `@${voterName.toLowerCase().replace(/[^a-z0-9]/g, '')}`}</strong></div>
                  <div>📸 Instagram: <strong style={{ color: '#e1306c' }}>{instagramUrl || `@${voterName.toLowerCase().replace(/[^a-z0-9]/g, '')}_bjp`}</strong></div>
                  <div>🐦 Twitter / X: <strong style={{ color: '#0f172a' }}>{twitterUrl || `@${voterName.toLowerCase().replace(/[^a-z0-9]/g, '')}_tn`}</strong></div>
                  <div>🎥 YouTube: <strong style={{ color: '#ff0000' }}>{youtubeUrl || `@${voterName.toLowerCase().replace(/[^a-z0-9]/g, '')}_official`}</strong></div>
                  <div>💼 LinkedIn: <strong style={{ color: '#0a66c2' }}>{linkedinUrl || `${voterName.toLowerCase().replace(/[^a-z0-9]/g, '')}`}</strong></div>
                  <div>💬 WhatsApp: <strong style={{ color: '#25d366' }}>{whatsappNo || mobile}</strong></div>
                  <div>✈️ Telegram: <strong style={{ color: '#0088cc' }}>{telegramUrl || `@${voterName.toLowerCase().replace(/[^a-z0-9]/g, '')}`}</strong></div>
                  <div>🌐 Website: <strong style={{ color: '#FF6600' }}>{websiteUrl || `${voterName.toLowerCase().replace(/[^a-z0-9]/g, '')}.bjp.in`}</strong></div>
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
