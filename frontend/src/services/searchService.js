import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const searchService = {
  searchProducts: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/products/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}; 