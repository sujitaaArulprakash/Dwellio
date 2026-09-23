import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Building2, Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, MapPin } from 'lucide-react';

const OwnerPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await propertyService.getMyProperties();
      setProperties(res.data || []);
    } catch (err) {
      console.error('Failed to load owner properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this property? This cannot be undone.')) return;
    setActionLoading(id);
    try {
      await propertyService.deleteProperty(id);
      fetchProperties();
    } catch (err) {
      alert(err.message || 'Failed to delete property');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAvailability = async (property) => {
    // Only approved/available/rented properties can toggle
    if (['pending', 'rejected'].includes(property.status)) {
      alert(`This property is currently '${property.status}'. Only admin-approved properties can change availability.`);
      return;
    }

    const newStatus = property.status === 'rented' ? 'available' : 'rented';
    setActionLoading(property._id);
    try {
      await propertyService.updateProperty(property._id, { status: newStatus });
      fetchProperties();
    } catch (err) {
      alert(err.message || 'Failed to update property status');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader message="Loading your property portfolio..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">My Properties</h1>
          <p className="page-header-subtitle">
            Manage your listings, edit amenities, track approval status, and toggle availability.
          </p>
        </div>
        <Link to="/owner/properties/new" className="btn btn-primary btn-sm">
          <Plus size={16} /> Add New Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Properties Listed"
          description="You haven't added any rental properties yet. Create your first listing to start accepting tenant applications."
          actionText="Add a Property"
          onAction={() => window.location.assign('/owner/properties/new')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {properties.map((property) => (
            <div
              key={property._id}
              className="card"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                padding: '1.5rem',
              }}
            >
              {/* Property Details Column */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '300px', flex: 2 }}>
                <img
                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'}
                  alt={property.title}
                  style={{ width: '120px', height: '85px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
                      {property.propertyType}
                    </span>
                    <Badge status={property.status} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                    {property.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <MapPin size={14} />
                    <span>{property.address}, {property.city}, {property.state}</span>
                  </div>
                </div>
              </div>

              {/* Financials & Tenant */}
              <div style={{ display: 'flex', gap: '2rem', flex: 1, minWidth: '180px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly Rent</div>
                  <div style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary)' }}>
                    ${property.rent?.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tenant</div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                    {property.currentTenantId ? property.currentTenantId.name : <span style={{ color: 'var(--text-subtle)' }}>Vacant</span>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  to={`/properties/${property._id}`}
                  className="btn btn-secondary btn-sm"
                  title="View Public Page"
                >
                  <Eye size={15} />
                </Link>

                <Link
                  to={`/owner/properties/edit/${property._id}`}
                  className="btn btn-secondary btn-sm"
                  title="Edit Property"
                >
                  <Edit size={15} />
                </Link>

                <button
                  onClick={() => handleToggleAvailability(property)}
                  disabled={actionLoading === property._id || ['pending', 'rejected'].includes(property.status)}
                  className="btn btn-secondary btn-sm"
                  title={property.status === 'rented' ? 'Mark Available' : 'Mark Rented'}
                >
                  {property.status === 'rented' ? (
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--success)' }}>Mark Available</span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>Mark Rented</span>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(property._id)}
                  disabled={actionLoading === property._id}
                  className="btn btn-outline-danger btn-sm"
                  title="Delete Property"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerPropertiesPage;
