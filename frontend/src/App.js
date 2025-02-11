import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import NeonFireflies from './components/NeonFireflies';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Dashboard from './pages/admin/Dashboard';
import theme from './theme';
import { useEffect } from 'react';
import './styles/App.css';

function App() {
  useEffect(() => {
    document.body.classList.add('cyberpunk-grid');
    return () => document.body.classList.remove('cyberpunk-grid');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div className="cyberpunk-grid">
              <NeonFireflies />
            </div>
            <Navbar />
            <main style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'transparent',
              paddingTop: '84px',
              position: 'relative',
              zIndex: 1
            }}>
              <Container 
                maxWidth="lg" 
                sx={{ 
                  px: { xs: 2, sm: 3, md: 4 },
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/cart" 
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    } 
                  />
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute adminOnly>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Container>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
