import api from './api';

export const rentalService = {
  createRequest: async (propertyId, message) => {
    return await api.post('/rentals', { propertyId, message });
  },

  getMyRequests: async () => {
    return await api.get('/rentals/my');
  },

  getActiveRental: async () => {
    return await api.get('/rentals/active');
  },

  getOwnerRequests: async () => {
    return await api.get('/rentals/owner');
  },

  approveRequest: async (id) => {
    return await api.put(`/rentals/${id}/approve`);
  },

  rejectRequest: async (id) => {
    return await api.put(`/rentals/${id}/reject`);
  },

  cancelRequest: async (id) => {
    return await api.put(`/rentals/${id}/cancel`);
  },
};
