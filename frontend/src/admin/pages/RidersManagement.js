import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { riderService } from '../../services/riderService';

export default function RidersManagement() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newRider, setNewRider] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      const data = await riderService.getAllRiders();
      setRiders(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch riders');
      console.error('Error fetching riders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRider = async () => {
    try {
      setError('');
      const response = await riderService.addRider(newRider);
      setOpenDialog(false);
      setNewRider({ name: '', email: '', phone: '', password: '' });
      fetchRiders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add rider');
      console.error('Error adding rider:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRider(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Riders Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Add New Rider
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned Orders</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {riders.map((rider) => (
              <TableRow key={rider._id}>
                <TableCell>{rider.name}</TableCell>
                <TableCell>{rider.email}</TableCell>
                <TableCell>{rider.phone}</TableCell>
                <TableCell>{rider.status || 'Active'}</TableCell>
                <TableCell>{rider.assignedOrders || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Rider</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            name="name"
            value={newRider.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={newRider.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Phone"
            name="phone"
            value={newRider.phone}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={newRider.password}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddRider} variant="contained">
            Add Rider
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 