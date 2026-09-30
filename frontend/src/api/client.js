import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodreach_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth expiration handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // localStorage.removeItem('foodreach_token');
      // localStorage.removeItem('foodreach_user');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const donationApi = {
  getAll: async (params) => {
    const res = await api.get('/donations', { params });
    return res.data;
  },
  getAvailable: async () => {
    const res = await api.get('/donations/available');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/donations/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/donations', data);
    return res.data;
  },
  getMyDonations: async () => {
    const res = await api.get('/donations/my');
    return res.data;
  },
  cancel: async (id) => {
    const res = await api.put(`/donations/${id}/cancel`);
    return res.data;
  },
};

export const claimApi = {
  claimDonation: async (claimData) => {
    const res = await api.post('/claims', claimData);
    return res.data;
  },
  getMyClaims: async () => {
    const res = await api.get('/claims/my');
    return res.data;
  },
};

export const deliveryApi = {
  getPending: async () => {
    const res = await api.get('/deliveries/pending');
    return res.data;
  },
  getMyTasks: async () => {
    const res = await api.get('/deliveries/my');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/deliveries/${id}`);
    return res.data;
  },
  accept: async (id) => {
    const res = await api.post(`/deliveries/${id}/accept`);
    return res.data;
  },
  updateStatus: async (id, statusData) => {
    const res = await api.put(`/deliveries/${id}/status`, statusData);
    return res.data;
  },
};

export const statsApi = {
  getImpact: async () => {
    const res = await api.get('/stats/impact');
    return res.data;
  },
};

export const userApi = {
  getByRole: async (role) => {
    const res = await api.get('/users', { params: { role } });
    return res.data;
  },
};

export default api;
