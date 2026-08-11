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
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
          STRONGER BOOTHS • STRONGER LOCAL BODIES • A STRONGER INDIA
        </div>

        <div style={{ fontStyle: 'italic', color: '#FF8C00', fontWeight: 600, fontSize: '13px' }}>
          Build • Participate • Lead
        </div>

        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
          © 2026 Bharatiya Janata Party — Tamil Nadu. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default RegistrationFooter;
