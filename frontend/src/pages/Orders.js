import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  ShoppingBag as OrderIcon,
} from '@mui/icons-material';
import api from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
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

  if (orders.length === 0) {
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
          <OrderIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography 
            variant="h4" 
            className="text-gradient"
            sx={{ mb: 2 }}
          >
            No orders found
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            sx={{
              mt: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease',
              }
            }}
          >
            Start Shopping
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
        My Orders
      </Typography>

      <Stack spacing={3} sx={{ flex: 1 }}>
        {orders.map((order) => (
          <Paper
            key={order.id}
            elevation={0}
            className="card"
            sx={{
              overflow: 'hidden',
            }}
          >
            <Box 
              sx={{ 
                p: 3,
                borderBottom: '1px solid rgba(0, 255, 249, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box>
                <Typography 
                  variant="h6" 
                  className="text-gradient"
                  gutterBottom
                >
                  Order #{order.id.slice(0, 8)}
                </Typography>
                <Typography color="text.secondary">
                  {new Date(order.created_at).toLocaleDateString()}
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status)}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                />
                <Typography 
                  variant="h6" 
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  ${order.total_amount.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              <Stack spacing={2}>
                {order.items.map((item) => (
                  <Grid 
                    container 
                    key={item.id} 
                    spacing={2} 
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={2}>
                      <Box
                        component="img"
                        src={item.product_image || 'https://via.placeholder.com/100'}
                        alt={item.product_name}
                        sx={{
                          width: '100%',
                          maxWidth: 100,
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Link
                        to={`/products/${item.product_id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Typography 
                          variant="h6"
                          className="text-gradient"
                          sx={{ 
                            mb: 1,
                            '&:hover': {
                              opacity: 0.8,
                            }
                          }}
                        >
                          {item.product_name}
                        </Typography>
                      </Link>
                      <Typography color="text.secondary">
                        Quantity: {item.quantity} × ${item.price_at_time.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography 
                        variant="h6" 
                        color="primary"
                        sx={{ 
                          textAlign: { xs: 'left', sm: 'right' },
                          fontWeight: 600,
                        }}
                      >
                        ${(item.quantity * item.price_at_time).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Stack>
            </Box>

            <Box 
              sx={{ 
                p: 3,
                backgroundColor: 'rgba(0, 255, 249, 0.02)',
                borderTop: '1px solid rgba(0, 255, 249, 0.1)',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Typography 
                      variant="h6"
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <ShippingIcon color="primary" />
                      Shipping Address
                    </Typography>
                    <Typography 
                      color="text.secondary"
                      sx={{ whiteSpace: 'pre-wrap' }}
                    >
                      {order.shipping_address}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export default Orders; 