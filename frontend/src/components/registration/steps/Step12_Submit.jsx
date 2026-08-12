import React, { useState } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import axios from 'axios';

const Step12_Submit = () => {
  const { state, updateForm, resetForm, setStep } = useApplication();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(Boolean(state.application_id));
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        mobile: state.mobile,
        full_name: state.full_name,
        passcode: state.passcode,
        role: state.role || 'confirmed',
        affiliation: state.affiliation || 'affiliated',
        party: state.party || 'BJP',
        district: state.district,
        body_type: state.body_type,
        position: state.position || state.position_title,
        union_or_municipality: state.union_or_municipality || state.district,
        panchayat_or_corporation: state.panchayat_or_corporation || `Booth ${state.ward_number || 1}`,
        ward_number: state.ward_number || '1',
        work_experience: state.work_experience,
        local_understanding: state.local_understanding,
        facebook_url: state.facebook_url,
        instagram_url: state.instagram_url,
        twitter_url: state.twitter_url,
        youtube_url: state.youtube_url,
        bjp_membership_id: state.bjp_membership_id,
        voter_epic: state.voter_epic,
        assembly_no: state.assembly_no,
        booth_no: state.booth_no,
        polling_station: state.polling_station,
        preference_1: state.preference_1,
        preference_2: state.preference_2,
        preference_3: state.preference_3
      };

      const res = await axios.post('/api/registrations/submit', payload);

      if (res.data.success) {
        updateForm({
          application_id: res.data.applicationId,
          submitted_at: res.data.submittedAt
        });
        localStorage.setItem('bjp_candidate_app_id', res.data.applicationId);
        localStorage.setItem('bjp_candidate_app_details', JSON.stringify({
          applicationId: res.data.applicationId,
          name: state.full_name,
          mobile: state.mobile,
          district: state.district,
          assemblyName: state.assembly_name || state.union_or_municipality,
          assembly_no: state.assembly_no || '',
          localBody: state.union_or_municipality,
          ward: state.panchayat_or_corporation,
          ward_number: state.ward_number,
          voter_epic: state.voter_epic || '',
          booth_no: state.booth_no || state.ward_number || '',
          polling_station: state.polling_station || '',
          gender: state.gender || state.voter_data?.GENDER || '',
          position: state.position || '',
          body_type: state.body_type || '',
          bjp_membership_id: state.bjp_membership_id || '',
          submittedAt: res.data.submittedAt
        }));
        window.dispatchEvent(new Event('candidate_app_submitted'));
        setSubmitted(true);
      } else {
        setError(res.data.message || 'Submission failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDone = () => {
    window.location.href = '/';
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '36px 32px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      border: '1px solid #E0E0E0',
      borderTop: '4px solid #FF6600'
    }}>

      {/* Step Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 800,
          color: '#FF6600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '6px'
        }}>
          09 FINAL APPLICATION SUBMISSION
        </div>
      </div>

      {/* Hero Header Icon & Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '28px',
        padding: '20px',
        backgroundColor: submitted ? '#E8F5E9' : '#FFF8F3',
        borderRadius: '14px',
        border: submitted ? '1px solid #A5D6A7' : '1px solid #FFE0B2'
      }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: submitted ? 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' : 'linear-gradient(135deg, #FF6600 0%, #FF8C00 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            flexShrink: 0,
            boxShadow: submitted ? '0 4px 12px rgba(27, 94, 32, 0.25)' : '0 4px 12px rgba(255, 102, 0, 0.25)'
          }}
        >
          {submitted ? '🌟' : '📄'}
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1A1A1A' }}>
            {submitted ? 'Application Submitted Successfully!' : 'Final Application Submission'}
          </h2>
          <p style={{ fontSize: '13px', color: '#666666', margin: '3px 0 0 0', fontWeight: 500, lineHeight: 1.4 }}>
            {submitted ? 'Your candidate registration has been officially recorded.' : 'Click below to submit your details to the election system.'}
          </p>
        </div>
      </div>

      {submitted ? (
        <div style={{
          backgroundColor: '#FFF8F3',
          borderRadius: '14px',
          padding: '24px',
          border: '1.5px solid #FF6600',
          marginBottom: '28px',
          boxShadow: '0 4px 16px rgba(255, 102, 0, 0.08)'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FF6600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌟</span> Official Receipt Confirmation
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#1A1A1A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #FFE0B2' }}>
              <span style={{ color: '#666666', fontWeight: 500 }}>Application ID:</span>
              <span style={{ color: '#FF6600', fontWeight: 800, fontSize: '16px', letterSpacing: '0.5px' }}>
                {state.application_id || 'BJP-APP-SUCCESS'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #FFE0B2' }}>
              <span style={{ color: '#666666', fontWeight: 500 }}>Candidate Name:</span>
              <span style={{ fontWeight: 700 }}>{state.full_name || 'Candidate'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #FFE0B2' }}>
              <span style={{ color: '#666666', fontWeight: 500 }}>Mobile Number:</span>
              <span style={{ fontWeight: 700 }}>+91 {state.mobile}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #FFE0B2' }}>
              <span style={{ color: '#666666', fontWeight: 500 }}>District & Constituency:</span>
              <span style={{ fontWeight: 700 }}>{state.district} ({state.assembly_name || 'Assembly'})</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666666', fontWeight: 500 }}>Submission Timestamp:</span>
              <span style={{ fontWeight: 700 }}>
                {state.submitted_at ? new Date(state.submitted_at).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#FAFAFA',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #E0E0E0',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#2E7D32', marginBottom: '8px' }}>
            <span>🔒</span> Verified Official Declaration
          </div>
          <p style={{ fontSize: '13.5px', color: '#555555', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            By submitting this application, you certify that all entered membership, voter roll, and local body details are true and accurate according to official records.
          </p>
        </div>
      )}

      {error && (
        <div style={{
          padding: '12px 16px', backgroundColor: '#FFEBEE', color: '#C62828',
          borderRadius: '10px', fontSize: '13.5px', marginBottom: '20px',
          borderLeft: '4px solid #D32F2F', fontWeight: 600
        }}>
          ⚠️ {error}
        </div>
      )}

      {submitted ? (
        <button
          type="button"
          onClick={handleDone}
          style={{
            width: '100%',
            height: '52px',
            backgroundColor: '#1B5E20',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(27, 94, 32, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          Done → (View Application & Profile Menu)
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          <button
            type="button"
            onClick={() => setStep(11)}
            style={{
              height: '52px',
              padding: '0 24px',
              borderRadius: '10px',
              border: '2px solid #FF6600',
              backgroundColor: '#FFFFFF',
              color: '#FF6600',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              flex: '1'
            }}
          >
            ← Back to Review
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              height: '52px',
              padding: '0 28px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: submitting ? '#CCCCCC' : '#FF6600',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '16px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              flex: '1.5',
              boxShadow: submitting ? 'none' : '0 4px 14px rgba(255, 102, 0, 0.35)'
            }}
          >
            {submitting ? 'Submitting Application...' : 'Submit Application →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Step12_Submit;
