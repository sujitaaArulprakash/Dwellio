const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route to browse properties
router.get('/', getProperties);

// Owner route to get own properties
router.get('/owner/my', protect, authorize('owner', 'admin'), getMyProperties);

// Single property details
router.get('/:id', getPropertyById);

// Create, update, delete properties
router.post('/', protect, authorize('owner', 'admin'), upload.array('images', 8), createProperty);
router.put('/:id', protect, authorize('owner', 'admin'), upload.array('images', 8), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

module.exports = router;
