import React, { useState } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';
import API from '../../../utils/api';

const Step01_Mobile = () => {
  const { state, updateForm, nextStep } = useApplication();
  const [mobile, setMobile] = useState(state.mobile || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(val);
    setError('');
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      let res;
      try {
        res = await API.post('/registrations/send-otp', { mobile });
      } catch (err1) {
        res = await API.post('/send-otp', { mobile });
      }

      if (res.data.success) {
        updateForm({ mobile });
        nextStep();
      } else {
        setError(res.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
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
          📱
        </div>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#1B5E20' }}>Mobile Verification</h2>
          <p style={{ fontSize: '14px', color: '#2E7D32', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Enter your 10-digit mobile number to get started with your candidate application.
          </p>
        </div>
      </div>

      <form onSubmit={handleSendOTP}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#E65100', marginBottom: '8px', letterSpacing: '0.3px' }}>
            MOBILE NUMBER
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
            <div
              style={{
                height: '52px',
                padding: '0 16px',
                backgroundColor: '#FFF3E0',
                border: '2px solid #FFB74D',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 800,
                color: '#E65100',
                fontSize: '16px',
                flexShrink: 0
              }}
            >
              +91
            </div>
            <input
              type="tel"
              maxLength={10}
              value={mobile}
              onChange={handleMobileChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && mobile.length === 10) {
                  handleSendOTP(e);
                }
              }}
              placeholder="9876543210"
              autoFocus
              style={{
                flex: 1,
                minWidth: 0,
                width: '100%',
                height: '52px',
                padding: '0 16px',
                fontSize: '18px',
                fontWeight: 700,
                borderRadius: '10px',
                border: error ? '2px solid #D32F2F' : '2px solid #FFB74D',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', backgroundColor: '#FFEBEE', color: '#C62828', borderRadius: '10px', fontSize: '13.5px', marginBottom: '20px', borderLeft: '4px solid #D32F2F', fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={mobile.length !== 10 || loading}
          style={{
            width: '100%',
            height: '52px',
            background: mobile.length !== 10 || loading ? '#D6D6D6' : 'linear-gradient(135deg, #FF6600 0%, #E65100 100%)',
            color: mobile.length !== 10 || loading ? '#888888' : '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '16px',
            letterSpacing: '0.5px',
            cursor: mobile.length !== 10 || loading ? 'not-allowed' : 'pointer',
            boxShadow: mobile.length === 10 && !loading ? '0 6px 18px rgba(255, 102, 0, 0.35)' : 'none',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          {loading ? 'Sending OTP...' : 'Send OTP →'}
        </button>
      </form>

      <StepNav showNext={false} showBack={false} />
    </div>
  );
};

export default Step01_Mobile;
