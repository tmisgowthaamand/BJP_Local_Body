import React, { useState } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';

const Step03_MembershipID = () => {
  const { state, updateForm } = useApplication();
  const [membershipId, setMembershipId] = useState(state.bjp_membership_id || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    updateForm({
      bjp_membership_id: membershipId.trim() || '',
      affiliation: membershipId.trim() ? 'affiliated' : 'party_member',
      party: 'BJP'
    });
    return true;
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
        borderLeft: '1px solid #FFE0B2',
        borderRight: '1px solid #FFE0B2',
        borderBottom: '1px solid #FFE0B2',
        borderTop: '4px solid #FF6600'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FF6600 0%, #E65100 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(255, 102, 0, 0.3)'
          }}
        >
          🪷
        </div>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#1B5E20' }}>
            BJP Membership ID <span style={{ fontSize: '13px', color: '#2E7D32', fontWeight: 600 }}>(Optional)</span>
          </h2>
          <p style={{ fontSize: '14px', color: '#2E7D32', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Provide your official Bharatiya Janata Party Primary Membership Number.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#E65100', marginBottom: '8px', letterSpacing: '0.3px' }}>
          MEMBERSHIP ID <span style={{ color: '#888888', fontWeight: 500 }}>(OPTIONAL)</span>
        </label>
        <input
          type="text"
          value={membershipId}
          onChange={(e) => {
            setMembershipId(e.target.value);
            setError('');
          }}
          placeholder="e.g. BJP-TN-1029384"
          style={{
            width: '100%',
            height: '52px',
            padding: '0 18px',
            borderRadius: '10px',
            border: '2px solid #FFB74D',
            fontSize: '18px',
            fontWeight: 700,
            outline: 'none',
            color: '#1B5E20',
            backgroundColor: '#FFFFFF',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
          }}
        />
        <div style={{ fontSize: '13px', color: '#666666', marginTop: '8px', fontWeight: 500 }}>
          💡 Optional: If you don't have a Membership ID yet, you can leave this blank and click <strong>Next →</strong>.
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#FFEBEE', color: '#C62828', borderRadius: '10px', fontSize: '13.5px', marginBottom: '20px', borderLeft: '4px solid #D32F2F', fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}

      <StepNav onNext={handleNext} nextDisabled={false} />
    </div>
  );
};

export default Step03_MembershipID;
