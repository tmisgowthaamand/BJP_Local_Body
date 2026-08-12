import React, { useState } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';

const Step07_Position = () => {
  const { state, updateForm } = useApplication();
  const [positionTitle, setPositionTitle] = useState(state.position_title || state.position || 'Village Panchayat Ward Member');
  const [pref2Text, setPref2Text] = useState(typeof state.preference_2_text === 'string' ? state.preference_2_text : (state.preference_2 || ''));
  const [pref3Text, setPref3Text] = useState(typeof state.preference_3_text === 'string' ? state.preference_3_text : (state.preference_3 || ''));
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!positionTitle) {
      setError('Please select a primary position to contest');
      return false;
    }
    updateForm({
      position_title: positionTitle,
      role: 'confirmed',
      preference_1: positionTitle,
      preference_2: pref2Text,
      preference_2_text: pref2Text,
      preference_3: pref3Text,
      preference_3_text: pref3Text
    });
    return true;
  };

  const isRural = state.body_type === 'rural';

  const positionOptions = isRural
    ? [
        'Village Panchayat Ward Member',
        'Village Panchayat President',
        'Panchayat Union Ward Member',
        'District Panchayat Ward Member'
      ]
    : [
        'Town Panchayat Ward Member',
        'Municipal Councillor',
        'Corporation Councillor',
        'Town Panchayat Chairperson',
        'Municipal Chairperson',
        'Mayor'
      ];

  return (
    <div className="step-card-container">

      {/* Step Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 800,
          color: '#FF6600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '4px'
        }}>
          04 POSITION & PREFERENCES
        </div>
      </div>

      {/* Hero Header Icon & Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#FFF8F3',
        borderRadius: '14px',
        border: '1px solid #FFE0B2'
      }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FF6600 0%, #FF8C00 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(255, 102, 0, 0.25)'
          }}
        >
          ⭐
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1A1A1A' }}>
            Position to Contest
          </h2>
          <p style={{ fontSize: '13px', color: '#666666', margin: '3px 0 0 0', fontWeight: 500, lineHeight: 1.4 }}>
            Specify your primary post and enter manual alternative preferences (up to 100 characters each).
          </p>
        </div>
      </div>

      {/* Contesting Post Selection */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px' }}>
          Contesting Post (1st Preference)
        </label>
        <select
          value={positionTitle}
          onChange={(e) => {
            setPositionTitle(e.target.value);
            setError('');
          }}
          style={{
            width: '100%',
            height: '48px',
            padding: '0 14px',
            borderRadius: '10px',
            border: '2px solid #FFB74D',
            fontSize: '14.5px',
            fontWeight: 700,
            backgroundColor: '#FFFFFF',
            color: '#0F172A',
            outline: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        >
          {positionOptions.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Preference Hierarchy Cards */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#1A1A1A', marginBottom: '12px' }}>
          Preference Hierarchy & Manual Entry
        </label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* 1st Preference */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: '2px solid #FF6600',
              backgroundColor: '#FFF8F3',
              boxShadow: '0 2px 8px rgba(255, 102, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#FF6600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                1st Preference (Primary Choice)
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#FF6600', backgroundColor: '#FFE0B2', padding: '3px 10px', borderRadius: '20px' }}>
                Priority #1
              </span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
              {positionTitle}
            </div>
          </div>

          {/* 2nd Preference Manual Entry Input */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1.5px solid #FFE0B2',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#E65100', margin: 0, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                2nd Preference (Secondary Alternative)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: pref2Text.length >= 100 ? '#D32F2F' : '#888888' }}>
                  {pref2Text.length}/100
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#E65100', backgroundColor: '#FFF3E0', padding: '3px 10px', borderRadius: '20px' }}>
                  Priority #2
                </span>
              </div>
            </div>
            <input
              type="text"
              maxLength={100}
              value={pref2Text}
              onChange={(e) => setPref2Text(e.target.value)}
              placeholder="Type 2nd preference manual entry (up to 100 characters)..."
              style={{
                width: '100%',
                height: '46px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '1.5px solid #FFB74D',
                fontSize: '14px',
                fontWeight: 600,
                outline: 'none',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* 3rd Preference Manual Entry Input */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1.5px solid #FFE0B2',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#E65100', margin: 0, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                3rd Preference (Tertiary Option)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: pref3Text.length >= 100 ? '#D32F2F' : '#888888' }}>
                  {pref3Text.length}/100
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#E65100', backgroundColor: '#FFF3E0', padding: '3px 10px', borderRadius: '20px' }}>
                  Priority #3
                </span>
              </div>
            </div>
            <input
              type="text"
              maxLength={100}
              value={pref3Text}
              onChange={(e) => setPref3Text(e.target.value)}
              placeholder="Type 3rd preference manual entry (up to 100 characters)..."
              style={{
                width: '100%',
                height: '46px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '1.5px solid #FFB74D',
                fontSize: '14px',
                fontWeight: 600,
                outline: 'none',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                boxSizing: 'border-box'
              }}
            />
          </div>

        </div>
      </div>

      {error && (
        <div className="reg-error-box">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      <StepNav onNext={handleNext} />
    </div>
  );
};

export default Step07_Position;
