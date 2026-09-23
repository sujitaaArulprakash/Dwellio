import api from './api';

export const maintenanceService = {
  createRequest: async (formData) => {
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return await api.post('/maintenance', formData, { headers });
  },

  getMyRequests: async () => {
    return await api.get('/maintenance/my');
  },

  getOwnerRequests: async () => {
    return await api.get('/maintenance/owner');
  },

  updateStatus: async (id, statusData) => {
    return await api.put(`/maintenance/${id}/status`, statusData);
  },
};
