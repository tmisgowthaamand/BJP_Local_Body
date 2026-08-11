import React from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';

const FieldRow = ({ icon, label, value }) => (
  <div style={{
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px 20px',
    border: '1px solid #FFE0B2',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '13px' }}>{icon}</span>
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#FF6600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
    </div>
    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1A1A1A', paddingLeft: '2px' }}>
      {value || '—'}
    </div>
  </div>
);

const Step05_ElectoralArea = () => {
  const { state } = useApplication();

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
      borderLeft: '1px solid #FFE0B2',
      borderRight: '1px solid #FFE0B2',
      borderBottom: '1px solid #FFE0B2',
      borderTop: '4px solid #FF6600'
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #FF6600 0%, #E65100 100%)',
          color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '26px', flexShrink: 0, boxShadow: '0 4px 14px rgba(255, 102, 0, 0.3)'
        }}>
          📍
        </div>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#1B5E20' }}>Your Electoral Area</h2>
          <p style={{ fontSize: '14px', color: '#2E7D32', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Auto-populated from official voter records. Read-only verification step.
          </p>
        </div>
      </div>

      {/* Confirmed badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        backgroundColor: '#E8F5E9', borderRadius: '20px',
        padding: '8px 16px', marginBottom: '24px',
        border: '1px solid #C8E6C9'
      }}>
        <span style={{ fontSize: '15px' }}>✅</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#2E7D32', letterSpacing: '0.3px' }}>
          Location confirmed from Voter Record
        </span>
      </div>

      {/* Fields — 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '28px' }}>
        <FieldRow icon="👤" label="Gender" value={state.gender || state.voter_data?.GENDER} />
        <FieldRow icon="🏛️" label="District" value={state.district} />
        <FieldRow icon="📍" label="Assembly Constituency" value={state.assembly_name || `Assembly ${state.assembly_no}`} />
        {state.body_type === 'urban' && <FieldRow icon="🗳️" label="Booth No. (Part)" value={state.booth_no} />}
        <FieldRow icon="🏠" label="Polling Station" value={state.polling_station} />
      </div>

      <StepNav nextText="Confirm & Continue →" />
    </div>
  );
};

export default Step05_ElectoralArea;
