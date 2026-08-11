import React from 'react';
import { useAuth } from '../context/AuthContext';

import AdminLoginPage from './admin/AdminLoginPage';
import SuperAdminDashboard from './admin/SuperAdminDashboard';

const AdminPortal = () => {
  const { admin } = useAuth();

  if (!admin) {
    return <AdminLoginPage />;
  }

  return <SuperAdminDashboard />;
};

export default AdminPortal;
