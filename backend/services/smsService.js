const https = require('https');

/**
 * Send OTP via Fast2SMS Quick SMS Route (route=q)
 * Confirmed working via GET with URL query params.
 * Route Q bypasses DLT/OTP website verification (Error 996).
 */
const sendSmsOtp = async (mobile, otp) => {
  const apiKey = process.env.FAST2SMS_API_KEY || process.env.SMS_API_KEY;
  const cleanMobile = mobile.replace(/[^0-9]/g, '');

  if (!apiKey) {
    console.error('[SMS Service] Fast2SMS API key is not configured — cannot send OTP.');
    return { success: false, message: 'SMS API key not configured' };
  }

  const messageText = `Your BJP Candidate Portal OTP is ${otp}. Do not share with anyone.`;
  console.log(`[SMS Service] Dispatching OTP ${otp} to +91${cleanMobile} via Fast2SMS Route Q...`);

  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(apiKey)}&route=q&message=${encodeURIComponent(messageText)}&language=english&flash=0&numbers=${cleanMobile}`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.return === true) {
            console.log(`[Fast2SMS SMS Sent] OTP ${otp} delivered to ${cleanMobile}. Request ID: ${parsed.request_id}`);
            resolve({ success: true, requestId: parsed.request_id, message: 'OTP SMS sent successfully' });
          } else {
            console.error(`[Fast2SMS Error]:`, parsed);
            resolve({ success: false, message: String(parsed.message || 'SMS delivery failed') });
          }
        } catch (e) {
          console.error('[Fast2SMS Parse Error]:', data);
          resolve({ success: false, message: 'SMS response parse error' });
        }
      });
    }).on('error', (err) => {
      console.error('[Fast2SMS Network Error]:', err.message);
      resolve({ success: false, message: 'SMS network error: ' + err.message });
    });
  });
};

module.exports = {
  sendSmsOtp
};
