import React from 'react';

const STEP_NAMES = [
  'Mobile Number',
  'OTP Verification',
  'BJP Membership ID',
  'Voter ID Verification',
  'Electoral Area',
  'Local Body Details',
  'Position to Contest',
  'Social Media Profiles',
  'Work Experience',
  'Local Area Understanding',
  'Review & Confirmation',
  'Application Submission'
];

const ProgressBar = ({ currentStep }) => {
  const percentage = Math.round((currentStep / 12) * 100);
  const stepTitle = STEP_NAMES[currentStep - 1] || 'Registration';

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Progress Track */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#E0E0E0',
          height: '6px',
          borderRadius: '3px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            backgroundColor: '#FF6600',
            height: '100%',
            transition: 'width 0.3s ease-in-out'
          }}
        />
      </div>

      {/* Progress Label */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '8px',
          fontSize: '14px',
          fontWeight: 700,
          color: '#1B5E20'
        }}
      >
        <span>
          Step {currentStep} of 12 — {stepTitle}
        </span>
        <span style={{ color: '#FF6600', fontWeight: 800 }}>{percentage}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
