import React from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';

const FieldRow = ({ iconClass, label, value }) => (
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
    <div className="card-value">
      {value || '—'}
    </div>
  </div>
);

const Step05_ElectoralArea = () => {
  const { state } = useApplication();

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
          <i className="bi bi-geo-alt-fill" />
        </div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#1B5E20' }}>Your Electoral Area</h2>
          <p style={{ fontSize: '13px', color: '#2E7D32', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Auto-populated from official voter records. Read-only verification step.
          </p>
        </div>
      </div>

      {/* Confirmed badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        backgroundColor: '#E8F5E9', borderRadius: '20px',
        padding: '8px 16px', marginBottom: '24px',
        border: '1px solid #C8E6C9', width: '100%', boxSizing: 'border-box'
      }}>
        <i className="bi bi-patch-check-fill" style={{ color: '#2E7D32', fontSize: '15px', flexShrink: 0 }} />
        <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#2E7D32', letterSpacing: '0.2px' }}>
          Location confirmed from Voter Record
        </span>
      </div>

      {/* Fields — responsive grid */}
      <div className="voter-info-grid" style={{ marginBottom: '24px' }}>
        <FieldRow iconClass="bi-person-fill" label="Gender" value={state.gender || state.voter_data?.GENDER} />
        <FieldRow iconClass="bi-building-fill" label="District" value={state.district} />
        <FieldRow iconClass="bi-geo-alt-fill" label="Assembly Constituency" value={state.assembly_name || `Assembly ${state.assembly_no}`} />
        {state.body_type === 'urban' && <FieldRow iconClass="bi-box-seam-fill" label="Booth No. (Part)" value={state.booth_no} />}
        <FieldRow iconClass="bi-house-door-fill" label="Polling Station" value={state.polling_station} />
      </div>

      <StepNav nextText="Confirm & Continue →" />
    </div>
  );
};

export default Step05_ElectoralArea;
