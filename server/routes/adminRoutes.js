const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllPropertiesAdmin,
  approveProperty,
  rejectProperty,
  getAllRequestsAdmin,
  getAllMaintenanceAdmin,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here require Admin role
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

router.get('/properties', getAllPropertiesAdmin);
router.put('/properties/:id/approve', approveProperty);
router.put('/properties/:id/reject', rejectProperty);

router.get('/requests', getAllRequestsAdmin);
router.get('/maintenance', getAllMaintenanceAdmin);

module.exports = router;
