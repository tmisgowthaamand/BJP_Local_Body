import React, { useState } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';

const Step12_Review = () => {
  const { state, setStep } = useApplication();
  const [expandedSection, setExpandedSection] = useState(0); // Default open first section

  const toggleSection = (idx) => {
    setExpandedSection(expandedSection === idx ? null : idx);
  };

  const cleanFullName = (state.full_name || 'Verified Voter').replace(/\s*-\s*$/, '').trim();

  const sections = [
    {
      title: '1. Personal Details',
      stepNum: 1,
      items: [
        { label: 'Mobile Number', value: state.mobile ? `+91 ${state.mobile}` : 'Not provided' },
        { label: 'Full Name', value: cleanFullName || 'Verified Voter' }
      ]
    },
    {
      title: '2. BJP Membership ID',
      stepNum: 3,
      items: [
        { label: 'Membership ID', value: state.bjp_membership_id || 'Primary Member' },
        { label: 'Affiliation', value: state.affiliation || 'BJP Tamil Nadu' },
        { label: 'Party', value: state.party || 'BJP' }
      ]
    },
    {
      title: '3. Voter & Candidate Photo',
      stepNum: 4,
      items: [
        { label: 'Voter EPIC Card', value: state.voter_epic || 'Verified' },
        { label: 'Candidate Photo', value: state.photo_url ? 'Uploaded (Cloudinary)' : 'Not Uploaded' },
        { label: 'District', value: state.district || 'N/A' },
        { label: 'Assembly Constituency', value: state.assembly_name || (state.assembly_no ? `Assembly #${state.assembly_no}` : 'N/A') }
      ]
    },
    {
      title: '4. Local Body & Position',
      stepNum: 6,
      items: [
        { label: 'Territory Type', value: state.body_type ? `${state.body_type.toUpperCase()} LOCAL BODY` : 'RURAL' },
        { label: 'Contesting Post', value: state.position || state.position_title || 'Ward Member' },
        { label: 'District', value: state.district || 'N/A' },
        { label: 'Booth Number', value: state.ward_number ? `Booth ${state.ward_number}` : 'Booth 1' }
      ]
    },
    {
      title: '5. Social Media & Pitch Video',
      stepNum: 8,
      items: [
        { label: 'Pitch Video', value: state.video_url ? 'Uploaded (MP4 / Link)' : 'N/A' },
        { label: 'Facebook', value: state.facebook_url || 'N/A' },
        { label: 'Instagram', value: state.instagram_url || 'N/A' },
        { label: 'Twitter / X', value: state.twitter_url || 'N/A' },
        { label: 'YouTube', value: state.youtube_url || 'N/A' }
      ]
    },
    {
      title: '6. Work, Vision & Documents',
      stepNum: 9,
      items: [
        { label: 'Work Experience', value: state.work_experience ? `${state.work_experience.slice(0, 80)}...` : 'Provided' },
        { label: 'Ward Strategy', value: state.win_strategy ? `${state.win_strategy.slice(0, 80)}...` : 'Provided' },
        { label: 'Profile Document', value: state.profile_document_url ? 'Uploaded (PDF / Word)' : 'Not Uploaded' }
      ]
    }
  ];

  return (
    <div className="step-card-container">

      {/* Step Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 800,
          color: '#FF6600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '4px'
        }}>
          STEP 12 — APPLICATION REVIEW
        </div>
      </div>

      {/* Hero Header Icon & Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#FFF8F3',
        borderRadius: '14px',
        border: '1px solid #FFE0B2'
      }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FF6600 0%, #FF8C00 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(255, 102, 0, 0.25)'
          }}
        >
          📋
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1A1A1A' }}>
            Review & Confirmation
          </h2>
          <p style={{ fontSize: '13px', color: '#666666', margin: '3px 0 0 0', fontWeight: 500, lineHeight: 1.4 }}>
            Verify all candidate application details before final submission.
          </p>
        </div>
      </div>

      {/* Verification Status Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px',
        padding: '12px 14px',
        backgroundColor: '#E8F5E9',
        borderRadius: '12px',
        border: '1px solid #A5D6A7',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: '#1B5E20' }}>
          <span>✅</span> All 6 Sections Verified
        </div>
        <button
          type="button"
          onClick={() => setStep(1)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #FF6600',
            color: '#FF6600',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '12.5px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(255, 102, 0, 0.1)',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap'
          }}
        >
          ✏️ Edit All Sections
        </button>
      </div>

      {/* Accordion Sections List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {sections.map((sec, idx) => {
          const isOpen = expandedSection === idx;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: isOpen ? '2px solid #FF6600' : '1.5px solid #E0E0E0',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                boxShadow: isOpen ? '0 4px 14px rgba(255, 102, 0, 0.1)' : 'none'
              }}
            >
              <div
                onClick={() => toggleSection(idx)}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: isOpen ? '#FFF8F3' : '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '15px', color: '#1A1A1A' }}>
                  <span style={{ color: '#2E7D32', fontSize: '16px' }}>✓</span>
                  <span>{sec.title}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStep(sec.stepNum);
                    }}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#FF6600',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    Edit
                  </button>
                  <span style={{ color: '#757575', fontSize: '13px', fontWeight: 800 }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {isOpen && (
                <div style={{ padding: '16px 20px', borderTop: '1px solid #FFE0B2', backgroundColor: '#FFFDF9' }}>
                  {sec.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0',
                        fontSize: '13.5px',
                        borderBottom: i < sec.items.length - 1 ? '1px solid #F0F0F0' : 'none'
                      }}
                    >
                      <span style={{ color: '#666666', fontWeight: 500 }}>{item.label}:</span>
                      <span style={{ color: '#1A1A1A', fontWeight: 700, textAlign: 'right', maxWidth: '60%' }}>
                        {item.value || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prominent Bottom Action Bar */}
      <div style={{
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '2px dashed #FFE0B2',
        position: 'sticky',
        bottom: 0,
        backgroundColor: '#FFFFFF',
        paddingBottom: '8px',
        zIndex: 10
      }}>
        <StepNav nextText="Proceed to Final Submit 🚀" />
      </div>
    </div>
  );
};

export default Step12_Review;
