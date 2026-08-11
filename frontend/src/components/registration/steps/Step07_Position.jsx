import React, { useState } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';

const Step07_Position = () => {
  const { state, updateForm } = useApplication();
  const [positionTitle, setPositionTitle] = useState(state.position_title || state.position || 'Ward Member');
  const [pref1, setPref1] = useState(state.preference_1 !== undefined ? state.preference_1 : true);
  const [pref2, setPref2] = useState(state.preference_2 || false);
  const [pref3, setPref3] = useState(state.preference_3 || false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!positionTitle) {
      setError('Please select a position to contest');
      return false;
    }
    updateForm({
      position_title: positionTitle,
      role: 'confirmed',
      preference_1: pref1,
      preference_2: pref2,
      preference_3: pref3
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
          04 POSITION & PREFERENCES
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
          ⭐
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1A1A1A' }}>
            Position to Contest
          </h2>
          <p style={{ fontSize: '13px', color: '#666666', margin: '3px 0 0 0', fontWeight: 500, lineHeight: 1.4 }}>
            Specify the post you wish to contest and select your preference priorities.
          </p>
        </div>
      </div>

      {/* Contesting Post Selection */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px' }}>
          Contesting Post
        </label>
        <select
          value={positionTitle}
          onChange={(e) => {
            setPositionTitle(e.target.value);
            setError('');
          }}
          style={{
            width: '100%',
            height: '50px',
            padding: '0 16px',
            borderRadius: '10px',
            border: '1.5px solid #D6D6D6',
            fontSize: '15px',
            fontWeight: 600,
            backgroundColor: '#F9F9F9',
            color: '#1A1A1A',
            outline: 'none',
            cursor: 'pointer',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
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
      <div style={{ marginBottom: '28px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#1A1A1A', marginBottom: '12px' }}>
          Preference Hierarchy
        </label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* 1st Preference */}
          <div
            onClick={() => setPref1(!pref1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: '12px',
              border: pref1 ? '2px solid #FF6600' : '1.5px solid #E0E0E0',
              backgroundColor: pref1 ? '#FFF8F3' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: pref1 ? '0 2px 8px rgba(255, 102, 0, 0.12)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                checked={pref1}
                onChange={() => {}}
                style={{ width: '20px', height: '20px', accentColor: '#FF6600', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', fontWeight: 700, color: pref1 ? '#FF6600' : '#1A1A1A' }}>
                1st Preference (Primary choice)
              </span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: pref1 ? '#FF6600' : '#757575', backgroundColor: pref1 ? '#FFE0B2' : '#F5F5F5', padding: '4px 10px', borderRadius: '20px' }}>
              Priority #1
            </span>
          </div>

          {/* 2nd Preference */}
          <div
            onClick={() => setPref2(!pref2)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: '12px',
              border: pref2 ? '2px solid #FF6600' : '1.5px solid #E0E0E0',
              backgroundColor: pref2 ? '#FFF8F3' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: pref2 ? '0 2px 8px rgba(255, 102, 0, 0.12)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                checked={pref2}
                onChange={() => {}}
                style={{ width: '20px', height: '20px', accentColor: '#FF6600', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', fontWeight: 700, color: pref2 ? '#FF6600' : '#1A1A1A' }}>
                2nd Preference (Secondary alternative)
              </span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: pref2 ? '#FF6600' : '#757575', backgroundColor: pref2 ? '#FFE0B2' : '#F5F5F5', padding: '4px 10px', borderRadius: '20px' }}>
              Priority #2
            </span>
          </div>

          {/* 3rd Preference */}
          <div
            onClick={() => setPref3(!pref3)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: '12px',
              border: pref3 ? '2px solid #FF6600' : '1.5px solid #E0E0E0',
              backgroundColor: pref3 ? '#FFF8F3' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: pref3 ? '0 2px 8px rgba(255, 102, 0, 0.12)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                checked={pref3}
                onChange={() => {}}
                style={{ width: '20px', height: '20px', accentColor: '#FF6600', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', fontWeight: 700, color: pref3 ? '#FF6600' : '#1A1A1A' }}>
                3rd Preference (Tertiary option)
              </span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: pref3 ? '#FF6600' : '#757575', backgroundColor: pref3 ? '#FFE0B2' : '#F5F5F5', padding: '4px 10px', borderRadius: '20px' }}>
              Priority #3
            </span>
          </div>

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

export default Step07_Position;
