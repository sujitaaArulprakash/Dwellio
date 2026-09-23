const User = require('../models/User');
const Property = require('../models/Property');
const RentalRequest = require('../models/RentalRequest');
const RentPayment = require('../models/RentPayment');
const MaintenanceRequest = require('../models/MaintenanceRequest');

// @desc    Get system-wide metrics and chart datasets
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTenants = await User.countDocuments({ role: 'tenant' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const totalProperties = await Property.countDocuments();
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const approvedProperties = await Property.countDocuments({ status: { $in: ['approved', 'available'] } });
    const activeRentals = await Property.countDocuments({ status: 'rented' });

    const pendingComplaints = await MaintenanceRequest.countDocuments({ status: { $in: ['Pending', 'In Progress'] } });
    const resolvedComplaints = await MaintenanceRequest.countDocuments({ status: 'Resolved' });

    const totalRequests = await RentalRequest.countDocuments();
    const pendingRequests = await RentalRequest.countDocuments({ status: 'pending' });
    const approvedRequests = await RentalRequest.countDocuments({ status: 'approved' });
    const rejectedRequests = await RentalRequest.countDocuments({ status: 'rejected' });

    // Revenue calculation
    const paidPayments = await RentPayment.find({ status: 'paid' });
    const totalRevenue = paidPayments.reduce((acc, p) => acc + p.amount, 0);

    // Monthly revenue dataset for Recharts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyRevenueMap = {};
    months.forEach((m) => (monthlyRevenueMap[m] = 0));

    paidPayments.forEach((p) => {
      const date = p.paymentDate || p.createdAt;
      if (date && new Date(date).getFullYear() === currentYear) {
        const monthName = months[new Date(date).getMonth()];
        monthlyRevenueMap[monthName] = (monthlyRevenueMap[monthName] || 0) + p.amount;
      }
    });

    const monthlyRevenueData = months.map((month) => ({
      month,
      revenue: monthlyRevenueMap[month] || 0,
    }));

    // Property type distribution
    const propertyTypeCounts = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } },
    ]);
    const propertyTypeData = propertyTypeCounts.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    // User distribution dataset
    const userDistributionData = [
      { name: 'Tenants', value: totalTenants, color: '#3b82f6' },
      { name: 'Owners', value: totalOwners, color: '#10b981' },
      { name: 'Admins', value: totalAdmins, color: '#6366f1' },
    ];

    // Rental request status dataset
    const requestStatusData = [
      { status: 'Pending', count: pendingRequests },
      { status: 'Approved', count: approvedRequests },
      { status: 'Rejected', count: rejectedRequests },
    ];

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalTenants,
          totalOwners,
          totalProperties,
          pendingProperties,
          approvedProperties,
          activeRentals,
          totalRevenue,
          pendingComplaints,
          resolvedComplaints,
          totalRequests,
        },
        charts: {
          monthlyRevenue: monthlyRevenueData,
          propertyDistribution: propertyTypeData,
          userDistribution: userDistributionData,
          requestStatus: requestStatusData,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search & role filter
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (active <-> disabled)
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent disabling self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot disable your own admin account' });
    }

    user.status = user.status === 'active' ? 'disabled' : 'active';
    await user.save();

    res.json({
      success: true,
      message: `User account is now ${user.status}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }

    // Clean up dependent resources
    await Property.deleteMany({ ownerId: user._id });
    await RentalRequest.deleteMany({ $or: [{ tenantId: user._id }, { ownerId: user._id }] });
    await RentPayment.deleteMany({ $or: [{ tenantId: user._id }, { ownerId: user._id }] });
    await MaintenanceRequest.deleteMany({ $or: [{ tenantId: user._id }, { ownerId: user._id }] });

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and associated data removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties (all statuses) for admin
// @route   GET /api/admin/properties
// @access  Private (Admin)
const getAllPropertiesAdmin = async (req, res, next) => {
  try {
    const { search, status, propertyType } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    const properties = await Property.find(query)
      .populate('ownerId', 'name email phone profileImage')
      .populate('currentTenantId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve property
// @route   PUT /api/admin/properties/:id/approve
// @access  Private (Admin)
const approveProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.status = 'approved';
    await property.save();

    res.json({
      success: true,
      message: 'Property approved successfully and is now listed publicly',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject property
// @route   PUT /api/admin/properties/:id/reject
// @access  Private (Admin)
const rejectProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.status = 'rejected';
    await property.save();

    res.json({
      success: true,
      message: 'Property marked as rejected',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rental requests across platform
// @route   GET /api/admin/requests
// @access  Private (Admin)
const getAllRequestsAdmin = async (req, res, next) => {
  try {
    const requests = await RentalRequest.find()
      .populate('propertyId', 'title address city rent')
      .populate('tenantId', 'name email phone')
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

// @desc    Get all maintenance complaints across platform
// @route   GET /api/admin/maintenance
// @access  Private (Admin)
const getAllMaintenanceAdmin = async (req, res, next) => {
  try {
    const complaints = await MaintenanceRequest.find()
      .populate('propertyId', 'title address city')
      .populate('tenantId', 'name email phone')
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllPropertiesAdmin,
  approveProperty,
  rejectProperty,
  getAllRequestsAdmin,
  getAllMaintenanceAdmin,
};
