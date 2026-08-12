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
        {/* BJP Lotus Logo */}
        <img
          src="/bjp_logo.svg"
          alt="BJP"
          style={{
            height: '40px',
            width: 'auto',
            flexShrink: 0,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }}
          onError={(e) => { e.target.src = '/bjp_logo.png'; }}
        />
        <div>
          <h1 style={{ fontSize: '17px', fontWeight: 800, margin: 0, letterSpacing: '0.2px', lineHeight: 1.2 }}>
            Local Body Candidate Application
          </h1>
          <p style={{ fontSize: '11px', margin: '2px 0 0 0', opacity: 0.95, fontWeight: 400 }}>
            Simple steps • Verified information • Stronger local leadership
          </p>
        </div>
      </div>
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: '#FFFFFF',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '12px',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          whiteSpace: 'nowrap'
        }}
      >
        <i className="bi bi-house-door-fill" /> Home Portal
      </a>
    </header>
  );
};

export default RegistrationHeader;
