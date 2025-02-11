import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  Stack,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import api from '../services/api';

function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (err) {
      setError('Failed to fetch cart');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await api.put(`/cart/${itemId}`, { quantity: newQuantity });
      fetchCart();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      fetchCart();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      setError('Please enter a shipping address');
      return;
    }

    setIsCheckingOut(true);
    setError('');

    try {
      await api.post('/orders', { shipping_address: shippingAddress });
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" variant="outlined">{error}</Alert>
      </Container>
    );
  }

  if (cart.items.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%'
        }}
      >
        <Paper 
          elevation={0}
          className="card"
          sx={{ 
            p: 4,
            textAlign: 'center',
            maxWidth: 'sm',
            width: '100%'
          }}
        >
          <CartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography 
            variant="h4" 
            className="text-gradient"
            sx={{ mb: 2 }}
          >
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            sx={{
              mt: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease',
              }
            }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%'
      }}
    >
      <Typography 
        variant="h2" 
        className="text-gradient"
        sx={{ 
          mb: 4,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textAlign: 'center'
        }}
      >
        Shopping Cart
      </Typography>

      <Grid container spacing={4} sx={{ flex: 1 }}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {cart.items.map((item) => (
              <Card 
                key={item.id}
                className="card"
                sx={{
                  display: 'flex',
                  p: 2,
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100, borderRadius: 1 }}
                  image={item.image_url || 'https://via.placeholder.com/100'}
                  alt={item.name}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    className="text-gradient"
                    gutterBottom
                  >
                    {item.name}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    ${item.price.toFixed(2)}
                  </Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
                <Typography 
                  variant="h6" 
                  color="primary"
                  sx={{ minWidth: 80, textAlign: 'right' }}
                >
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            className="card"
            sx={{ 
              p: 3,
              position: 'sticky',
              top: '84px'
            }}
          >
            <Typography 
              variant="h5" 
              className="text-gradient"
              sx={{ mb: 3 }}
            >
              Order Summary
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>${cart.total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography>Free</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ${cart.total.toFixed(2)}
                </Typography>
              </Box>

              <TextField
                multiline
                rows={4}
                placeholder="Enter your shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                fullWidth
                sx={{ mt: 3 }}
              />

              <Button
                variant="contained"
                fullWidth
                onClick={handleCheckout}
                disabled={isCheckingOut}
                sx={{
                  mt: 2,
                  py: 1.5,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s ease',
                  }
                }}
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Cart; 