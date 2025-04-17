
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (Unauthorized) errors - token expired or invalid
    if (error.response && error.response.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

// RFQ services
export const rfqService = {
  createRFQ: (rfqData) => api.post('/rfq', rfqData),
  getMyRFQs: () => api.get('/rfq/my-rfqs'),
  getAvailableRFQs: () => api.get('/rfq/available'),
  getRFQById: (id) => api.get(`/rfq/${id}`),
  updateRFQ: (id, rfqData) => api.patch(`/rfq/${id}`, rfqData),
  deleteRFQ: (id) => api.delete(`/rfq/${id}`),
  inviteSuppliers: (id, supplierIds) => api.post(`/rfq/${id}/invite`, { supplierIds }),
  publishRFQ: (id) => api.post(`/rfq/${id}/publish`),
  closeRFQ: (id) => api.post(`/rfq/${id}/close`),
  createNewVersion: (id) => api.post(`/rfq/${id}/version`),
  startBidRound: (id, bidData) => api.post(`/rfq/${id}/bid-round`, bidData),
};

// Proposal services
export const proposalService = {
  submitProposal: (proposalData) => api.post('/proposals', proposalData),
  getMyProposals: () => api.get('/proposals/my-proposals'),
  getProposalsByRFQ: (rfqId) => api.get(`/proposals/rfq/${rfqId}`),
  getProposalById: (id) => api.get(`/proposals/${id}`),
  getProposalVersions: (id) => api.get(`/proposals/versions/${id}`),
  updateProposal: (id, proposalData) => api.patch(`/proposals/${id}`, proposalData),
  deleteProposal: (id) => api.delete(`/proposals/${id}`),
  updateProposalStatus: (id, status) => api.patch(`/proposals/${id}/status`, { status }),
  compareProposals: (proposalIds) => api.post('/proposals/compare', { proposalIds }),
};

// User services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.patch('/users/profile', userData),
  getSuppliers: () => api.get('/users/suppliers'),
};

export default api;
