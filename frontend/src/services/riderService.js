import axios from 'axios';
import { auth } from '../firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

export const riderService = {
  // Admin functions
  getAllRiders: async () => {
    try {
      const response = await api.get('/admin/riders');
      return response.data.riders;
    } catch (error) {
      console.error('Error fetching riders:', error);
      throw error;
    }
  },

  addRider: async (riderData) => {
    try {
      const response = await api.post('/admin/riders', riderData);
      return response.data;
    } catch (error) {
      console.error('Error adding rider:', error);
      throw error;
    }
  },

  updateRider: async (riderId, riderData) => {
    try {
      const response = await api.put(`/admin/riders/${riderId}`, riderData);
      return response.data;
    } catch (error) {
      console.error('Error updating rider:', error);
      throw error;
    }
  },

  deleteRider: async (riderId) => {
    try {
      const response = await api.delete(`/admin/riders/${riderId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting rider:', error);
      throw error;
    }
  },

  // Rider functions
  getMyAssignedOrders: async () => {
    try {
      const response = await api.get('/rider/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching assigned orders:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/rider/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}; 