import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartState, setCartState] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      if (response.data && response.data.items) {
        setCartState(response.data.items);
      } else {
        setCartState([]);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCartState([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId, variant, quantity) => {
    try {
      const response = await api.post('/cart/add', {
        productId,
        variant,
        quantity,
      });

      if (response.data && response.data.items) {
        setCartState(response.data.items);
        toast.success('Product added to cart!');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(
        error.response?.data?.message || 'Failed to add product to cart.'
      );
    }
  };

  const removeFromCart = async (productId, variant) => {
    try {
      const response = await api.delete(`/cart/remove/${productId}`, {
        data: { variant },
      });

      if (response.data && response.data.items) {
        setCartState(response.data.items);
        toast.success('Product removed from cart!');
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove product from cart.');
    }
  };

  const updateQuantity = async (productId, variant, quantity) => {
    try {
      if (quantity <= 0) {
        toast.error('Quantity must be at least 1');
        return;
      }

      const response = await api.post('/cart/add', {
        productId,
        variant,
        quantity,
      });

      if (response.data && response.data.items) {
        setCartState(response.data.items);
        toast.success('Cart updated!');
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error(error.response?.data?.message || 'Failed to update cart.');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCartState([]);
      toast.success('Cart cleared successfully!');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart. Please try again.');
    }
  };

  const calculateTotal = () => {
    return cartState.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0
    );
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart: cartState,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotal,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
