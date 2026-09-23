import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../../services/maintenanceService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import MaintenanceRequestModal from '../../components/tenant/MaintenanceRequestModal';
import { Wrench, Plus, Clock, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';

const TenantMaintenancePage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await maintenanceService.getMyRequests();
      setComplaints(res.data || []);
    } catch (err) {
      console.error('Failed to load maintenance requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (loading) return <Loader message="Loading your maintenance requests..." />;

  const getTimelineClass = (currentStatus, stepName) => {
    const statuses = ['Pending', 'In Progress', 'Resolved'];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(stepName);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return '';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Maintenance & Repair Requests</h1>
          <p className="page-header-subtitle">
            Submit service requests, upload photos, and monitor technician resolution milestones.
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-sm">
          <Plus size={16} /> Raise New Complaint
        </button>
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No Maintenance Tickets"
          description="Everything running smoothly! If you ever need plumbing, electrical, or appliance repairs, submit a ticket here."
          actionText="File a Complaint"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {complaints.map((item) => (
            <div key={item._id} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
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
                      {item.category}
                    </span>
                    <span
                      style={{
                        background: item.priority === 'Urgent' ? 'var(--danger-bg)' : '#f1f5f9',
                        color: item.priority === 'Urgent' ? 'var(--danger)' : '#475569',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                      }}
                    >
                      Priority: {item.priority}
                    </span>
                    <Badge status={item.status} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{item.title}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Submitted for: {item.propertyId?.title || 'Current Rental'} • {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {item.description}
              </p>

              {/* Photo preview if uploaded */}
              {item.image && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ImageIcon size={14} /> Attached Photo:
                  </div>
                  <img
                    src={item.image}
                    alt="Issue attachment"
                    style={{ maxHeight: '180px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Status Timeline */}
              <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', marginBottom: '0.5rem' }}>
                  Resolution Timeline
                </div>

                <div className="timeline">
                  <div className={`timeline-step ${getTimelineClass(item.status, 'Pending')}`}>
                    <div className="timeline-dot">1</div>
                    <span className="timeline-label">Pending</span>
                  </div>

                  <div className={`timeline-step ${getTimelineClass(item.status, 'In Progress')}`}>
                    <div className="timeline-dot">2</div>
                    <span className="timeline-label">In Progress</span>
                  </div>

                  <div className={`timeline-step ${getTimelineClass(item.status, 'Resolved')}`}>
                    <div className="timeline-dot">3</div>
                    <span className="timeline-label">Resolved</span>
                  </div>
                </div>

                {item.resolutionNotes && (
                  <div style={{ background: '#ffffff', border: '1px solid var(--border)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginTop: '1rem', fontSize: '0.875rem' }}>
                    <strong style={{ color: 'var(--text-main)' }}>Owner / Technician Notes:</strong>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{item.resolutionNotes}</p>
                    {item.resolvedAt && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--success-text)', marginTop: '0.35rem', fontWeight: '600' }}>
                        Marked resolved on {new Date(item.resolvedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <MaintenanceRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchComplaints()}
      />
    </div>
  );
};

export default TenantMaintenancePage;
