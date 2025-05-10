import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
  Tabs,
  Tab,
  MenuItem,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthPage() {
  const [tabIndex, setTabIndex] = useState(0); // 0: Sign In, 1: Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle, signup } = useAuth();

  const handleTabChange = (_, newValue) => {
    setTabIndex(newValue);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setAddress('');
    setRole('user');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      console.log("tabIndex",tabIndex);
      if (tabIndex === 0) {
        console.log("logging in");
        user = await login(email, password); 
      } else {
        console.log("creating user");
        user = await signup({
          name,
          email,
          phone,
          password,
          role,
          address,
        });
        
      }

      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.role === 'rider') {
        navigate('/rider');
      }else {
        navigate('/');
      } 
    } catch (err) {
      setError(`Failed to ${tabIndex === 0 ? 'sign in' : 'sign up'}: ${err.message}`);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      const user = await loginWithGoogle(); // This should handle /signup backend logic if user is new
      if (user.role === 'admin') {
        navigate('/admin');
      }else if (user.role === 'rider') {
        navigate('/rider');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Failed to sign in with Google: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          <Typography component="h1" variant="h5" align="center" sx={{ mt: 2 }}>
            {tabIndex === 0 ? 'Sign In' : 'Sign Up'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {tabIndex === 1 && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                /> 
              </>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {tabIndex === 0 ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
  fullWidth
  variant="outlined"
  startIcon={<GoogleIcon />}
  onClick={handleGoogleSignIn}
  disabled={loading}
>
  {tabIndex === 0 ? 'Sign in with Google' : 'Sign up with Google'}
</Button>

        </Paper>
      </Box>
    </Container>
  );
}
