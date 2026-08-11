import React from 'react';

const RegistrationHeader = () => {
  return (
    <header
      style={{
        background: 'linear-gradient(90deg, #FF6600 0%, #FF8C00 60%, #2E7D32 85%, #1B5E20 100%)',
        minHeight: '60px',
        padding: '10px 16px',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <div>
          <h1 style={{ fontSize: '17px', fontWeight: 800, margin: 0, letterSpacing: '0.2px', lineHeight: 1.2 }}>
            Local Body Candidate Application
          </h1>
          <p style={{ fontSize: '11px', margin: '2px 0 0 0', opacity: 0.9, fontWeight: 400 }}>
            Simple steps • Verified information • Stronger local leadership
          </p>
        </div>
      </div>
    </header>
  );
};

export default RegistrationHeader;
