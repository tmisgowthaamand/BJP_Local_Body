import React, { useState, useRef } from 'react';
import { useApplication } from '../../../context/ApplicationContext';
import StepNav from '../StepNav';

const Step10_LocalUnderstanding = () => {
  const { state, updateForm } = useApplication();
  const [understanding, setUnderstanding] = useState(state.local_understanding || '');
  const [error, setError] = useState('');
  const [showInfoBox, setShowInfoBox] = useState(false);
  const infoBoxRef = useRef(null);
  const textareaRef = useRef(null);

  const countWords = (str) => {
    if (!str || !str.trim()) return 0;
    return str.trim().split(/\s+/).filter(Boolean).length;
  };

  const wordCount = countWords(understanding);

  const handleToggleInfoBox = () => {
    const next = !showInfoBox;
    setShowInfoBox(next);
    if (next) {
      setTimeout(() => {
        infoBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  };

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
              Ward Issues & Key Priorities
            </label>
            <button
              type="button"
              onClick={handleToggleInfoBox}
              title="Click (i) to view/hide sample reference text"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: showInfoBox ? '#E65100' : '#FF6600',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(255, 102, 0, 0.3)',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              i
            </button>
          </div>

          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            color: wordCount >= 10 ? '#FF6600' : '#D32F2F',
            backgroundColor: wordCount >= 10 ? '#FFF3E0' : '#FFEBEE',
            padding: '3px 10px',
            borderRadius: '12px'
          }}>
            {wordCount >= 10 ? '✓ Min 10 words met' : 'Min 10 words'}
          </span>
        </div>

        {/* Info Icon Sample Reference Text & Guidelines (Rendered Right Below Header for Instant Visibility) */}
        {showInfoBox && (
          <div
            ref={infoBoxRef}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1.5px solid #FF6600',
              boxShadow: '0 4px 18px rgba(255, 102, 0, 0.08)',
              marginTop: '10px',
              marginBottom: '16px',
              overflow: 'hidden'
            }}
          >
            {/* Header Banner */}
            <div style={{
              backgroundColor: '#FFF3E0',
              padding: '10px 16px',
              borderBottom: '1px solid #FFE0B2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#FF6600',
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 900
                }}>i</span>
                <div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#FF6600',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #FFE0B2',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                    marginRight: '6px'
                  }}>
                    SAMPLE REFERENCE TEXT
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#E65100' }}>
                    WARD VISION & PRIORITIES EXAMPLE
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowInfoBox(false)}
                title="Close sample box"
                style={{
                  background: '#FFE0B2',
                  border: 'none',
                  color: '#E65100',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 800
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              padding: '14px 16px',
              maxHeight: '180px',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: '#FF6600 #FFF3E0'
            }}>
              <div style={{
                fontSize: '13px',
                color: '#1E293B',
                lineHeight: 1.6,
                fontWeight: 500,
                backgroundColor: '#F8FAFC',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                fontStyle: 'italic',
                marginBottom: '12px',
                maxHeight: '110px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#FF6600 #FFF3E0'
              }}>
                "Key Ward Priorities: 1. Clean drinking water supply &amp; storm water drainage installation. 2. 24x7 street lights &amp; modern garbage management across all streets. 3. Establishing a digital skill training center for local youth &amp; women empowerment through Central Govt schemes."
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setUnderstanding("Key Ward Priorities: 1. Clean drinking water supply & storm water drainage installation. 2. 24x7 street lights & modern garbage management across all streets. 3. Establishing a digital skill training center for local youth & women empowerment through Central Govt schemes.");
                    setError('');
                    setTimeout(() => {
                      textareaRef.current?.focus();
                      textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 50);
                  }}
                  style={{
                    backgroundColor: '#FF6600',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 3px 10px rgba(255, 102, 0, 0.25)'
                  }}
                >
                  ✨ Use This Sample Text
                </button>

                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                  💡 Click button above to fill sample text &amp; edit it.
                </span>
              </div>
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          rows={6}
          value={understanding}
          onChange={handleChange}
          placeholder="What are the major issues in your ward?&#10;What are the three most important things you would like to change if elected? (max 500 words)"
          style={{
            width: '100%',
            minHeight: '160px',
            maxHeight: '280px',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#FF6600 #FFF3E0',
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



      {/* Ward Winning Campaign Strategy Question (★ Item 4) */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#FF6600', marginBottom: '8px' }}>
          🎯 What strategy do you have to win this ward?
        </label>
        <textarea
          rows={4}
          value={state.win_strategy || ''}
          onChange={(e) => updateForm({ win_strategy: e.target.value })}
          placeholder="Outline your ground campaign strategy, voter outreach plan, booth level team strength, and how you will secure majority support..."
          style={{
            width: '100%',
            minHeight: '120px',
            maxHeight: '220px',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#FF6600 #FFF3E0',
            padding: '14px',
            borderRadius: '10px',
            border: '1.5px solid #FFB74D',
            fontSize: '14.5px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <div style={{
          marginTop: '8px',
          padding: '12px 14px',
          backgroundColor: '#FFF8F3',
          borderRadius: '8px',
          fontSize: '12.5px',
          color: '#E65100'
        }}>
          💡 <strong>Sample Strategy Guide:</strong> "Booth Mobilization: Appoint 10 active page committee members per booth. Conduct 3 rounds of intensive door-to-door visits covering 4,200 households."
        </div>
      </div>

      {/* Reserved Extra Question 1 (★ Item 7) */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#1A1A1A', marginBottom: '6px' }}>
          ❓ Additional Question 1: Community Relief & Emergency Response (Optional)
        </label>
        <input
          type="text"
          value={state.extra_question_1 || ''}
          onChange={(e) => updateForm({ extra_question_1: e.target.value })}
          placeholder="Detail relief camps, blood donation drives, or emergency response work conducted by you..."
          style={{
            width: '100%',
            height: '46px',
            padding: '0 14px',
            borderRadius: '8px',
            border: '1px solid #CCCCCC',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Reserved Extra Question 2 (★ Item 7) */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#1A1A1A', marginBottom: '6px' }}>
          ❓ Additional Question 2: Booth Committee & Page Pramukh Strength (Optional)
        </label>
        <input
          type="text"
          value={state.extra_question_2 || ''}
          onChange={(e) => updateForm({ extra_question_2: e.target.value })}
          placeholder="State how many active Page Pramukhs and booth workers are ready in your ward..."
          style={{
            width: '100%',
            height: '46px',
            padding: '0 14px',
            borderRadius: '8px',
            border: '1px solid #CCCCCC',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
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
