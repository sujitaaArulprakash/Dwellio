const express = require('express');
const router = express.Router();
const {
  getMyPayments,
  getOwnerPayments,
  simulatePayRent,
  createPaymentRecord,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my', protect, authorize('tenant'), getMyPayments);
router.get('/owner', protect, authorize('owner', 'admin'), getOwnerPayments);
router.post('/simulate', protect, authorize('tenant'), simulatePayRent);
router.post('/', protect, authorize('owner', 'admin'), createPaymentRecord);

module.exports = router;
