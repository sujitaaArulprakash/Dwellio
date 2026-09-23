import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../../components/property/PropertyCard';
import PropertyFilter from '../../components/property/PropertyFilter';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Home } from 'lucide-react';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize filters from search parameters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    propertyType: searchParams.get('propertyType') || 'All',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    bedrooms: searchParams.get('bedrooms') || 'All',
    bathrooms: searchParams.get('bathrooms') || 'All',
    amenities: searchParams.get('amenities') ? searchParams.get('amenities').split(',') : [],
    sort: searchParams.get('sort') || 'newest',
  });

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.city) params.city = filters.city;
      if (filters.propertyType && filters.propertyType !== 'All') params.propertyType = filters.propertyType;
      if (filters.minRent) params.minRent = filters.minRent;
      if (filters.maxRent) params.maxRent = filters.maxRent;
      if (filters.bedrooms && filters.bedrooms !== 'All') params.bedrooms = filters.bedrooms;
      if (filters.bathrooms && filters.bathrooms !== 'All') params.bathrooms = filters.bathrooms;
      if (filters.amenities && filters.amenities.length > 0) params.amenities = filters.amenities.join(',');
      if (filters.sort) params.sort = filters.sort;

      const res = await propertyService.getProperties(params);
      setProperties(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const handleReset = () => {
    setFilters({
      search: '',
      city: '',
      propertyType: 'All',
      minRent: '',
      maxRent: '',
      bedrooms: 'All',
      bathrooms: 'All',
      amenities: [],
      sort: 'newest',
    });
    setSearchParams({});
  };

  return (
    <div style={{ padding: '3rem 0 5rem', minHeight: '80vh' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Browse Rental Properties
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
            Explore verified homes, apartments, villas, and lofts ready for occupancy.
          </p>
        </div>

        {/* Filter Controls */}
        <PropertyFilter
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
        />

        {/* Status Count & Summary */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.925rem' }}>
            Showing <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{properties.length}</span> verified properties
          </div>
        </div>

        {error && (
          <div
            style={{
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <Loader message="Searching available listings..." minHeight="400px" />
        ) : properties.length === 0 ? (
          <EmptyState
            icon={Home}
            title="No properties found"
            description="We couldn't find any rental properties matching your current filter criteria. Try adjusting the price range or resetting filters."
            actionText="Reset All Filters"
            onAction={handleReset}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
