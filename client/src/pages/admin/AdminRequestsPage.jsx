import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { FileText, MapPin, User } from 'lucide-react';

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await adminService.getRequests();
        setRequests(res.data || []);
      } catch (err) {
        console.error('Failed to load admin rental requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <Loader message="Loading platform rental applications..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Platform Rental Requests</h1>
          <p className="page-header-subtitle">
            Auditing and oversight of tenant rental inquiries and landlord responses across the platform.
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Rental Requests"
          description="No rental requests have been logged in the system yet."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Landlord</th>
                <th>Target Property</th>
                <th>Rent</th>
                <th>Requested Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{r.tenantId?.name || 'Tenant'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.tenantId?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700' }}>{r.ownerId?.name || 'Owner'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.ownerId?.email}</div>
                  </td>
                  <td style={{ fontWeight: '600' }}>{r.propertyId?.title || 'Property'}</td>
                  <td style={{ fontWeight: '700', color: 'var(--primary)' }}>
                    ${r.propertyId?.rent?.toLocaleString()}
                  </td>
                  <td>{new Date(r.requestedAt).toLocaleDateString()}</td>
                  <td>
                    <Badge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRequestsPage;
