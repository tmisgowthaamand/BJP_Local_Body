import React, { useState } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';
import axios from 'axios';

const InfoCard = ({ iconClass, label, value }) => (
  <div className="voter-info-card">
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
      <div style={{
        width: '22px',
        height: '22px',
        borderRadius: '6px',
        backgroundColor: '#FFF3E0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <i className={`bi ${iconClass}`} style={{ color: '#FF6600', fontSize: '12px' }} />
      </div>
      <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#FF6600', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
    </div>
    <div className="card-value">{value || '—'}</div>
  </div>
);

const Step04_VoterID = () => {
  const { state, updateForm, nextStep } = useApplication();
  const [epicNo, setEpicNo] = useState(state.voter_epic || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedVoter, setVerifiedVoter] = useState(state.voter_data || null);

  const handleEpicChange = (e) => {
    setEpicNo(e.target.value.toUpperCase());
    setError('');
  };

  const handleVerifyEpic = async () => {
    if (!epicNo.trim()) {
      setError('Please enter your EPIC Voter ID card number');
      return;
    }

    setLoading(true);
    setError('');
    setVerifiedVoter(null);

    const cleanEpic = epicNo.trim().toUpperCase();

    try {
      let res;
      try {
        res = await axios.get(`/api/registrations/voter/${encodeURIComponent(cleanEpic)}`);
      } catch (err1) {
        res = await axios.get(`/api/voter/${encodeURIComponent(cleanEpic)}`);
      }

      if (res.data && res.data.found && res.data.voter) {
        const voter = res.data.voter;
        setVerifiedVoter(voter);
        updateForm({
          voter_epic: voter.EPIC_NO || cleanEpic,
          full_name: (voter.VOTER_NAME_EN || voter.VOTER_NAME || '').replace(/\s*-\s*$/, '').trim(),
          assembly_no: voter.ASSEMBLY_NO,
          assembly_name: voter.AC_NAME || voter.ASSEMBLY_NAME || voter.assembly_name,
          booth_no: voter.PART_NO,
          polling_station: voter.BOOTH_NAME,
          district: voter.DISTRICT || voter.district || '',
          gender: voter.GENDER || '',
          voter_data: voter
        });
      } else {
        setError(res.data?.message || `EPIC '${cleanEpic}' not found in Tamil Nadu Voter Roll. Please check your voter ID card.`);
      }
    } catch (err) {
      setError(err.response?.data?.message || `EPIC '${cleanEpic}' not found in Tamil Nadu Voter Roll. Please double check your card number.`);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!verifiedVoter) {
      setError('Please verify your EPIC Voter ID before proceeding');
      return false;
    }
    return true;
  };

  const rawVoterName = verifiedVoter
    ? (verifiedVoter.VOTER_NAME_EN || verifiedVoter.VOTER_NAME || 'Verified Voter')
    : '';
  const voterName = rawVoterName.replace(/\s*-\s*$/, '').trim();

  const assemblyName = verifiedVoter
    ? (verifiedVoter.AC_NAME || verifiedVoter.ASSEMBLY_NAME || ('Assembly ' + verifiedVoter.ASSEMBLY_NO))
    : '';
  const district = verifiedVoter
    ? (verifiedVoter.DISTRICT || verifiedVoter.district || '')
    : '';

  return (
    <div className="step-card-container">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #FF6600 0%, #E65100 100%)',
          color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '26px', flexShrink: 0, boxShadow: '0 4px 14px rgba(255, 102, 0, 0.3)'
        }}>
          <i className="bi bi-card-heading" />
        </div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#1B5E20' }}>Voter ID (EPIC) Verification</h2>
          <p style={{ fontSize: '13px', color: '#2E7D32', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Verification against official electoral rolls across 234 Assembly Constituencies.
          </p>
        </div>
      </div>

      {/* Input */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#E65100', marginBottom: '8px', letterSpacing: '0.3px' }}>
          EPIC CARD NUMBER
        </label>
        <div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box', alignItems: 'center' }}>
          <input
            type="text"
            value={epicNo}
            onChange={handleEpicChange}
            placeholder="e.g. AYR2682490"
            style={{
              flex: 1,
              minWidth: 0,
              width: '100%',
              height: '50px',
              padding: '0 12px',
              borderRadius: '10px',
              border: '2px solid #FFB74D',
              fontSize: '15px',
              fontWeight: 700,
              outline: 'none',
              textTransform: 'uppercase',
              backgroundColor: '#FFFFFF',
              letterSpacing: '1px',
              color: '#1B5E20',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="button"
            onClick={handleVerifyEpic}
            disabled={!epicNo.trim() || loading}
            style={{
              height: '50px',
              padding: '0 14px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              background: !epicNo.trim() || loading ? '#D6D6D6' : 'linear-gradient(135deg, #FF6600 0%, #E65100 100%)',
              color: !epicNo.trim() || loading ? '#888888' : '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: !epicNo.trim() || loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Validating...' : 'Verify ID'}
          </button>
        </div>
      </div>

      {/* Verified Voter Card */}
      {verifiedVoter && (
        <div className="voter-card-wrapper">
          {/* Voter Name Heading */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#E8F5E9', borderRadius: '20px',
              padding: '5px 14px', marginBottom: '10px'
            }}>
              <i className="bi bi-patch-check-fill" style={{ color: '#2E7D32', fontSize: '14px' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#2E7D32', letterSpacing: '0.3px' }}>VOTER VERIFIED</span>
            </div>
            <h3 style={{
              fontSize: '22px', fontWeight: 800, color: '#1A1A1A',
              margin: 0, letterSpacing: '-0.3px'
            }}>
              {voterName}
            </h3>
          </div>

          {/* Info Cards Grid */}
          <div className="voter-info-grid">
            <InfoCard iconClass="bi-vcard-fill" label="EPIC Number" value={verifiedVoter.EPIC_NO} />
            <InfoCard iconClass="bi-phone-fill" label="Mobile Number" value={verifiedVoter.MOBILE_NUMBER || '—'} />
            <InfoCard iconClass="bi-person-fill" label="Gender" value={verifiedVoter.GENDER || 'Unspecified'} />
            <InfoCard iconClass="bi-map-fill" label="State" value="Tamil Nadu" />
            <InfoCard iconClass="bi-geo-alt-fill" label="Assembly" value={assemblyName} />
            <InfoCard iconClass="bi-building-fill" label="District" value={district} />
            <InfoCard iconClass="bi-house-door-fill" label="Polling Booth" value={verifiedVoter.BOOTH_NAME || ('Booth ' + verifiedVoter.PART_NO)} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="reg-error-box">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      <StepNav onNext={handleNext} nextDisabled={!verifiedVoter} />
    </div>
  );
};

export default Step04_VoterID;
