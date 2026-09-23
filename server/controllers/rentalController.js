const RentalRequest = require('../models/RentalRequest');
const Property = require('../models/Property');
const RentPayment = require('../models/RentPayment');

// @desc    Send rental request
// @route   POST /api/rentals
// @access  Private (Tenant)
const createRentalRequest = async (req, res, next) => {
  try {
    const { propertyId, message } = req.body;

    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'Property ID is required' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (!['approved', 'available'].includes(property.status)) {
      return res.status(400).json({
        success: false,
        message: 'This property is currently not available for rental requests',
      });
    }

    if (property.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot submit a rental request for your own property',
      });
    }

    // Check if tenant already has an active pending request for this property
    const existingRequest = await RentalRequest.findOne({
      propertyId,
      tenantId: req.user._id,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending rental request for this property',
      });
    }

    const request = await RentalRequest.create({
      propertyId,
      tenantId: req.user._id,
      ownerId: property.ownerId,
      message: message || 'I am interested in renting this property.',
      status: 'pending',
      requestedAt: new Date(),
    });

    await request.populate([
      { path: 'propertyId', select: 'title address city rent images status' },
      { path: 'ownerId', select: 'name email phone' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Rental application submitted successfully!',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tenant's rental requests & applications
// @route   GET /api/rentals/my
// @access  Private (Tenant)
const getMyRentalRequests = async (req, res, next) => {
  try {
    const requests = await RentalRequest.find({ tenantId: req.user._id })
      .populate('propertyId', 'title address city state rent securityDeposit images status propertyType')
      .populate('ownerId', 'name email phone profileImage')
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

// @desc    Get rental requests for properties owned by the owner
// @route   GET /api/rentals/owner
// @access  Private (Owner)
const getOwnerRentalRequests = async (req, res, next) => {
  try {
    const requests = await RentalRequest.find({ ownerId: req.user._id })
      .populate('propertyId', 'title address city state rent securityDeposit images status propertyType')
      .populate('tenantId', 'name email phone profileImage createdAt')
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

// @desc    Approve rental request
// @route   PUT /api/rentals/:id/approve
// @access  Private (Owner)
const approveRentalRequest = async (req, res, next) => {
  try {
    const request = await RentalRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Rental request not found' });
    }

    if (request.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to approve this request' });
    }

    if (request.status === 'approved') {
      return res.status(400).json({ success: false, message: 'This request has already been approved' });
    }

    const property = await Property.findById(request.propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Associated property not found' });
    }

    // Update request
    request.status = 'approved';
    await request.save();

    // Update property: mark as rented and assign current tenant
    property.status = 'rented';
    property.currentTenantId = request.tenantId;
    await property.save();

    // Reject other pending requests for this property
    await RentalRequest.updateMany(
      {
        propertyId: property._id,
        _id: { $ne: request._id },
        status: 'pending',
      },
      {
        $set: { status: 'rejected' },
      }
    );

    // Automatically generate first month's rent payment bill
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // Due in 7 days

    const existingPayment = await RentPayment.findOne({
      propertyId: property._id,
      tenantId: request.tenantId,
      status: 'pending',
    });

    if (!existingPayment) {
      await RentPayment.create({
        propertyId: property._id,
        tenantId: request.tenantId,
        ownerId: property.ownerId,
        amount: property.rent,
        dueDate,
        paymentMethod: 'Simulated Payment',
        status: 'pending',
      });
    }

    res.json({
      success: true,
      message: 'Rental application approved! Property status set to rented.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject rental request
// @route   PUT /api/rentals/:id/reject
// @access  Private (Owner)
const rejectRentalRequest = async (req, res, next) => {
  try {
    const request = await RentalRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Rental request not found' });
    }

    if (request.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to reject this request' });
    }

    request.status = 'rejected';
    await request.save();

    res.json({
      success: true,
      message: 'Rental application rejected.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel rental request by tenant
// @route   PUT /api/rentals/:id/cancel
// @access  Private (Tenant)
const cancelRentalRequest = async (req, res, next) => {
  try {
    const request = await RentalRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Rental request not found' });
    }

    if (request.tenantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this request' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Cannot cancel an application that is already processed' });
    }

    request.status = 'cancelled';
    await request.save();

    res.json({
      success: true,
      message: 'Rental application cancelled.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently active rental for tenant
// @route   GET /api/rentals/active
// @access  Private (Tenant)
const getActiveRental = async (req, res, next) => {
  try {
    const property = await Property.findOne({
      currentTenantId: req.user._id,
      status: 'rented',
    }).populate('ownerId', 'name email phone profileImage');

    if (!property) {
      return res.json({
        success: true,
        data: null,
        message: 'No active rental found',
      });
    }

    // Get latest approved application
    const application = await RentalRequest.findOne({
      propertyId: property._id,
      tenantId: req.user._id,
      status: 'approved',
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        property,
        application,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRentalRequest,
  getMyRentalRequests,
  getOwnerRentalRequests,
  approveRentalRequest,
  rejectRentalRequest,
  cancelRentalRequest,
  getActiveRental,
};
