import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { propertyService } from '../../services/propertyService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Building2, Search, CheckCircle, XCircle, Trash2, Eye, MapPin } from 'lucide-react';

const AdminPropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.propertyType = typeFilter;

      const res = await adminService.getProperties(params);
      setProperties(res.data || []);
    } catch (err) {
      console.error('Failed to load admin properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await adminService.approveProperty(id);
      fetchProperties();
    } catch (err) {
      alert(err.message || 'Failed to approve property');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await adminService.rejectProperty(id);
      fetchProperties();
    } catch (err) {
      alert(err.message || 'Failed to reject property');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this property listing from the platform?')) return;
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

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Property Moderation & Catalog</h1>
          <p className="page-header-subtitle">
            Review submitted landlord properties, approve verified homes, and moderate public listings.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem',
          justifyContent: 'space-between',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search title, city, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Moderation</option>
            <option value="approved">Approved</option>
            <option value="rented">Rented</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="form-control"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Studio">Studio</option>
            <option value="Condo">Condo</option>
          </select>
        </div>
      </div>

      {/* Property Moderation List */}
      {loading ? (
        <Loader message="Loading property listings..." />
      ) : properties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Properties Found"
          description="There are no property listings matching your moderation filter criteria."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {properties.map((p) => (
            <div
              key={p._id}
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
              {/* Property Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '320px', flex: 2 }}>
                <img
                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'}
                  alt={p.title}
                  style={{ width: '130px', height: '90px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
                      {p.propertyType}
                    </span>
                    <Badge status={p.status} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                    {p.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <MapPin size={14} />
                    <span>{p.address}, {p.city}, {p.state} • ${p.rent?.toLocaleString()} / mo</span>
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Listed by Owner:</div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{p.ownerId?.name || 'Owner'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.ownerId?.email}</div>
              </div>

              {/* Moderation Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  to={`/properties/${p._id}`}
                  className="btn btn-secondary btn-sm"
                  title="View Public Details"
                >
                  <Eye size={15} /> Preview
                </Link>

                {p.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(p._id)}
                      disabled={actionLoading === p._id}
                      className="btn btn-primary btn-sm"
                      style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}
                      title="Approve Listing"
                    >
                      <CheckCircle size={15} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(p._id)}
                      disabled={actionLoading === p._id}
                      className="btn btn-outline-danger btn-sm"
                      title="Reject Listing"
                    >
                      <XCircle size={15} /> Reject
                    </button>
                  </>
                )}

                {p.status === 'rejected' && (
                  <button
                    onClick={() => handleApprove(p._id)}
                    disabled={actionLoading === p._id}
                    className="btn btn-secondary btn-sm"
                  >
                    Re-approve
                  </button>
                )}

                <button
                  onClick={() => handleDelete(p._id)}
                  disabled={actionLoading === p._id}
                  className="btn btn-outline-danger btn-sm"
                  title="Remove Listing"
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

export default AdminPropertiesPage;
