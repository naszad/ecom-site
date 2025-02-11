import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import api from '../../services/api';

function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [filter, page]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/admin?status=${filter}&page=${page}`);
      setOrders(response.data.orders);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#ffc107';
      case 'processing':
        return '#17a2b8';
      case 'shipped':
        return '#007bff';
      case 'delivered':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={styles.filters}>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          style={styles.select}
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <TableContainer component={Paper} className="card">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id.slice(0, 8)}</TableCell>
                <TableCell>{order.user_email}</TableCell>
                <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(order.status),
                  }}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={styles.statusSelect}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={styles.pageButton}
          >
            Previous
          </button>
          <span style={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  filters: {
    marginBottom: '1.5rem',
  },
  select: {
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '2px',
    border: '1px solid rgba(0, 255, 249, 0.3)',
    backgroundColor: 'rgba(18, 21, 43, 0.7)',
    color: '#ffffff',
    cursor: 'pointer',
    '&:hover': {
      borderColor: 'rgba(0, 255, 249, 0.5)',
      boxShadow: '0 0 10px rgba(0, 255, 249, 0.2)',
    },
    '&:focus': {
      outline: 'none',
      borderColor: '#00fff9',
      boxShadow: '0 0 15px rgba(0, 255, 249, 0.3)',
    },
  },
  statusBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '999px',
    color: '#fff',
    fontSize: '0.875rem',
    display: 'inline-block',
  },
  statusSelect: {
    padding: '0.5rem',
    borderRadius: '2px',
    border: '1px solid rgba(0, 255, 249, 0.3)',
    backgroundColor: 'rgba(18, 21, 43, 0.7)',
    color: '#ffffff',
    cursor: 'pointer',
    minWidth: '150px',
    '&:hover': {
      borderColor: 'rgba(0, 255, 249, 0.5)',
      boxShadow: '0 0 10px rgba(0, 255, 249, 0.2)',
    },
    '&:focus': {
      outline: 'none',
      borderColor: '#00fff9',
      boxShadow: '0 0 15px rgba(0, 255, 249, 0.3)',
    },
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
  },
  pageButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    ':disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
  },
  pageInfo: {
    color: '#666',
  },
  error: {
    color: '#dc3545',
    marginBottom: '1rem',
  },
};

export default OrdersManager; 