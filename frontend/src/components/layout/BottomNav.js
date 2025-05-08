import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  Category as CategoryIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    if (!isMobile) return;

    const fetchCartItemsCount = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/cart/count`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setCartItemsCount(data.count || 0);
        } else {
          console.error(
            'Failed to fetch cart items count:',
            response.statusText
          );
        }
      } catch (error) {
        console.error('Error fetching cart items count:', error);
      }
    };

    fetchCartItemsCount();
  }, [isMobile]);

  if (!isMobile) return null;
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={location.pathname}
        onChange={(event, newValue) => {
          navigate(newValue);
        }}
        showLabels
      >
        <BottomNavigationAction label='Home' value='/' icon={<HomeIcon />} />
        <BottomNavigationAction
          label='Categories'
          value='/categories'
          icon={<CategoryIcon />}
        />
        <BottomNavigationAction
          label='Cart'
          value='/cart'
          icon={
            <Badge badgeContent={cartItemsCount} color='primary'>
              <CartIcon />
            </Badge>
          }
        />
        <BottomNavigationAction
          label='Profile'
          value='/profile'
          icon={<PersonIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
