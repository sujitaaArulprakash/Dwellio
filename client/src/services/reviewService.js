import api from './api';

export const reviewService = {
  createReview: async (reviewData) => {
    return await api.post('/reviews', reviewData);
  },

  getPropertyReviews: async (propertyId) => {
    return await api.get(`/reviews/property/${propertyId}`);
  },

  getMyReviews: async () => {
    return await api.get('/reviews/my');
  },
};
