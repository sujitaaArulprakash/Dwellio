import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rentalService } from '../../services/rentalService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { FileText, CheckCircle, XCircle, User, Phone, Mail, MapPin } from 'lucide-react';

const OwnerRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await rentalService.getOwnerRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error('Failed to load rental requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this tenant application? The property status will be set to "rented" and other pending requests will be automatically rejected.')) return;
    setActionLoading(id);
    try {
      await rentalService.approveRequest(id);
      alert('Rental application approved! The property is now marked as rented and the tenant lease is active.');
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Failed to approve request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to decline this rental application?')) return;
    setActionLoading(id);
    try {
      await rentalService.rejectRequest(id);
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader message="Loading rental applications..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Rental Applications & Inquiries</h1>
          <p className="page-header-subtitle">
            Review prospective tenants, evaluate background messages, and approve lease agreements.
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Rental Applications"
          description="You currently don't have any incoming rental requests from prospective tenants."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {requests.map((req) => (
            <div key={req._id} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.25rem', marginBottom: '1.25rem' }}>
                {/* Tenant profile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {req.tenantId?.profileImage ? (
                    <img
                      src={req.tenantId.profileImage}
                      alt={req.tenantId.name}
                      style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '1.2rem',
                      }}
                    >
                      {req.tenantId?.name?.charAt(0) || 'T'}
                    </div>
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                        {req.tenantId?.name || 'Applicant'}
                      </h3>
                      <Badge status={req.status} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={14} /> {req.tenantId?.email}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={14} /> {req.tenantId?.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property summary */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Listing</div>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>
                    <Link to={`/properties/${req.propertyId?._id}`} style={{ color: 'var(--primary)' }}>
                      {req.propertyId?.title}
                    </Link>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ${req.propertyId?.rent?.toLocaleString()} / mo • Current Status: <span style={{ textTransform: 'capitalize' }}>{req.propertyId?.status}</span>
                  </div>
                </div>
              </div>

              {/* Message from Tenant */}
              <div
                style={{
                  background: 'var(--bg-main)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                  Applicant Statement
                </div>
                <p style={{ color: '#334155', fontSize: '0.925rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{req.message || 'No written message provided.'}"
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
                  Application submitted on {new Date(req.requestedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              {/* Decision Actions */}
              {req.status === 'pending' ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleReject(req._id)}
                    disabled={actionLoading === req._id}
                    className="btn btn-outline-danger btn-sm"
                  >
                    <XCircle size={16} /> Decline Request
                  </button>
                  <button
                    onClick={() => handleApprove(req._id)}
                    disabled={actionLoading === req._id}
                    className="btn btn-primary btn-sm"
                    style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}
                  >
                    <CheckCircle size={16} /> Accept & Sign Lease
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Decision logged: <span style={{ textTransform: 'capitalize', color: req.status === 'approved' ? 'var(--accent)' : 'var(--danger)' }}>{req.status}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerRequestsPage;
