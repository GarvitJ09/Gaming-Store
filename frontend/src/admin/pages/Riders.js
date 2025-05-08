import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

export default function Riders() {
  const [riders, setRiders] = useState([]);

  useEffect(() => {
    // Fetch riders from the backend
    async function fetchRiders() {
      const response = await fetch('/api/admin/riders');
      const data = await response.json();
      setRiders(data);
    }
    fetchRiders();
  }, []);

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Manage Riders
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rider ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Assigned Orders</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {riders.map((rider) => (
            <TableRow key={rider.id}>
              <TableCell>{rider.id}</TableCell>
              <TableCell>{rider.name}</TableCell>
              <TableCell>{rider.assignedOrders.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
