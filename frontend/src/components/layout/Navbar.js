import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Button,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
  Favorite as FavoriteIcon,
  LocalShipping as ShippingIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };



  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
    { text: 'Orders', icon: <ShippingIcon />, path: '/orders' },
    { text: 'Help', icon: <HelpIcon />, path: '/help' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role='presentation'>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </ListItem>
      </List>
    </Box>
  );

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cartRes = await fetch(`${API_URL}/cart/count`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (cartRes.ok) {
          const cartData = await cartRes.json();
          setCartItemsCount(cartData.count || 0);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();
  }, []);



  return (
    <AppBar position='sticky' color='default' elevation={1}>
     <Toolbar>
  {isMobile && (
    <IconButton
      edge='start'
      color='inherit'
      aria-label='menu'
      onClick={() => setDrawerOpen(true)}
      sx={{ mr: 2 }}
    >
      <MenuIcon />
    </IconButton>
  )}

  <Typography
    variant='h6'
    component='div'
    sx={{ cursor: 'pointer', display: { xs: 'none', sm: 'block' } }}
    onClick={() => navigate('/')}
  >
    Gaming Store
  </Typography>

  {/* RIGHT aligned icons */}
  <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
    <IconButton color='inherit' onClick={() => navigate('/cart')}>
      <Badge badgeContent={cartItemsCount} color='primary'>
        <ShoppingCartIcon />
      </Badge>
    </IconButton>

    {currentUser ? (
      <>
        <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
          <Avatar
            sx={{ width: 32, height: 32 }}
            src={currentUser.photoURL}
          >
            {currentUser.email?.[0]?.toUpperCase()}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
            <ListItemIcon>
              <PersonIcon fontSize='small' />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => { navigate('/orders'); handleMenuClose(); }}>
            <ListItemIcon>
              <ShippingIcon fontSize='small' />
            </ListItemIcon>
            Orders
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize='small' />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </>
    ) : (
      <Button color='inherit' onClick={() => navigate('/login')} sx={{ ml: 1 }}>
        Login
      </Button>
    )}
  </Box>
</Toolbar>




      <Drawer
        anchor='left'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}