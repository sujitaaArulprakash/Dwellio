const Property = require('../models/Property');
const Review = require('../models/Review');

// @desc    Get all properties with filtering, searching, and sorting
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const {
      search,
      city,
      state,
      propertyType,
      minRent,
      maxRent,
      bedrooms,
      bathrooms,
      amenities,
      sort,
      ownerId,
      status,
      limit,
    } = req.query;

    const query = {};

    // For public catalog, show approved and available/rented properties (not pending/rejected)
    // If ownerId is supplied and user requests own properties, status filter can be customized
    if (status) {
      query.status = status;
    } else if (ownerId) {
      query.ownerId = ownerId;
    } else {
      // Public default: approved or available or rented (exclude pending and rejected)
      query.status = { $in: ['approved', 'available', 'rented'] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (state) {
      query.state = { $regex: state, $options: 'i' };
    }

    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    if (bedrooms && bedrooms !== 'All') {
      query.bedrooms = Number(bedrooms);
    }

    if (bathrooms && bathrooms !== 'All') {
      query.bathrooms = Number(bathrooms);
    }

    if (amenities) {
      const amenitiesArr = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
      if (amenitiesArr.length > 0) {
        query.amenities = { $all: amenitiesArr };
      }
    }

    let sortQuery = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortQuery = { rent: 1 };
    } else if (sort === 'price_desc') {
      sortQuery = { rent: -1 };
    } else if (sort === 'oldest') {
      sortQuery = { createdAt: 1 };
    }

    let propertiesQuery = Property.find(query)
      .populate('ownerId', 'name email phone profileImage')
      .populate('currentTenantId', 'name email phone')
      .sort(sortQuery);

    if (limit) {
      propertiesQuery = propertiesQuery.limit(Number(limit));
    }

    const properties = await propertiesQuery;

    // Attach review counts and avg rating
    const propertiesWithRatings = await Promise.all(
      properties.map(async (prop) => {
        const reviews = await Review.find({ propertyId: prop._id });
        const reviewCount = reviews.length;
        const avgRating =
          reviewCount > 0
            ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
            : 0;
        return {
          ...prop.toObject(),
          reviewCount,
          avgRating,
        };
      })
    );

    res.json({
      success: true,
      count: propertiesWithRatings.length,
      data: propertiesWithRatings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('ownerId', 'name email phone profileImage createdAt')
      .populate('currentTenantId', 'name email phone profileImage');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const reviews = await Review.find({ propertyId: property._id })
      .populate('tenantId', 'name profileImage')
      .sort({ createdAt: -1 });

    const reviewCount = reviews.length;
    const avgRating =
      reviewCount > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 0;

    res.json({
      success: true,
      data: {
        ...property.toObject(),
        reviewCount,
        avgRating,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (Owner, Admin)
const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      address,
      city,
      state,
      rent,
      securityDeposit,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images,
    } = req.body;

    // Handle amenities if passed as JSON string
    let parsedAmenities = amenities;
    if (typeof amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch (e) {
        parsedAmenities = amenities.split(',').map((a) => a.trim());
      }
    }

    // Handle images if uploaded via Multer or passed in body
    let finalImages = [];
    if (req.files && req.files.length > 0) {
      finalImages = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (images) {
      finalImages = Array.isArray(images) ? images : [images];
    }

    // Admins can create pre-approved properties; owners create 'pending'
    const initialStatus = req.user.role === 'admin' ? 'approved' : 'pending';

    const property = await Property.create({
      ownerId: req.user._id,
      title,
      description,
      propertyType,
      address,
      city,
      state,
      rent: Number(rent),
      securityDeposit: Number(securityDeposit || 0),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      amenities: parsedAmenities || [],
      images: finalImages,
      status: initialStatus,
    });

    res.status(201).json({
      success: true,
      message:
        initialStatus === 'pending'
          ? 'Property submitted successfully! It is pending admin approval.'
          : 'Property created successfully.',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner of property or Admin)
const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Authorization check
    if (property.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    const updates = { ...req.body };

    // Parse amenities if string
    if (typeof updates.amenities === 'string') {
      try {
        updates.amenities = JSON.parse(updates.amenities);
      } catch (e) {
        updates.amenities = updates.amenities.split(',').map((a) => a.trim());
      }
    }

    // If new files were uploaded via Multer
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      updates.images = [...(property.images || []), ...newImages];
    }

    // Only admin can set approved/rejected directly
    if (req.user.role !== 'admin' && updates.status) {
      // Owner can toggle between available and rented if approved
      if (['available', 'rented'].includes(updates.status) && ['approved', 'available', 'rented'].includes(property.status)) {
        // permitted
      } else {
        delete updates.status;
      }
    }

    property = await Property.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner of property or Admin)
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();

    res.json({
      success: true,
      message: 'Property removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get properties owned by the logged-in owner
// @route   GET /api/properties/owner/my
// @access  Private (Owner)
const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ ownerId: req.user._id })
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

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};
