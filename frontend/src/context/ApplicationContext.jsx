import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  step: 1,
  mobile: '',
  passcode: '',
  bjp_membership_id: '',
  affiliation: 'affiliated',
  party: 'BJP',
  voter_epic: '',
  full_name: '',
  assembly_no: '',
  assembly_name: '',
  booth_no: '',
  polling_station: '',
  district: '',
  voter_data: null,
  body_type: 'rural', // 'rural' | 'urban'
  position: '',
  union_or_municipality: '',
  panchayat_or_corporation: '',
  ward_number: '',
  role: 'confirmed', // 'planning' | 'confirmed' | 'team'
  preference_1: true,
  preference_2: false,
  preference_3: false,
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  youtube_url: '',
  work_experience: '',
  local_understanding: '',
  photo_url: '',
  video_url: '',
  win_strategy: '',
  gov_profile: '',
  extra_question_1: '',
  extra_question_2: '',
  profile_document_url: '',
  bjp_membership_link_clicked: false,
  application_id: '',
  submitted_at: ''
};

function applicationReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: Math.min(Math.max(action.payload, 1), 13) };
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 13) };
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) };
    case 'UPDATE_FORM':
      return { ...state, ...action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(applicationReducer, initialState);

  const setStep = (stepNumber) => dispatch({ type: 'SET_STEP', payload: stepNumber });
  const nextStep = () => dispatch({ type: 'NEXT_STEP' });
  const prevStep = () => dispatch({ type: 'PREV_STEP' });
  const updateForm = (data) => dispatch({ type: 'UPDATE_FORM', payload: data });
  const resetForm = () => dispatch({ type: 'RESET' });

  return (
    <ApplicationContext.Provider
      value={{
        state,
        dispatch,
        setStep,
        nextStep,
        prevStep,
        updateForm,
        resetForm
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};
