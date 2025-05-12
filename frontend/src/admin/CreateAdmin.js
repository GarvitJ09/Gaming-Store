import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp, deleteApp } from 'firebase/app';
import { firebaseConfig } from '../firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function CreateAdmin() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    let secondaryApp;
    try {
      secondaryApp = initializeApp(firebaseConfig, 'Secondary');
      const secondaryAuth = getAuth(secondaryApp);
      const result = await createUserWithEmailAndPassword(
        secondaryAuth,
        formData.email,
        formData.password
      );
      const user = result.user;
      console.log('Admin created in firebase', user);
      const firebaseUid = user.uid;
      const response = await axios.post(`${API_URL}/auth/signup`, {
        ...formData,
        role: 'admin',
        firebaseUid,
      });

      setSuccess('Admin user created successfully!', response);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin user');
    } finally {
      // Delete the secondary app to avoid memory leaks
      if (secondaryApp) {
        await deleteApp(secondaryApp);
      }
      setLoading(false);
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component='h1' variant='h5' align='center' gutterBottom>
            Create Admin User
          </Typography>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity='success' sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              margin='normal'
              required
              fullWidth
              label='Full Name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              label='Email Address'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              label='Phone Number'
              name='phone'
              value={formData.phone}
              onChange={handleInputChange}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              label='Password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleInputChange}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              label='Address'
              name='address'
              value={formData.address}
              onChange={handleInputChange}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Create Admin User
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
