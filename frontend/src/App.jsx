import React from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import ChatbotPage from './pages/ChatbotPage';
import ReferralPage from './pages/ReferralPage';
import Navbar from './components/Navbar';
import AdminPortal from './pages/AdminPortal';

import CandidateRegistration from './pages/CandidateRegistration';

const MainAppContent = () => {
  const { admin } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isRegistrationRoute = currentPath.startsWith('/candidate-registration');
  const isAdminRoute = currentPath.startsWith('/admin') || (!!admin && !isRegistrationRoute);
  const isReferralRoute = currentPath.startsWith('/r/');

  // 1. Render Candidate Registration Portal (Public 12-Step Wizard)
  if (isRegistrationRoute) {
    return <CandidateRegistration />;
  }

  // 2. Render Admin Portal if URL starts with /admin or admin is logged in
  if (isAdminRoute) {
    return <AdminPortal />;
  }

  // 3. Render Referral Handler if URL is /r/:ntCode
  if (isReferralRoute) {
    return <ReferralPage />;
  }

  // 3. Render New Conversational Automation User Portal
  return (
    <LanguageProvider>
      <ChatbotPage />
    </LanguageProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
};

export default App;
