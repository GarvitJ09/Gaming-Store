// src/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

// Add a new product
export const addProduct = async (productData, token) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Update product stock
export const updateStock = async (
  productId,
  variantId,
  additionalStock,
  token
) => {
  try {
    const response = await axios.put(
      `${API_URL}/update-stock`,
      { productId, variantId, additionalStock },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};
