import axios from 'axios';

// Create a base axios instance for API requests
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.cloudbeds.com',
});

// Add a request interceptor to include the API key or OAuth token
api.interceptors.request.use(
  (config) => {
    // Check if we have an OAuth token in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('cloudbedsToken') : null;
    
    // If we have a token, use it
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Otherwise use API key
      config.headers['x-api-key'] = process.env.CLOUDBEDS_API_KEY;
    }
    
    // Always include property ID
    config.headers['x-property-id'] = process.env.NEXT_PUBLIC_PROPERTY_ID;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API utility functions for Cloudbeds API
const apiService = {
  // Room Availability
  getAvailability: async (startDate, endDate) => {
    try {
      const response = await api.get('/api/v1.1/getAvailability', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting availability:', error);
      throw error;
    }
  },
  
  // Reservations
  getReservations: async (params) => {
    try {
      const response = await api.get('/api/v1.1/getReservations', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting reservations:', error);
      throw error;
    }
  },
  
  createReservation: async (reservationData) => {
    try {
      const response = await api.post('/api/v1.1/createReservation', reservationData);
      return response.data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },
  
  updateReservation: async (reservationId, updateData) => {
    try {
      const response = await api.put(`/api/v1.1/putReservation`, {
        reservationID: reservationId,
        ...updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  },
  
  // Guests
  getGuests: async (params) => {
    try {
      const response = await api.get('/api/v1.1/getGuests', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting guests:', error);
      throw error;
    }
  },
  
  createGuest: async (guestData) => {
    try {
      const response = await api.post('/api/v1.1/putGuest', guestData);
      return response.data;
    } catch (error) {
      console.error('Error creating guest:', error);
      throw error;
    }
  },
  
  updateGuest: async (guestId, updateData) => {
    try {
      const response = await api.put(`/api/v1.1/putGuest`, {
        guestID: guestId,
        ...updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
  },
  
  // Housekeeping
  getHousekeeping: async () => {
    try {
      const propertyId = process.env.NEXT_PUBLIC_PROPERTY_ID;
      const response = await api.get(`/housekeeping/v1/inspections/${propertyId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting housekeeping data:', error);
      throw error;
    }
  },
  
  // Properties
  getProperties: async () => {
    try {
      const response = await api.get('/api/v1.1/getProperties');
      return response.data;
    } catch (error) {
      console.error('Error getting properties:', error);
      throw error;
    }
  },
  
  // Room Types
  getRoomTypes: async () => {
    try {
      const response = await api.get('/api/v1.1/getRoomTypes');
      return response.data;
    } catch (error) {
      console.error('Error getting room types:', error);
      throw error;
    }
  },
  
  // Rate Plans
  getRatePlans: async () => {
    try {
      const response = await api.get('/api/v1.1/getRatePlans');
      return response.data;
    } catch (error) {
      console.error('Error getting rate plans:', error);
      throw error;
    }
  },
  
  // Custom endpoint calling
  callEndpoint: async (method, endpoint, data = null, params = null) => {
    try {
      const config = {};
      if (params) config.params = params;
      
      let response;
      switch (method.toLowerCase()) {
        case 'get':
          response = await api.get(endpoint, config);
          break;
        case 'post':
          response = await api.post(endpoint, data, config);
          break;
        case 'put':
          response = await api.put(endpoint, data, config);
          break;
        case 'delete':
          response = await api.delete(endpoint, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error calling ${method} ${endpoint}:`, error);
      throw error;
    }
  }
};

export default apiService;
