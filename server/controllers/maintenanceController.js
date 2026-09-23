const MaintenanceRequest = require('../models/MaintenanceRequest');
const Property = require('../models/Property');

// @desc    Create maintenance complaint
// @route   POST /api/maintenance
// @access  Private (Tenant)
const createMaintenanceRequest = async (req, res, next) => {
  try {
    const { propertyId, title, description, category, priority, image } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    let targetPropertyId = propertyId;

    // If propertyId not specified, find tenant's active rented property
    if (!targetPropertyId) {
      const activeProperty = await Property.findOne({
        currentTenantId: req.user._id,
        status: 'rented',
      });

      if (!activeProperty) {
        return res.status(400).json({
          success: false,
          message: 'No active rental found to file a complaint for',
        });
      }
      targetPropertyId = activeProperty._id;
    }

    const property = await Property.findById(targetPropertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    let complaintImage = image || '';
    if (req.file) {
      complaintImage = `/uploads/${req.file.filename}`;
    }

    const complaint = await MaintenanceRequest.create({
      propertyId: property._id,
      tenantId: req.user._id,
      ownerId: property.ownerId,
      title,
      description,
      category: category || 'Plumbing',
      priority: priority || 'Medium',
      image: complaintImage,
      status: 'Pending',
    });

    await complaint.populate([
      { path: 'propertyId', select: 'title address city' },
      { path: 'ownerId', select: 'name email phone' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Maintenance complaint submitted successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tenant's maintenance requests
// @route   GET /api/maintenance/my
// @access  Private (Tenant)
const getMyMaintenanceRequests = async (req, res, next) => {
  try {
    const requests = await MaintenanceRequest.find({ tenantId: req.user._id })
      .populate('propertyId', 'title address city')
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner's maintenance complaints
// @route   GET /api/maintenance/owner
// @access  Private (Owner)
const getOwnerMaintenanceRequests = async (req, res, next) => {
  try {
    const requests = await MaintenanceRequest.find({ ownerId: req.user._id })
      .populate('propertyId', 'title address city')
      .populate('tenantId', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update maintenance complaint status and notes
// @route   PUT /api/maintenance/:id/status
// @access  Private (Owner, Admin)
const updateMaintenanceStatus = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;

    const complaint = await MaintenanceRequest.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    }

    if (complaint.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this complaint' });
    }

    if (status) complaint.status = status;
    if (resolutionNotes !== undefined) complaint.resolutionNotes = resolutionNotes;

    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
    } else {
      complaint.resolvedAt = null;
    }

    await complaint.save();

    res.json({
      success: true,
      message: 'Maintenance complaint updated successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMaintenanceRequest,
  getMyMaintenanceRequests,
  getOwnerMaintenanceRequests,
  updateMaintenanceStatus,
};
