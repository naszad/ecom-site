import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../services/api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [search, sort, page]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      params.append('page', page);
      params.append('limit', 12);

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.products);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
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

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%'
      }}
    >
      <Box mb={4}>
        <Typography 
          variant="h2" 
          className="text-gradient"
          sx={{ 
            mb: 3,
            fontWeight: 700,
            letterSpacing: '0.05em',
            textAlign: 'center'
          }}
        >
          Our Products
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ mb: 4 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              }
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              onChange={handleSortChange}
              label="Sort by"
              sx={{
                backgroundColor: 'background.paper',
              }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="price:asc">Price: Low to High</MenuItem>
              <MenuItem value="price:desc">Price: High to Low</MenuItem>
              <MenuItem value="name:asc">Name: A to Z</MenuItem>
              <MenuItem value="name:desc">Name: Z to A</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Box sx={{ flex: 1 }}>
        {products.length === 0 ? (
          <Box 
            textAlign="center" 
            py={8}
            className="card"
          >
            <Typography variant="h6" color="text.secondary">
              No products found.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  className="card"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image_url || 'https://via.placeholder.com/200'}
                    alt={product.name}
                    sx={{
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      className="text-gradient"
                      gutterBottom
                    >
                      {product.name}
                    </Typography>
                    <Typography 
                      variant="h5" 
                      color="primary" 
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/products/${product.id}`}
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 2,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          transition: 'transform 0.2s ease',
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {totalPages > 1 && (
        <Box 
          display="flex" 
          justifyContent="center" 
          mt={4}
          mb={2}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 249, 0.1)',
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(0, 255, 249, 0.2), rgba(255, 0, 255, 0.2))',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 249, 0.3)',
                  }
                }
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default ProductList; 