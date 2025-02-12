import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from '@mui/material';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError('Failed to create an account');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={0}
        className="card"
        sx={{ 
          p: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Typography 
          variant="h4" 
          className="text-gradient"
          sx={{ 
            mb: 4,
            textAlign: 'center',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          Create Account
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            variant="outlined"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            autoFocus
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="email"
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="new-password"
          />

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              mt: 2,
              fontSize: '1.1rem',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease',
              }
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Box textAlign="center" mt={2}>
            <Typography color="text.secondary">
              Already have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/login"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register; 