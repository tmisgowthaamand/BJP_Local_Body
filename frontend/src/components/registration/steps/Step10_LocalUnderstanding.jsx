import React, { useState } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';

const Step10_LocalUnderstanding = () => {
  const { state, updateForm } = useApplication();
  const [understanding, setUnderstanding] = useState(state.local_understanding || '');
  const [error, setError] = useState('');

  const countWords = (str) => {
    if (!str || !str.trim()) return 0;
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  const wordCount = countWords(understanding);

  const handleChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length > 500 && text.length > understanding.length) {
      return;
    }
    setUnderstanding(text);
    setError('');
  };

  const handleNext = () => {
    if (wordCount < 10) {
      setError('Please provide at least 10 words outlining your local body understanding and goals.');
      return false;
    }
    updateForm({ local_understanding: understanding.trim() });
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
          07 LOCAL AREA VISION
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
          📖
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1A1A1A' }}>
            Local Body Understanding
          </h2>
          <p style={{ fontSize: '13px', color: '#666666', margin: '3px 0 0 0', fontWeight: 500, lineHeight: 1.4 }}>
            Share your vision, ward issue analysis, and strategic plans for civic development.
          </p>
        </div>
      </div>

      {/* Understanding Input Area */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
            Ward Issues & Key Priorities
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
          value={understanding}
          onChange={handleChange}
          placeholder="What are the major issues in your ward?&#10;What are the three most important things you would like to change if elected? (max 500 words)"
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
            Highlight specific local concerns and proposed solutions.
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

export default Step10_LocalUnderstanding;
