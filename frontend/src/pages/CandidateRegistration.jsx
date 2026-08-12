import React from 'react';
import { ApplicationProvider, useApplication } from '../context/ApplicationContext';
import RegistrationHeader from '../components/registration/RegistrationHeader';
import RegistrationFooter from '../components/registration/RegistrationFooter';
import ProgressBar from '../components/registration/ProgressBar';

import Step01_Mobile from '../components/registration/steps/Step01_Mobile';
import Step02_OTP from '../components/registration/steps/Step02_OTP';
import Step03_MembershipID from '../components/registration/steps/Step03_MembershipID';
import Step04_VoterID from '../components/registration/steps/Step04_VoterID';
import Step05_ElectoralArea from '../components/registration/steps/Step05_ElectoralArea';
import Step06_LocalBodyDetails from '../components/registration/steps/Step06_LocalBodyDetails';
import Step07_Position from '../components/registration/steps/Step07_Position';
import Step08_SocialMedia from '../components/registration/steps/Step08_SocialMedia';
import Step09_WorkExperience from '../components/registration/steps/Step09_WorkExperience';
import Step10_LocalUnderstanding from '../components/registration/steps/Step10_LocalUnderstanding';
import Step11_Review from '../components/registration/steps/Step11_Review';
import Step12_Submit from '../components/registration/steps/Step12_Submit';

import '../styles/registration-theme.css';

const StepRenderer = () => {
  const { state } = useApplication();

  switch (state.step) {
    case 1:
      return <Step01_Mobile />;
    case 2:
      return <Step02_OTP />;
    case 3:
      return <Step03_MembershipID />;
    case 4:
      return <Step04_VoterID />;
    case 5:
      return <Step05_ElectoralArea />;
    case 6:
      return <Step06_LocalBodyDetails />;
    case 7:
      return <Step07_Position />;
    case 8:
      return <Step08_SocialMedia />;
    case 9:
      return <Step09_WorkExperience />;
    case 10:
      return <Step10_LocalUnderstanding />;
    case 11:
      return <Step11_Review />;
    case 12:
      return <Step12_Submit />;
    default:
      return <Step01_Mobile />;
  }
};

const CandidateRegistrationContent = () => {
  const { state } = useApplication();

  return (
    <div className="reg-page-container">
      <RegistrationHeader />

      <main className="reg-content-wrapper">
        <ProgressBar currentStep={state.step} />
        <StepRenderer />
      </main>

      <RegistrationFooter />
    </div>
  );
};

const CandidateRegistration = () => {
  return (
    <ApplicationProvider>
      <CandidateRegistrationContent />
    </ApplicationProvider>
  );
};

export default CandidateRegistration;
