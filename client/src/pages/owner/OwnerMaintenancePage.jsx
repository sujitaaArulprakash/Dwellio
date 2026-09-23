import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../../services/maintenanceService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { Wrench, CheckCircle, Clock, AlertTriangle, Edit3, Image as ImageIcon } from 'lucide-react';

const OwnerMaintenancePage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: 'In Progress', resolutionNotes: '' });
  const [updating, setUpdating] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await maintenanceService.getOwnerRequests();
      setComplaints(res.data || []);
    } catch (err) {
      console.error('Failed to load owner complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openUpdateModal = (ticket) => {
    setSelectedTicket(ticket);
    setStatusUpdate({
      status: ticket.status,
      resolutionNotes: ticket.resolutionNotes || '',
    });
    setModalOpen(true);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setUpdating(true);
    try {
      await maintenanceService.updateStatus(selectedTicket._id, statusUpdate);
      setModalOpen(false);
      fetchComplaints();
    } catch (err) {
      alert(err.message || 'Failed to update maintenance status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader message="Loading tenant maintenance tickets..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Maintenance & Repair Operations</h1>
          <p className="page-header-subtitle">
            Manage incoming repair complaints from tenants, dispatch contractors, and log resolutions.
          </p>
        </div>
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No Maintenance Complaints"
          description="All of your properties are operating smoothly without open repair issues."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {complaints.map((ticket) => (
            <div key={ticket._id} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                    <span
                      style={{
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                      }}
                    >
                      {ticket.category}
                    </span>
                    <span
                      style={{
                        background: ticket.priority === 'Urgent' ? 'var(--danger-bg)' : '#f1f5f9',
                        color: ticket.priority === 'Urgent' ? 'var(--danger)' : '#475569',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                      }}
                    >
                      Priority: {ticket.priority}
                    </span>
                    <Badge status={ticket.status} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{ticket.title}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Reported by: <strong>{ticket.tenantId?.name || 'Tenant'}</strong> • Property: {ticket.propertyId?.title}
                  </div>
                </div>

                <button
                  onClick={() => openUpdateModal(ticket)}
                  className="btn btn-secondary btn-sm"
                >
                  <Edit3 size={15} /> Update Status / Notes
                </button>
              </div>

              <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                {ticket.description}
              </p>

              {ticket.image && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ImageIcon size={14} /> Attached Photo:
                  </div>
                  <img
                    src={ticket.image}
                    alt="Complaint photo"
                    style={{ maxHeight: '180px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Resolution Notes */}
              <div
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                }}
              >
                <strong>Resolution Progress & Action Taken:</strong>
                <p style={{ color: ticket.resolutionNotes ? 'var(--text-main)' : 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {ticket.resolutionNotes || 'No notes added yet. Click "Update Status / Notes" above to add updates.'}
                </p>
                {ticket.resolvedAt && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--success-text)', marginTop: '0.4rem', fontWeight: '600' }}>
                    Marked resolved on {new Date(ticket.resolvedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Update Maintenance Ticket"
        maxWidth="500px"
      >
        <form onSubmit={handleSaveStatus}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>{selectedTicket?.title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Category: {selectedTicket?.category} • Priority: {selectedTicket?.priority}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Workflow Status</label>
            <select
              className="form-control"
              value={statusUpdate.status}
              onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
            >
              <option value="Pending">Pending Review</option>
              <option value="In Progress">In Progress (Contractor Dispatched)</option>
              <option value="Resolved">Resolved (Work Completed)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Resolution & Contractor Notes</label>
            <textarea
              className="form-control"
              rows={4}
              value={statusUpdate.resolutionNotes}
              onChange={(e) => setStatusUpdate({ ...statusUpdate, resolutionNotes: e.target.value })}
              placeholder="e.g. Plumber scheduled for 10am Friday. Parts ordered..."
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={updating} className="btn btn-primary" style={{ flex: 2 }}>
              {updating ? 'Saving...' : 'Save Updates'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OwnerMaintenancePage;
