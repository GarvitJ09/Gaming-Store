import React from 'react';
import { Box, Typography, Paper, Grid, Avatar } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant='h5' gutterBottom>
        Rider Profile
      </Typography>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            <Avatar
              alt={currentUser?.displayName || 'Rider'}
              src={currentUser?.photoURL}
              sx={{ width: 100, height: 100, margin: 'auto' }}
            />
            <Typography variant='h6' sx={{ mt: 2 }}>
              {currentUser?.displayName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant='body1' gutterBottom>
              <strong>Email:</strong> {currentUser?.email}
            </Typography>
            <Typography variant='body1' gutterBottom>
              <strong>Phone:</strong> {currentUser?.phone || 'N/A'}
            </Typography>
            <Typography variant='body1' gutterBottom>
              <strong>Vehicle Type:</strong>{' '}
              {currentUser?.riderDetails?.vehicleType || 'N/A'}
            </Typography>
            <Typography variant='body1' gutterBottom>
              <strong>License Number:</strong>{' '}
              {currentUser?.riderDetails?.licenseNumber || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
