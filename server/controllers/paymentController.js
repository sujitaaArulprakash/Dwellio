const RentPayment = require('../models/RentPayment');
const Property = require('../models/Property');

// @desc    Get tenant's payments
// @route   GET /api/payments/my
// @access  Private (Tenant)
const getMyPayments = async (req, res, next) => {
  try {
    const payments = await RentPayment.find({ tenantId: req.user._id })
      .populate('propertyId', 'title address city state rent images')
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    // Mark overdue if pending and dueDate < now
    const now = new Date();
    for (let p of payments) {
      if (p.status === 'pending' && new Date(p.dueDate) < now) {
        p.status = 'overdue';
        await p.save();
      }
    }

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner's rent payments received / pending
// @route   GET /api/payments/owner
// @access  Private (Owner)
const getOwnerPayments = async (req, res, next) => {
  try {
    const payments = await RentPayment.find({ ownerId: req.user._id })
      .populate('propertyId', 'title address city state rent images')
      .populate('tenantId', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    // Calculate totals
    const totalIncome = payments
      .filter((p) => p.status === 'paid')
      .reduce((acc, p) => acc + p.amount, 0);

    const pendingRent = payments
      .filter((p) => p.status === 'pending')
      .reduce((acc, p) => acc + p.amount, 0);

    const overdueRent = payments
      .filter((p) => p.status === 'overdue')
      .reduce((acc, p) => acc + p.amount, 0);

    res.json({
      success: true,
      count: payments.length,
      summary: {
        totalIncome,
        pendingRent,
        overdueRent,
      },
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate paying rent
// @route   POST /api/payments/simulate
// @access  Private (Tenant)
const simulatePayRent = async (req, res, next) => {
  try {
    const { paymentId, paymentMethod } = req.body;

    let payment;
    if (paymentId) {
      payment = await RentPayment.findById(paymentId);
    } else {
      // Find latest pending payment for this tenant
      payment = await RentPayment.findOne({
        tenantId: req.user._id,
        status: { $in: ['pending', 'overdue'] },
      }).sort({ dueDate: 1 });
    }

    if (!payment) {
      // If no pending payment exists, create a new mock payment for their currently rented property
      const rentedProperty = await Property.findOne({
        currentTenantId: req.user._id,
        status: 'rented',
      });

      if (!rentedProperty) {
        return res.status(400).json({
          success: false,
          message: 'No active rental found to make a payment for',
        });
      }

      payment = new RentPayment({
        propertyId: rentedProperty._id,
        tenantId: req.user._id,
        ownerId: rentedProperty.ownerId,
        amount: rentedProperty.rent,
        dueDate: new Date(),
      });
    }

    if (payment.tenantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay this bill',
      });
    }

    // Generate mock transaction ID
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const mockTxnId = `TXN-DEMO-${randomHex}-${timestamp}`;

    payment.status = 'paid';
    payment.paymentDate = new Date();
    payment.paymentMethod = paymentMethod || 'Simulated Debit/Credit Card';
    payment.transactionId = mockTxnId;

    await payment.save();

    await payment.populate([
      { path: 'propertyId', select: 'title address city state rent images' },
      { path: 'ownerId', select: 'name email phone' },
      { path: 'tenantId', select: 'name email phone' },
    ]);

    // Create next month's bill as pending so the system stays continuous
    const nextDueDate = new Date(payment.dueDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);

    const nextBill = await RentPayment.findOne({
      propertyId: payment.propertyId,
      tenantId: payment.tenantId,
      status: 'pending',
    });

    if (!nextBill) {
      await RentPayment.create({
        propertyId: payment.propertyId,
        tenantId: payment.tenantId,
        ownerId: payment.ownerId,
        amount: payment.amount,
        dueDate: nextDueDate,
        status: 'pending',
      });
    }

    res.json({
      success: true,
      message: 'Demo payment processed successfully! Receipt generated.',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create manual payment record (for owner or admin)
// @route   POST /api/payments
// @access  Private (Owner, Admin)
const createPaymentRecord = async (req, res, next) => {
  try {
    const { propertyId, tenantId, amount, dueDate, paymentMethod } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const payment = await RentPayment.create({
      propertyId,
      tenantId,
      ownerId: req.user._id,
      amount: Number(amount || property.rent),
      dueDate: dueDate || new Date(),
      paymentMethod: paymentMethod || 'Online Transfer',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Rent payment invoice created successfully',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyPayments,
  getOwnerPayments,
  simulatePayRent,
  createPaymentRecord,
};
