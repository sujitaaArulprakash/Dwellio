const Review = require('../models/Review');
const Property = require('../models/Property');
const RentalRequest = require('../models/RentalRequest');

// @desc    Submit a review for a property
// @route   POST /api/reviews
// @access  Private (Tenant)
const createReview = async (req, res, next) => {
  try {
    const { propertyId, rating, comment } = req.body;

    if (!propertyId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Property, rating, and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check if user has an approved rental for this property or is currently renting it
    const hasRented =
      (property.currentTenantId && property.currentTenantId.toString() === req.user._id.toString()) ||
      (await RentalRequest.findOne({
        propertyId,
        tenantId: req.user._id,
        status: 'approved',
      }));

    if (!hasRented) {
      return res.status(403).json({
        success: false,
        message: 'Only tenants who have rented this property can submit a review',
      });
    }

    // Prevent duplicate review
    const existingReview = await Review.findOne({
      propertyId,
      tenantId: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this property',
      });
    }

    const review = await Review.create({
      propertyId,
      tenantId: req.user._id,
      rating: Number(rating),
      comment,
    });

    await review.populate('tenantId', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this property',
      });
    }
    next(error);
  }
};

// @desc    Get reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
const getPropertyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.propertyId })
      .populate('tenantId', 'name profileImage createdAt')
      .sort({ createdAt: -1 });

    const reviewCount = reviews.length;
    const avgRating =
      reviewCount > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 0;

    res.json({
      success: true,
      count: reviewCount,
      avgRating,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews written by logged-in tenant
// @route   GET /api/reviews/my
// @access  Private (Tenant)
const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ tenantId: req.user._id })
      .populate('propertyId', 'title address city rent images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getPropertyReviews,
  getMyReviews,
};
