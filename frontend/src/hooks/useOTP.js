import { useState, useEffect } from 'react';
import axios from 'axios';

export const useOTP = (mobile, initialSeconds = 30) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (secondsLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const resendOTP = async () => {
    if (!canResend || !mobile) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/registrations/send-otp', { mobile });
      if (res.data.success) {
        setSecondsLeft(30);
        setCanResend(false);
      } else {
        setError(res.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error resending OTP');
    } finally {
      setLoading(false);
    }
  };

  return {
    secondsLeft,
    canResend,
    resendOTP,
    loading,
    error,
    setError
  };
};
