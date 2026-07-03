/**
 * @file api.js
 * @description Axios API client configured with interceptors for authentication.
 */

import axios from 'axios';

const API = axios.create({
  baseURL: `http://${window.location.hostname}:5000/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if present in localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (e.g. 401 Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, log out user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If we are not on the login or form page, redirect to login
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
