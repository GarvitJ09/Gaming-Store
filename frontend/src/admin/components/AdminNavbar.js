import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { auth } from '../../firebase';

export default function AdminNavbar() {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/admin"
          >
          Dashboard
        </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/admin/orders"
          >
          Orders
        </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/admin/riders"
          >
          Riders
        </Button>
        <Button 
            color='inherit' 
            component={RouterLink} 
            to='/admin/products'>
          Product Management
        </Button>
        <Button
            color="inherit"
            component={RouterLink}
            to="/admin/create-admin"
          >
            Create Admin
          </Button>
          <Button
            color="inherit"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
