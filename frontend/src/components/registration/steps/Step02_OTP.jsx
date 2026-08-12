import React, { useState, useRef, useEffect } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import { useOTP } from '../../../hooks/useOTP';
import StepNav from '../StepNav';
import API from '../../../utils/api';

const Step02_OTP = () => {
  const { state, updateForm, nextStep, prevStep, setStep } = useApplication();
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef([]);

  const { secondsLeft, canResend, resendOTP, error, setError } = useOTP(state.mobile, 30);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (/\D/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setError('');

    // Auto-focus next input box
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit on 6th digit entered
    if (index === 5 && value && newDigits.every((d) => d !== '')) {
      verifyCode(newDigits.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length === 6) {
      const digits = pasteData.split('');
      setOtpDigits(digits);
      verifyCode(pasteData);
    }
  };

  const verifyCode = async (otpValue) => {
    setVerifying(true);
    setError('');
    try {
      let res;
      try {
        res = await API.post('/registrations/verify-otp', {
          mobile: state.mobile,
          otp: otpValue
        });
      } catch (err1) {
        res = await API.post('/verify-otp', {
          mobile: state.mobile,
          otp: otpValue
        });
      }
      if (res.data.success) {
        updateForm({ passcode: otpValue });
        if (res.data.existingApplication) {
          const app = res.data.existingApplication;
          localStorage.setItem('bjp_candidate_app_id', app.applicationId);
          localStorage.setItem('bjp_candidate_app_details', JSON.stringify({
            applicationId: app.applicationId,
            name: app.full_name,
            mobile: app.mobile,
            district: app.district,
            localBody: app.union_or_municipality,
            ward: app.panchayat_or_corporation,
            ward_number: app.ward_number,
            voter_epic: app.voter_epic || '',
            gender: app.gender || '',
            booth_no: app.booth_no || '',
            polling_station: app.polling_station || '',
            assembly_no: app.assembly_no || '',
            position: app.position || '',
            body_type: app.body_type || '',
            bjp_membership_id: app.bjp_membership_id || '',
            submittedAt: app.submittedAt
          }));
          window.dispatchEvent(new Event('candidate_app_submitted'));
          window.dispatchEvent(new CustomEvent('candidate_app_verified_existing', { detail: app }));
          updateForm({
            full_name: app.full_name,
            application_id: app.applicationId,
            submitted_at: app.submittedAt,
            district: app.district,
            position: app.position,
            body_type: app.body_type,
            union_or_municipality: app.union_or_municipality,
            panchayat_or_corporation: app.panchayat_or_corporation,
            ward_number: app.ward_number,
            bjp_membership_id: app.bjp_membership_id,
            voter_epic: app.voter_epic,
            gender: app.gender
          });
          setStep(12);
        } else {
          nextStep();
        }
      } else {
        setError('Invalid OTP. Try again.');
        setOtpDigits(['', '', '', '', '', '']);
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Try again.');
      setOtpDigits(['', '', '', '', '', '']);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } finally {
      setVerifying(false);
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
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
          🔑
        </div>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#1B5E20' }}>Enter Verification OTP</h2>
          <p style={{ fontSize: '14px', color: '#2E7D32', margin: '4px 0 0 0' }}>
            We sent a 6-digit code to <strong>+91 {state.mobile}</strong>
          </p>
        </div>
      </div>

      {/* 6 Digit Input Boxes */}
      <div
        onPaste={handlePaste}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '24px'
        }}
      >
        {otpDigits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            style={{
              width: '48px',
              height: '56px',
              borderRadius: '10px',
              border: '2px solid #FFB74D',
              fontSize: '22px',
              fontWeight: 800,
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              color: '#1B5E20',
              outline: 'none',
              boxShadow: digit ? '0 2px 8px rgba(255, 102, 0, 0.2)' : 'none'
            }}
          />
        ))}
      </div>

      {/* Timer / Resend */}
      <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '14px', fontWeight: 600 }}>
        {canResend ? (
          <button
            type="button"
            onClick={resendOTP}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF6600',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ⟳ Resend OTP
          </button>
        ) : (
          <span style={{ color: '#EF6C00' }}>⟳ Resend OTP in {secondsLeft}s</span>
        )}
      </div>

      {error && (
        <div style={{ padding: '10px 14px', backgroundColor: '#FFEBEE', color: '#C62828', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      <button
        type="button"
        onClick={() => verifyCode(otpDigits.join(''))}
        disabled={otpDigits.some((d) => !d) || verifying}
        style={{
          width: '100%',
          height: '48px',
          backgroundColor: otpDigits.some((d) => !d) || verifying ? '#BDBDBD' : '#FF6600',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '16px',
          cursor: otpDigits.some((d) => !d) || verifying ? 'not-allowed' : 'pointer'
        }}
      >
        {verifying ? 'Verifying OTP...' : 'Verify OTP →'}
      </button>

      <div style={{ marginTop: '16px' }}>
        <button
          type="button"
          onClick={prevStep}
          style={{ background: 'none', border: 'none', color: '#E65100', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
        >
          ← Change Mobile Number
        </button>
      </div>
    </div>
  );
};

export default Step02_OTP;
