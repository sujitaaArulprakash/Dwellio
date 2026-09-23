import api from './api';

export const adminService = {
  getStats: async () => {
    return await api.get('/admin/stats');
  },

  getUsers: async (params = {}) => {
    return await api.get('/admin/users', { params });
  },

  toggleUserStatus: async (userId) => {
    return await api.put(`/admin/users/${userId}/toggle-status`);
  },

  deleteUser: async (userId) => {
    return await api.delete(`/admin/users/${userId}`);
  },

  getProperties: async (params = {}) => {
    return await api.get('/admin/properties', { params });
  },

  approveProperty: async (id) => {
    return await api.put(`/admin/properties/${id}/approve`);
  },

  rejectProperty: async (id) => {
    return await api.put(`/admin/properties/${id}/reject`);
  },

  getRequests: async () => {
    return await api.get('/admin/requests');
  },

  getMaintenance: async () => {
    return await api.get('/admin/maintenance');
  },
};
