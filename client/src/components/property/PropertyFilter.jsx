import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

const AMENITY_OPTIONS = [
  'Wi-Fi',
  'Parking',
  'Security',
  'Water Supply',
  'Electricity Backup',
  'Air Conditioning',
  'Furnished',
  'CCTV',
  'Balcony',
  'Gym',
];

const PROPERTY_TYPES = ['All', 'Apartment', 'House', 'Villa', 'Studio', 'Condo', 'Townhouse'];

const PropertyFilter = ({ filters, onChange, onReset, onApply }) => {
  const handleTextChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleAmenity = (amenity) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    onChange({ ...filters, amenities: updated });
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.1rem' }}>
          <Filter size={20} style={{ color: 'var(--primary)' }} />
          <span>Filter Rental Properties</span>
        </div>
        <button
          onClick={onReset}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Grid Filter Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        {/* Keyword Search */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Keyword Search</label>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }}
            />
            <input
              type="text"
              name="search"
              value={filters.search || ''}
              onChange={handleTextChange}
              placeholder="Search address or title..."
              className="form-control"
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>
        </div>

        {/* City Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">City / Location</label>
          <input
            type="text"
            name="city"
            value={filters.city || ''}
            onChange={handleTextChange}
            placeholder="e.g. San Francisco, Austin"
            className="form-control"
          />
        </div>

        {/* Property Type */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Property Type</label>
          <select
            name="propertyType"
            value={filters.propertyType || 'All'}
            onChange={handleTextChange}
            className="form-control"
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Monthly Rent Range ($)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="number"
              name="minRent"
              value={filters.minRent || ''}
              onChange={handleTextChange}
              placeholder="Min"
              className="form-control"
            />
            <span style={{ color: 'var(--text-muted)' }}>–</span>
            <input
              type="number"
              name="maxRent"
              value={filters.maxRent || ''}
              onChange={handleTextChange}
              placeholder="Max"
              className="form-control"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Bedrooms</label>
          <select
            name="bedrooms"
            value={filters.bedrooms || 'All'}
            onChange={handleTextChange}
            className="form-control"
          >
            <option value="All">Any Bedrooms</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
        </div>

        {/* Bathrooms */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Bathrooms</label>
          <select
            name="bathrooms"
            value={filters.bathrooms || 'All'}
            onChange={handleTextChange}
            className="form-control"
          >
            <option value="All">Any Bathrooms</option>
            <option value="1">1 Bathroom</option>
            <option value="2">2 Bathrooms</option>
            <option value="3">3+ Bathrooms</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Sort Order</label>
          <select
            name="sort"
            value={filters.sort || 'newest'}
            onChange={handleTextChange}
            className="form-control"
          >
            <option value="newest">Newest Listed</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="oldest">Oldest Listed</option>
          </select>
        </div>
      </div>

      {/* Amenities Chips */}
      <div>
        <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
          Included Amenities
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {AMENITY_OPTIONS.map((amenity) => {
            const isSelected = (filters.amenities || []).includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--primary-light)' : '#ffffff',
                  color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                {isSelected ? '✓ ' : '+ '} {amenity}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter;
