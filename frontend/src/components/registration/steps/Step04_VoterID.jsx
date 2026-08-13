import React, { useState } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';
import API from '../../../utils/api';

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
        res = await API.get(`/registrations/voter/${encodeURIComponent(cleanEpic)}`);
      } catch (err1) {
        res = await API.get(`/voter/${encodeURIComponent(cleanEpic)}`);
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
    if (!state.photo_url) {
      setError('⚠️ Candidate Profile Photo is MANDATORY. Please upload candidate photo (Max 10MB) to proceed to Step 5.');
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

          {/* Mandatory Candidate Photo Upload Card — Executive Design */}
          <div style={{
            marginTop: '24px',
            padding: '22px 24px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: state.photo_url ? '1.5px solid #2E7D32' : '1.5px solid #FF6600',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s ease'
          }}>
            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>📸</span>
                <label style={{ fontSize: '13.5px', fontWeight: 800, color: '#1A1A1A', letterSpacing: '0.3px', margin: 0 }}>
                  CANDIDATE PROFILE PHOTO (MAX 10MB) <span style={{ color: '#D32F2F', fontSize: '15px' }}>*</span>
                </label>
              </div>

              {state.photo_url ? (
                <span style={{
                  backgroundColor: '#E8F5E9',
                  color: '#1B5E20',
                  border: '1px solid #A5D6A7',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <i className="bi bi-check-circle-fill" style={{ color: '#2E7D32', fontSize: '12px' }} />
                  Photo Uploaded & Verified
                </span>
              ) : (
                <span style={{
                  backgroundColor: '#FFEBEE',
                  color: '#C62828',
                  border: '1px solid #FFCDD2',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '20px'
                }}>
                  * MANDATORY FIELD
                </span>
              )}
            </div>

            <p style={{ fontSize: '12.5px', color: '#555555', margin: '0 0 16px 0', lineHeight: 1.45 }}>
              Upload candidate passport-size photo for official candidate registration card & election profile. <strong>Candidate photo is required to proceed.</strong>
            </p>

            {/* Custom Upload Dropzone & Action Box */}
            <div style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              backgroundColor: '#FAFAFA',
              padding: '16px 20px',
              borderRadius: '12px',
              border: state.photo_url ? '1px solid #E0E0E0' : '1.5px dashed #FF9933',
              flexWrap: 'wrap'
            }}>
              {/* Image Preview Box */}
              <div style={{ position: 'relative' }}>
                {state.photo_url ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={state.photo_url}
                      alt="Candidate Profile"
                      style={{
                        width: '90px',
                        height: '115px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        border: '2.5px solid #FF6600',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '-6px',
                      right: '-6px',
                      backgroundColor: '#2E7D32',
                      color: '#FFFFFF',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}>
                      ✓
                    </div>
                  </div>
                ) : (
                  <div style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '12px',
                    backgroundColor: '#FFF3E0',
                    border: '2px dashed #FF9933',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E65100',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}>
                    <span style={{ fontSize: '30px', marginBottom: '2px' }}>👤</span>
                    <span style={{ fontSize: '9.5px', fontWeight: 800 }}>NO PHOTO</span>
                  </div>
                )}
              </div>

              {/* Custom Styled File Input Controls */}
              <div style={{ flex: 1, minWidth: '220px' }}>
                <input
                  id="candidate-photo-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.size > 10 * 1024 * 1024) {
                      setError('⚠️ Image file size exceeds 10MB limit. Please upload a smaller photo.');
                      return;
                    }
                    setError('');
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                      try {
                        const folderName = state.application_id || state.mobile || 'candidates';
                        const res = await API.post('/registrations/upload-media', {
                          fileData: reader.result,
                          folderName,
                          assetType: 'image'
                        });
                        if (res.data.success) {
                          updateForm({ photo_url: res.data.url });
                        } else {
                          setError('Failed to upload photo to Cloudinary');
                        }
                      } catch (err) {
                        setError('Failed to upload photo.');
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />

                <label
                  htmlFor="candidate-photo-file-input"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    background: 'linear-gradient(135deg, #FF6600 0%, #E65100 100%)',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(255, 102, 0, 0.25)',
                    transition: 'all 0.15s ease',
                    marginBottom: '8px'
                  }}
                >
                  <i className={state.photo_url ? "bi bi-arrow-repeat" : "bi bi-upload"} style={{ fontSize: '14px' }} />
                  <span>{state.photo_url ? 'Change Candidate Photo' : 'Upload Candidate Photo'}</span>
                </label>

                <div style={{ fontSize: '11.5px', color: '#666666', fontWeight: 500, display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>Supported: JPG, PNG, WEBP</span>
                  <span>•</span>
                  <span>Max 10MB</span>
                </div>
              </div>
            </div>
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
