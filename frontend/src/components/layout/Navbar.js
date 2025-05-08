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
  Search as SearchIcon,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
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
    const fetchProductsAndCart = async () => {
      try {
        const [productsRes, cartRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/cart/count`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
        ]);

        if (productsRes.ok) {
          const productData = await productsRes.json();
          setProducts(productData);
          setFilteredProducts(productData);
        }

        if (cartRes.ok) {
          const cartData = await cartRes.json();
          setCartItemsCount(cartData.count || 0);
        }
      } catch (error) {
        console.error('Error fetching products or cart:', error);
      }
    };

    fetchProductsAndCart();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const lower = searchQuery.trim().toLowerCase();
      setFilteredProducts(
        products.filter(
          (product) =>
            (product.name && product.name.toLowerCase().includes(lower)) ||
            (product.description &&
              product.description.toLowerCase().includes(lower))
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

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

        <Box
          component='form'
          onSubmit={handleSearch}
          sx={{
            position: 'relative',
            borderRadius: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            },
            marginRight: 2,
            marginLeft: 2,
            width: { xs: '100%', sm: 'auto' },
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              pl: 2,
            }}
          >
            <SearchIcon />
          </Box>
          <InputBase
            placeholder='Search products...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              color: 'inherit',
              width: '100%',
              pl: 6,
              pr: 2,
              py: 1,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                <MenuItem
                  onClick={() => {
                    navigate('/profile');
                    handleMenuClose();
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize='small' />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate('/orders');
                    handleMenuClose();
                  }}
                >
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
            <Button
              color='inherit'
              onClick={() => navigate('/login')}
              sx={{ ml: 1 }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* OPTIONAL: Render filtered results here if desired */}
      {/* 
      {searchQuery && (
        <Box sx={{ backgroundColor: '#fff', px: 2, py: 1 }}>
          {filteredProducts.map((product) => (
            <Typography key={product.id} variant="body2">
              {product.name}
            </Typography>
          ))}
        </Box>
      )}
      */}

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
