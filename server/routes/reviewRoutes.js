const express = require('express');
const router = express.Router();
const {
  createReview,
  getPropertyReviews,
  getMyReviews,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('tenant'), createReview);
router.get('/my', protect, authorize('tenant'), getMyReviews);
router.get('/property/:propertyId', getPropertyReviews);

module.exports = router;
