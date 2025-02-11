import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useState } from 'react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    ...(user
      ? [
          { label: 'Cart', path: '/cart', icon: <CartIcon /> },
          { label: 'Orders', path: '/orders' },
          ...(user.is_admin ? [{ label: 'Admin', path: '/admin' }] : []),
        ]
      : [
          { label: 'Login', path: '/login' },
          { label: 'Register', path: '/register' },
        ]),
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{
        background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.1), rgba(255, 0, 255, 0.1))',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 255, 249, 0.3)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, #00fff9, #ff00ff)',
          opacity: 0.5,
        }
      }}
    >
      <Container maxWidth="lg">
        <Toolbar 
          disableGutters
          sx={{
            height: '64px',
            minHeight: '64px !important',
          }}
        >
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            className="text-gradient"
            sx={{
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 5 },
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.5rem',
              letterSpacing: '0.05em',
            }}
          >
            Nexus Shop
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
            <Stack direction="row" spacing={2}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  color="primary"
                  startIcon={item.icon}
                  sx={{
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s ease',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
              {user && (
                <Button
                  color="secondary"
                  onClick={handleLogout}
                  sx={{ 
                    ml: 'auto',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s ease',
                    }
                  }}
                >
                  Logout
                </Button>
              )}
            </Stack>
          </Box>

          {/* Mobile Navigation */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              color="primary"
              onClick={handleMobileMenuOpen}
              size="large"
              edge="end"
              sx={{
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.1), rgba(255, 0, 255, 0.1))',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
              onClick={handleMobileMenuClose}
              PaperProps={{
                sx: {
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '2px',
                  boxShadow: '0 8px 32px rgba(0, 255, 249, 0.15)',
                }
              }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  sx={{ 
                    minWidth: 150,
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.1), rgba(255, 0, 255, 0.1))',
                    }
                  }}
                >
                  {item.icon && (
                    <Box component="span" sx={{ mr: 1, display: 'flex' }}>
                      {item.icon}
                    </Box>
                  )}
                  {item.label}
                </MenuItem>
              ))}
              {user && (
                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.1), rgba(255, 0, 255, 0.1))',
                    }
                  }}
                >
                  <PersonIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 