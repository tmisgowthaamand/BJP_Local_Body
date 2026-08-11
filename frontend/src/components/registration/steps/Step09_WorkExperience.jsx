import React, { useState } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';

const QUICK_CHIPS = [
  '🤝 Social Service',
  '🚩 BJP Party Work',
  '🏛️ Local Development',
  '👥 Community Leadership'
];

const Step09_WorkExperience = () => {
  const { state, updateForm } = useApplication();
  const [experience, setExperience] = useState(state.work_experience || '');
  const [error, setError] = useState('');

  const countWords = (str) => {
    if (!str || !str.trim()) return 0;
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  const wordCount = countWords(experience);

  const handleChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length > 500 && text.length > experience.length) {
      return; // Block input over 500 words
    }
    setExperience(text);
    setError('');
  };

  const handleInsertChip = (chipText) => {
    const topic = chipText.replace(/^[^\s]+\s*/, '');
    const addedText = experience ? `${experience}\n- Active involvement in ${topic}: ` : `Active involvement in ${topic}: `;
    setExperience(addedText);
    setError('');
  };

  const handleNext = () => {
    if (wordCount < 10) {
      setError('Please provide at least 10 words describing your work and public service experience.');
      return false;
    }
    updateForm({ work_experience: experience.trim() });
    return true;
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '36px 32px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      border: '1px solid #E0E0E0',
      borderTop: '4px solid #FF6600'
    }}>

      {/* Step Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 800,
          color: '#FF6600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '6px'
        }}>
          06 WORK & EXPERIENCE
        </div>
      </div>

      {/* Hero Header Icon & Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '28px',
        padding: '20px',
        backgroundColor: '#FFF8F3',
        borderRadius: '14px',
        border: '1px solid #FFE0B2'
      }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FF6600 0%, #FF8C00 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(255, 102, 0, 0.25)'
          }}
        >
          📝
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1A1A1A' }}>
            Your Work & Experience
          </h2>
          <p style={{ fontSize: '13px', color: '#666666', margin: '3px 0 0 0', fontWeight: 500, lineHeight: 1.4 }}>
            Detail your political involvement, social service, and community leadership work.
          </p>
        </div>
      </div>



      {/* Experience Input Area */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
            Work Experience & Party Contribution
          </label>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            color: wordCount >= 10 ? '#2E7D32' : '#D32F2F',
            backgroundColor: wordCount >= 10 ? '#E8F5E9' : '#FFEBEE',
            padding: '3px 10px',
            borderRadius: '12px'
          }}>
            {wordCount >= 10 ? '✓ Min 10 words met' : 'Min 10 words'}
          </span>
        </div>

        <textarea
          rows={6}
          value={experience}
          onChange={handleChange}
          placeholder="Write about your social service, party work, local development contributions, and community involvement... (max 500 words)"
          style={{
            width: '100%',
            minHeight: '160px',
            padding: '16px',
            borderRadius: '12px',
            border: '1.5px solid #D6D6D6',
            fontSize: '15px',
            lineHeight: '1.6',
            fontWeight: 500,
            outline: 'none',
            backgroundColor: '#F9F9F9',
            color: '#1A1A1A',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <span style={{ fontSize: '12.5px', color: '#757575', fontWeight: 500 }}>
            Be detailed to strengthen your candidacy evaluation.
          </span>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: wordCount > 500 ? '#C62828' : '#666666'
          }}>
            {wordCount} / 500 words
          </span>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px', backgroundColor: '#FFEBEE', color: '#C62828',
          borderRadius: '10px', fontSize: '13.5px', marginBottom: '20px',
          borderLeft: '4px solid #D32F2F', fontWeight: 600
        }}>
          ⚠️ {error}
        </div>
      )}

      <StepNav onNext={handleNext} />
    </div>
  );
};

export default Step09_WorkExperience;
