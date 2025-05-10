import axios from 'axios';
import { auth } from '../firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper function to refresh token
const refreshToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const newToken = await user.getIdToken(true);
    localStorage.setItem('token', newToken);
    return newToken;
  }
  return null;
};

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        if (newToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const userService = {
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      if (error.response?.data?.code === 'AUTH_INVALID_TOKEN') {
        localStorage.removeItem('token');
      }
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  updateUser: async (userData) => {
    try {
      const response = await api.put('/auth/me', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  updateRiderDetails: async (riderDetails) => {
    try {
      const response = await api.put('/auth/me/rider', riderDetails);
      return response.data;
    } catch (error) {
      console.error('Error updating rider details:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  },

  registerUser: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error.response?.data || error.message);
      throw error;
    }
  },

  googleLogin: async (authData) => {
    try {
      const response = await api.post('/auth/google', authData);
      return response.data;
    } catch (error) {
      console.error('Error google login/signup:', error.response?.data || error.message);
      throw error;
    }
  }

  
};