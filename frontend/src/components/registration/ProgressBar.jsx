import React from 'react';

const STEP_NAMES = [
  'Mobile Number',
  'OTP Verification',
  'BJP Membership ID',
  'Voter ID & Photo Upload',
  'Electoral Area',
  'Local Body Details',
  'Position to Contest',
  'Social Media & Pitch Video',
  'Work Experience & Gov Profile',
  'Ward Understanding & Strategy',
  'Candidate Profile Document',
  'Review & Confirmation',
  'Final Submission & Card'
];

const ProgressBar = ({ currentStep }) => {
  const percentage = Math.round((currentStep / 13) * 100);
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
          Step {currentStep} of 13 — {stepTitle}
        </span>
        <span style={{ color: '#FF6600', fontWeight: 800 }}>{percentage}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
