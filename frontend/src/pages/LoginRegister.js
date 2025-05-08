// src/pages/LoginRegister.jsx
import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo,
} from 'firebase/auth';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { Google } from '@mui/icons-material';

const provider = new GoogleAuthProvider();

const LoginRegister = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailAuth = async () => {
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      window.location.href = '/products';
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      const isNewUser = getAdditionalUserInfo(result).isNewUser;
      const email = result.user.email;

      // Optional: validate against approved email list
      const res = await fetch(
        `http://localhost:5000/api/validate-email/${email}`
      );
      const data = await res.json();

      if (!data.valid) {
        alert('Email not approved!');
        auth.signOut();
        return;
      }

      if (isRegistering && !isNewUser) {
        alert('Account already exists. Please login instead.');
        auth.signOut();
        return;
      }

      if (!isRegistering && isNewUser) {
        alert('No account found. Please register first.');
        auth.signOut();
        return;
      }

      window.location.href = '/products';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth='xs'>
      <Box sx={{ mt: 8 }}>
        <Typography variant='h5' gutterBottom>
          {isRegistering ? 'Register' : 'Login'}
        </Typography>

        {error && <Alert severity='error'>{error}</Alert>}

        <TextField
          label='Email'
          fullWidth
          margin='normal'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label='Password'
          type='password'
          fullWidth
          margin='normal'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant='contained'
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleEmailAuth}
        >
          {isRegistering ? 'Register with Email' : 'Login with Email'}
        </Button>

        {!isRegistering && (
          <>
            <Grid container justifyContent='center' sx={{ my: 2 }}>
              <Typography variant='body2'>OR</Typography>
            </Grid>
            <Button
              variant='outlined'
              fullWidth
              startIcon={<Google />}
              onClick={handleGoogleLogin}
            >
              Sign in with Google
            </Button>
          </>
        )}

        <Grid container justifyContent='center' sx={{ mt: 2 }}>
          <Typography variant='body2'>
            {isRegistering
              ? 'Already have an account?'
              : "Don't have an account?"}
            &nbsp;
            <Link
              component='button'
              variant='body2'
              onClick={() => setIsRegistering((prev) => !prev)}
            >
              {isRegistering ? 'Login here' : 'Register here'}
            </Link>
          </Typography>
        </Grid>
      </Box>
    </Container>
  );
};

export default LoginRegister;
