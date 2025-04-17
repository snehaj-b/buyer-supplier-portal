
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

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
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
};

// Proposal services
export const proposalService = {
  submitProposal: (proposalData) => api.post('/proposals', proposalData),
  getMyProposals: () => api.get('/proposals/my-proposals'),
  getProposalsByRFQ: (rfqId) => api.get(`/proposals/rfq/${rfqId}`),
  getProposalById: (id) => api.get(`/proposals/${id}`),
  updateProposal: (id, proposalData) => api.patch(`/proposals/${id}`, proposalData),
  deleteProposal: (id) => api.delete(`/proposals/${id}`),
  updateProposalStatus: (id, status) => api.patch(`/proposals/${id}/status`, { status }),
};

// User services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.patch('/users/profile', userData),
  getSuppliers: () => api.get('/users/suppliers'),
};

export default api;
