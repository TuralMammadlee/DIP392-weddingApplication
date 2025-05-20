import axios from 'axios';
import authService from './auth.service';

const API_URL = 'http://localhost:8080/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    // Handle 401 (Unauthorized) errors
    if (err.response && err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        // Log out the user if their token is invalid
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(err);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }

    return Promise.reject(err);
  }
);

// Venue service
const venueService = {
  getPublicVenues: () => api.get('venues/public/available'),
  searchVenuesByCity: (city) => api.get(`venues/public/search/city/${city}`),
  searchVenuesByState: (state) => api.get(`venues/public/search/state/${state}`),
  searchVenuesByCapacity: (capacity) => api.get(`venues/public/search/capacity/${capacity}`),
  getVenueById: (id) => api.get(`venues/public/${id}`),
  getMyVenues: () => api.get('venues/owner'),
  createVenue: (venueData) => api.post('venues', venueData),
  updateVenue: (id, venueData) => api.put(`venues/${id}`, venueData),
  deleteVenue: (id) => api.delete(`venues/${id}`),
};

// Wedding service
const weddingService = {
  getMyWeddings: () => api.get('weddings'),
  getWeddingById: (id) => api.get(`weddings/${id}`),
  createWedding: (weddingData, venueId) => {
    const url = venueId ? `weddings?venueId=${venueId}` : 'weddings';
    return api.post(url, weddingData);
  },
  updateWedding: (id, weddingData, venueId) => {
    const url = venueId ? `weddings/${id}?venueId=${venueId}` : `weddings/${id}`;
    return api.put(url, weddingData);
  },
  addCoupleToWedding: (weddingId, userId) => 
    api.put(`weddings/${weddingId}/addCouple?userId=${userId}`),
  deleteWedding: (id) => api.delete(`weddings/${id}`),
};

// Guest service
const guestService = {
  getGuestsByWeddingId: (weddingId) => api.get(`guests/wedding/${weddingId}`),
  getGuestsByStatus: (weddingId, status) => 
    api.get(`guests/wedding/${weddingId}/status/${status}`),
  getGuestById: (id) => api.get(`guests/${id}`),
  addGuest: (weddingId, guestData) => api.post(`guests/wedding/${weddingId}`, guestData),
  updateGuest: (id, guestData) => api.put(`guests/${id}`, guestData),
  updateGuestStatus: (id, status) => api.put(`guests/${id}/status/${status}`),
  deleteGuest: (id) => api.delete(`guests/${id}`),
  getGuestCount: (weddingId) => api.get(`guests/count/wedding/${weddingId}`),
  getGuestCountByStatus: (weddingId, status) => 
    api.get(`guests/count/wedding/${weddingId}/status/${status}`),
};

// Task service
const taskService = {
  getTasksByWeddingId: (weddingId) => api.get(`tasks/wedding/${weddingId}`),
  getTasksByStatus: (weddingId, status) => 
    api.get(`tasks/wedding/${weddingId}/status/${status}`),
  getOverdueTasks: (weddingId) => api.get(`tasks/wedding/${weddingId}/overdue`),
  getAssignedTasks: () => api.get('tasks/assigned'),
  getAssignedTasksForWedding: (weddingId) => 
    api.get(`tasks/wedding/${weddingId}/assigned`),
  getTaskById: (id) => api.get(`tasks/${id}`),
  createTask: (weddingId, taskData, assignedToId) => {
    const url = assignedToId ? 
      `tasks/wedding/${weddingId}?assignedToId=${assignedToId}` : 
      `tasks/wedding/${weddingId}`;
    return api.post(url, taskData);
  },
  updateTask: (id, taskData, assignedToId) => {
    const url = assignedToId ? 
      `tasks/${id}?assignedToId=${assignedToId}` : 
      `tasks/${id}`;
    return api.put(url, taskData);
  },
  updateTaskStatus: (id, status) => api.put(`tasks/${id}/status/${status}`),
  deleteTask: (id) => api.delete(`tasks/${id}`),
};

// Vendor service
const vendorService = {
  getVendorsByWeddingId: (weddingId) => api.get(`vendors/wedding/${weddingId}`),
  getVendorsByType: (weddingId, type) => 
    api.get(`vendors/wedding/${weddingId}/type/${type}`),
  getVendorsByDepositPaid: (weddingId, isPaid) => 
    api.get(`vendors/wedding/${weddingId}/payment/deposit/${isPaid}`),
  getVendorsByFullyPaid: (weddingId, isPaid) => 
    api.get(`vendors/wedding/${weddingId}/payment/full/${isPaid}`),
  getVendorById: (id) => api.get(`vendors/${id}`),
  addVendor: (weddingId, vendorData) => 
    api.post(`vendors/wedding/${weddingId}`, vendorData),
  updateVendor: (id, vendorData) => api.put(`vendors/${id}`, vendorData),
  updateVendorDepositPaid: (id, isPaid) => 
    api.put(`vendors/${id}/payment/deposit/${isPaid}`),
  updateVendorFullyPaid: (id, isPaid) => 
    api.put(`vendors/${id}/payment/full/${isPaid}`),
  deleteVendor: (id) => api.delete(`vendors/${id}`),
};

export { 
  api, 
  venueService, 
  weddingService, 
  guestService, 
  taskService, 
  vendorService 
}; 