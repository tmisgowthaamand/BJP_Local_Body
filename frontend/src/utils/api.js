import axios from 'axios';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, '') + '/api';
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://bjp-local-body.onrender.com/api';
  }
  return '/api';
};

const API = axios.create({
  baseURL: getApiBaseUrl()
});

// Interceptor to attach User or Admin JWT token
API.interceptors.request.use((config) => {
  const userToken = localStorage.getItem('bjp_user_token');
  const adminToken = localStorage.getItem('bjp_admin_token');

  const token = (config.url?.startsWith('/admin') && adminToken) ? adminToken : userToken;
  if (token) {
    if (typeof config.headers?.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
