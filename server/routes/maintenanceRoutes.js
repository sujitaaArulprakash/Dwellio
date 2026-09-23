const express = require('express');
const router = express.Router();
const {
  createMaintenanceRequest,
  getMyMaintenanceRequests,
  getOwnerMaintenanceRequests,
  updateMaintenanceStatus,
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, authorize('tenant'), upload.single('image'), createMaintenanceRequest);
router.get('/my', protect, authorize('tenant'), getMyMaintenanceRequests);
router.get('/owner', protect, authorize('owner', 'admin'), getOwnerMaintenanceRequests);
router.put('/:id/status', protect, authorize('owner', 'admin'), updateMaintenanceStatus);

module.exports = router;
