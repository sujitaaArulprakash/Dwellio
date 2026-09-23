const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['Apartment', 'House', 'Villa', 'Studio', 'Condo', 'Townhouse'],
      default: 'Apartment',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    rent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [0, 'Rent must be positive'],
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      default: 0,
      min: [0, 'Security deposit must be positive'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms must be non-negative'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Bathrooms must be non-negative'],
    },
    area: {
      type: Number,
      required: [true, 'Area in sq ft is required'],
      min: [0, 'Area must be positive'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'available', 'rented'],
      default: 'pending',
    },
    currentTenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for average rating
propertySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'propertyId',
});

module.exports = mongoose.model('Property', propertySchema);
