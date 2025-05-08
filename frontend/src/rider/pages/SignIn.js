import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailSignIn = async () => {
    try {
      setError('');
      await login(email, password);
      navigate('/rider'); // Redirect to Rider Dashboard
    } catch (err) {
      setError('Failed to sign in with email and password');
      console.error(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/rider'); // Redirect to Rider Dashboard
    } catch (err) {
      setError('Failed to sign in with Google');
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 8, textAlign: 'center' }}>
      <Typography variant='h5' gutterBottom>
        Rider Sign-In
      </Typography>
      {error && <Alert severity='error'>{error}</Alert>}
      <Box sx={{ mt: 2 }}>
        <TextField
          label='Email'
          type='email'
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label='Password'
          type='password'
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant='contained'
          color='primary'
          fullWidth
          onClick={handleEmailSignIn}
        >
          Sign In with Email
        </Button>
      </Box>
      <Typography variant='body1' sx={{ mt: 2, mb: 2 }}>
        OR
      </Typography>
      <Button
        variant='contained'
        color='secondary'
        fullWidth
        onClick={handleGoogleSignIn}
      >
        Sign In with Google
      </Button>
    </Box>
  );
}
