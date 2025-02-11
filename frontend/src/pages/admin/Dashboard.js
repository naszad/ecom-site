import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProductsManager from './ProductsManager';
import OrdersManager from './OrdersManager';
import UsersManager from './UsersManager';
import CategoriesManager from './CategoriesManager';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
  Category as CategoriesIcon
} from '@mui/icons-material';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user?.is_admin) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error" variant="filled">
          Access denied. Admin privileges required.
        </Alert>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsManager />;
      case 'orders':
        return <OrdersManager />;
      case 'users':
        return <UsersManager />;
      case 'categories':
        return <CategoriesManager />;
      default:
        return <ProductsManager />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="500" color="primary">
        Admin Dashboard
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<ProductsIcon />}
            iconPosition="start"
            label="Products"
            value="products"
          />
          <Tab
            icon={<OrdersIcon />}
            iconPosition="start"
            label="Orders"
            value="orders"
          />
          <Tab
            icon={<UsersIcon />}
            iconPosition="start"
            label="Users"
            value="users"
          />
          <Tab
            icon={<CategoriesIcon />}
            iconPosition="start"
            label="Categories"
            value="categories"
          />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 3 }}>
        {renderContent()}
      </Paper>
    </Container>
  );
}

export default Dashboard; 