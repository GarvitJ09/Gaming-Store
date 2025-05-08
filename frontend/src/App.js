// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import theme from './theme';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import Products from './pages/Products';
import Orders from './pages/Orders';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminApp from './admin/AdminApp';
import RiderApp from './rider/RiderApp'; // Import RiderApp

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Admin Routes */}
              <Route path='/admin/*' element={<AdminApp />} />

              {/* Rider Routes */}
              <Route path='/rider/*' element={<RiderApp />} />

              {/* User Routes */}
              <Route
                path='/'
                element={
                  <>
                    <Navbar />
                    <Box sx={{ pb: 7 }}>
                      <Products />
                    </Box>
                    <BottomNav />
                  </>
                }
              />
              <Route
                path='/products'
                element={
                  <>
                    <Navbar />
                    <Box sx={{ pb: 7 }}>
                      <Products />
                    </Box>
                    <BottomNav />
                  </>
                }
              />
              <Route
                path='/products/:id'
                element={
                  <>
                    <Navbar />
                    <Box sx={{ pb: 7 }}>
                      <ProductDetail />
                    </Box>
                    <BottomNav />
                  </>
                }
              />
              <Route
                path='/cart'
                element={
                  <>
                    <Navbar />
                    <Box sx={{ pb: 7 }}>
                      <Cart />
                    </Box>
                    <BottomNav />
                  </>
                }
              />
              <Route
                path='/checkout'
                element={
                  <PrivateRoute>
                    <>
                      <Navbar />
                      <Box sx={{ pb: 7 }}>
                        <Checkout />
                      </Box>
                      <BottomNav />
                    </>
                  </PrivateRoute>
                }
              />
              <Route
                path='/orders'
                element={
                  <PrivateRoute>
                    <>
                      <Navbar />
                      <Box sx={{ pb: 7 }}>
                        <Orders />
                      </Box>
                      <BottomNav />
                    </>
                  </PrivateRoute>
                }
              />
              <Route
                path='/profile'
                element={
                  <PrivateRoute>
                    <>
                      <Navbar />
                      <Box sx={{ pb: 7 }}>
                        <Profile />
                      </Box>
                      <BottomNav />
                    </>
                  </PrivateRoute>
                }
              />
              <Route path='/login' element={<Login />} />
            </Routes>
          </Router>
          <ToastContainer />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
