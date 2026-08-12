import React from 'react';

const RegistrationFooter = () => {
  return (
    <footer
      style={{
        background: '#1B5E20',
        color: '#FFFFFF',
        padding: '20px 16px',
        textAlign: 'center',
        marginTop: 'auto',
        borderTop: '3px solid #FF6600'
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {/* BJP Lotus Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
          <img
            src="/bjp_logo.svg"
            alt="BJP Lotus"
            style={{
              height: '42px',
              width: 'auto',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))'
            }}
            onError={(e) => { e.target.src = '/bjp_logo.png'; }}
          />
        </div>

        <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#FFFFFF' }}>
          STRONGER BOOTHS • STRONGER LOCAL BODIES • A STRONGER INDIA
        </div>

        <div style={{ fontStyle: 'italic', color: '#FF9933', fontWeight: 700, fontSize: '13px' }}>
          Build • Participate • Lead
        </div>

        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>
          © 2026 Bharatiya Janata Party — Tamil Nadu. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default RegistrationFooter;
