import api from './api';

export const paymentService = {
  getMyPayments: async () => {
    return await api.get('/payments/my');
  },

  getOwnerPayments: async () => {
    return await api.get('/payments/owner');
  },

  simulatePayRent: async (paymentId, paymentMethod) => {
    return await api.post('/payments/simulate', { paymentId, paymentMethod });
  },

  createPaymentRecord: async (paymentData) => {
    return await api.post('/payments', paymentData);
  },
};
