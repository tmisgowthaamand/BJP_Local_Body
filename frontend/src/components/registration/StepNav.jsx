import React from 'react';
import { useApplication } from '../../context/ApplicationContext';

const StepNav = ({ onNext, nextDisabled = false, nextText = 'Next →', showBack = true, showNext = true }) => {
  const { state, prevStep, nextStep } = useApplication();

  const handleNext = () => {
    if (onNext) {
      const isValid = onNext();
      if (isValid === false) return;
    }
    nextStep();
  };

  if (state.step === 12) {
    return null; // Step 12 renders its own submission / completion actions
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        marginTop: '20px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {showBack && state.step > 1 ? (
        <button
          type="button"
          onClick={prevStep}
          style={{
            height: '46px',
            padding: '0 12px',
            borderRadius: '8px',
            border: '2px solid #FF6600',
            backgroundColor: '#FFFFFF',
            color: '#FF6600',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: '1 1 0',
            minWidth: 0,
            boxSizing: 'border-box',
            whiteSpace: 'nowrap'
          }}
        >
          ← Back
        </button>
      ) : null}

      {showNext && (
        <button
          type="button"
          onClick={handleNext}
          disabled={nextDisabled}
          style={{
            height: '46px',
            padding: '0 12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: nextDisabled ? '#CCCCCC' : '#FF6600',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '13px',
            cursor: nextDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            flex: '1.2 1 0',
            minWidth: 0,
            boxSizing: 'border-box',
            boxShadow: nextDisabled ? 'none' : '0 4px 12px rgba(255, 102, 0, 0.3)',
            whiteSpace: 'nowrap'
          }}
        >
          {nextText}
        </button>
      )}
    </div>
  );
};

export default StepNav;
