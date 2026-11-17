import axios from 'axios';

// withCredentials sends the HTTP-only JWT cookie. The custom header is the CSRF guard.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'X-Requested-With': 'PortfolioForge' },
  timeout: 15000,
});

export default api;
