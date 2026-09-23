import api from './api';

export const propertyService = {
  getProperties: async (params = {}) => {
    return await api.get('/properties', { params });
  },

  getPropertyById: async (id) => {
    return await api.get(`/properties/${id}`);
  },

  getMyProperties: async () => {
    return await api.get('/properties/owner/my');
  },

  createProperty: async (formData) => {
    // Check if formData is instance of FormData (for image upload)
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return await api.post('/properties', formData, { headers });
  },

  updateProperty: async (id, formData) => {
    const headers = formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    return await api.put(`/properties/${id}`, formData, { headers });
  },

  deleteProperty: async (id) => {
    return await api.delete(`/properties/${id}`);
  },
};
