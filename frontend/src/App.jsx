import React, { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';

const ChatbotPage = lazy(() => import('./pages/ChatbotPage'));
const ReferralPage = lazy(() => import('./pages/ReferralPage'));
const AdminPortal = lazy(() => import('./pages/AdminPortal'));
const CandidateRegistration = lazy(() => import('./pages/CandidateRegistration'));

const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)'
  }}>
    <div style={{
      width: '44px',
      height: '44px',
      border: '4px solid #FF6B00',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const MainAppContent = () => {
  const { admin } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isRegistrationRoute = currentPath.startsWith('/candidate-registration');
  const isAdminRoute = currentPath.startsWith('/admin') || (!!admin && !isRegistrationRoute);
  const isReferralRoute = currentPath.startsWith('/r/');

  return (
    <Suspense fallback={<PageLoader />}>
      {isRegistrationRoute ? (
        <CandidateRegistration />
      ) : isAdminRoute ? (
        <AdminPortal />
      ) : isReferralRoute ? (
        <ReferralPage />
      ) : (
        <LanguageProvider>
          <ChatbotPage />
        </LanguageProvider>
      )}
    </Suspense>
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
