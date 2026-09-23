import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rentalService } from '../../services/rentalService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { FileText, MapPin, XCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const TenantApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await rentalService.getMyRequests();
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this rental application?')) return;
    setActionLoading(id);
    try {
      await rentalService.cancelRequest(id);
      fetchApplications();
    } catch (err) {
      alert(err.message || 'Failed to cancel application');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader message="Loading your rental applications..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">My Rental Applications</h1>
          <p className="page-header-subtitle">
            Track incoming responses, approval statuses, and active inquiries with landlords.
          </p>
        </div>
        <Link to="/properties" className="btn btn-primary btn-sm">
          Browse More Properties
        </Link>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Applications Submitted"
          description="You haven't requested to rent any properties yet. Browse listings to apply."
          actionText="Explore Properties"
          onAction={() => window.location.assign('/properties')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {applications.map((app) => (
            <div
              key={app._id}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '280px', flex: 1 }}>
                <img
                  src={app.propertyId?.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'}
                  alt={app.propertyId?.title || 'Property'}
                  style={{ width: '110px', height: '80px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
                      {app.propertyId?.propertyType || 'Property'}
                    </span>
                    <Badge status={app.status} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                    {app.propertyId ? (
                      <Link to={`/properties/${app.propertyId._id}`} style={{ color: 'inherit' }}>
                        {app.propertyId.title}
                      </Link>
                    ) : (
                      'Property (Archived)'
                    )}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <MapPin size={14} />
                    <span>{app.propertyId?.city}, {app.propertyId?.state} • ${app.propertyId?.rent?.toLocaleString()} / mo</span>
                  </div>
                </div>
              </div>

              {/* Message snippet */}
              <div style={{ flex: 1, minWidth: '220px', background: 'var(--bg-main)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.2rem' }}>
                  Your Message to Owner:
                </div>
                <div style={{ color: 'var(--text-main)', fontStyle: 'italic' }}>
                  "{app.message || 'No message attached'}"
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
                  Submitted on {new Date(app.requestedAt).toLocaleDateString()}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {app.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(app._id)}
                    disabled={actionLoading === app._id}
                    className="btn btn-outline-danger btn-sm"
                  >
                    <XCircle size={15} /> {actionLoading === app._id ? 'Cancelling...' : 'Cancel Application'}
                  </button>
                )}
                {app.status === 'approved' && (
                  <Link to="/tenant/rental" className="btn btn-primary btn-sm">
                    <CheckCircle2 size={15} /> View Active Lease
                  </Link>
                )}
                {app.status === 'rejected' && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: '600' }}>
                    Application Declined
                  </span>
                )}
                {app.status === 'cancelled' && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Cancelled by you
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantApplicationsPage;
