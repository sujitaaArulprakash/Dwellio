import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin, Star } from 'lucide-react';
import Badge from '../common/Badge';

const PropertyCard = ({ property }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';
  const mainImage = property.images && property.images.length > 0 ? property.images[0] : defaultImage;

  // Format currency
  const formattedRent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.rent);

  return (
    <div className="property-card">
      <div className="property-card-image-wrapper">
        <img
          src={mainImage}
          alt={property.title}
          className="property-card-img"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div className="property-card-tag">{property.propertyType}</div>
        <div className="property-card-status">
          <Badge status={property.status} />
        </div>
      </div>

      <div className="property-card-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <div className="property-card-price">
            {formattedRent} <span>/ month</span>
          </div>
          {property.avgRating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
              <Star size={15} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
              <span>{property.avgRating}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.75rem' }}>
                ({property.reviewCount || 0})
              </span>
            </div>
          )}
        </div>

        <h3 className="property-card-title" title={property.title}>
          {property.title}
        </h3>

        <div className="property-card-location">
          <MapPin size={15} style={{ flexShrink: 0, color: 'var(--primary)' }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {property.city}, {property.state}
          </span>
        </div>

        <div className="property-card-features">
          <div className="property-feature-item" title="Bedrooms">
            <Bed size={16} />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="property-feature-item" title="Bathrooms">
            <Bath size={16} />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="property-feature-item" title="Living Area">
            <Maximize2 size={16} />
            <span>{property.area} sq ft</span>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <Link to={`/properties/${property._id}`} className="btn btn-secondary btn-block btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
