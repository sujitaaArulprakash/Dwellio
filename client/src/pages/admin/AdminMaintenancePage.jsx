import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Wrench } from 'lucide-react';

const AdminMaintenancePage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const res = await adminService.getMaintenance();
        setComplaints(res.data || []);
      } catch (err) {
        console.error('Failed to load admin maintenance:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenance();
  }, []);

  if (loading) return <Loader message="Loading platform maintenance tickets..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Platform Maintenance Tickets</h1>
          <p className="page-header-subtitle">
            Oversight of tenant complaints, landlord resolution turnaround, and outstanding repair tasks.
          </p>
        </div>
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No Maintenance Tickets"
          description="No complaints have been reported across the network."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Tenant</th>
                <th>Owner</th>
                <th>Property</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{c.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.description}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{c.category}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '700', color: c.priority === 'Urgent' ? 'var(--danger)' : 'var(--text-main)' }}>
                      {c.priority}
                    </span>
                  </td>
                  <td>{c.tenantId?.name || 'Tenant'}</td>
                  <td>{c.ownerId?.name || 'Owner'}</td>
                  <td style={{ fontWeight: '600' }}>{c.propertyId?.title || 'Property'}</td>
                  <td><Badge status={c.status} /></td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMaintenancePage;
