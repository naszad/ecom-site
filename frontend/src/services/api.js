import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://10.6.254.13:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include'
});

export default api; 