const express = require('express');
const router = express.Router();
const {
  createRentalRequest,
  getMyRentalRequests,
  getOwnerRentalRequests,
  approveRentalRequest,
  rejectRentalRequest,
  cancelRentalRequest,
  getActiveRental,
} = require('../controllers/rentalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('tenant'), createRentalRequest);
router.get('/my', protect, authorize('tenant'), getMyRentalRequests);
router.get('/active', protect, authorize('tenant'), getActiveRental);
router.get('/owner', protect, authorize('owner', 'admin'), getOwnerRentalRequests);
router.put('/:id/approve', protect, authorize('owner', 'admin'), approveRentalRequest);
router.put('/:id/reject', protect, authorize('owner', 'admin'), rejectRentalRequest);
router.put('/:id/cancel', protect, authorize('tenant'), cancelRentalRequest);

module.exports = router;
