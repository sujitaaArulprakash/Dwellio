import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { rentalService } from '../../services/rentalService';
import { paymentService } from '../../services/paymentService';
import { maintenanceService } from '../../services/maintenanceService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import SimulatedPaymentModal from '../../components/tenant/SimulatedPaymentModal';
import {
  Home,
  CreditCard,
  Calendar,
  Wrench,
  ArrowRight,
  FileText,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

const TenantDashboard = () => {
  const { user } = useAuth();
  const [activeRental, setActiveRental] = useState(null);
  const [payments, setPayments] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [rentalRes, paymentsRes, maintRes, appsRes] = await Promise.all([
        rentalService.getActiveRental(),
        paymentService.getMyPayments(),
        maintenanceService.getMyRequests(),
        rentalService.getMyRequests(),
      ]);

      setActiveRental(rentalRes.data?.property || null);
      setPayments(paymentsRes.data || []);
      setMaintenance(maintRes.data || []);
      setApplications(appsRes.data || []);
    } catch (err) {
      console.error('Failed to load tenant dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loader message="Loading tenant portal..." />;

  // Pending complaints count
  const pendingComplaints = maintenance.filter(
    (m) => m.status === 'Pending' || m.status === 'In Progress'
  ).length;

  // Next due payment
  const nextPendingPayment = payments.find(
    (p) => p.status === 'pending' || p.status === 'overdue'
  );

  const handleOpenPayment = (payment) => {
    setSelectedPayment(payment);
    setPaymentModalOpen(true);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Tenant Dashboard</h1>
          <p className="page-header-subtitle">
            Manage your current rental lease, payments, maintenance tickets, and applications.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/properties" className="btn btn-secondary btn-sm">
            Browse Properties
          </Link>
          {nextPendingPayment && (
            <button
              onClick={() => handleOpenPayment(nextPendingPayment)}
              className="btn btn-primary btn-sm"
            >
              <CreditCard size={16} /> Pay Due Rent
            </button>
          )}
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="stats-grid">
        <StatCard
          title="Current Rental"
          value={activeRental ? activeRental.title.split(' ')[0] + '...' : 'None'}
          subtitle={activeRental ? `${activeRental.city}, ${activeRental.state}` : 'No active lease'}
          icon={Home}
          color="primary"
        />

        <StatCard
          title="Monthly Rent"
          value={activeRental ? `$${activeRental.rent?.toLocaleString()}` : '$0'}
          subtitle={activeRental ? 'Monthly recurring' : 'N/A'}
          icon={CreditCard}
          color="success"
        />

        <StatCard
          title="Next Due Date"
          value={
            nextPendingPayment
              ? new Date(nextPendingPayment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              : 'Up to date'
          }
          subtitle={nextPendingPayment ? `$${nextPendingPayment.amount?.toLocaleString()} due` : 'No payments due'}
          icon={Calendar}
          color={nextPendingPayment?.status === 'overdue' ? 'danger' : 'warning'}
        />

        <StatCard
          title="Pending Complaints"
          value={pendingComplaints}
          subtitle={pendingComplaints > 0 ? 'Requires attention' : 'All resolved'}
          icon={Wrench}
          color={pendingComplaints > 0 ? 'warning' : 'info'}
        />
      </div>

      {/* Current Property Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '700' }}>Current Rental Property</h2>
          {activeRental && (
            <Link to="/tenant/rental" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View Lease Details <ArrowRight size={15} />
            </Link>
          )}
        </div>

        {activeRental ? (
          <div
            className="card"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              alignItems: 'center',
              padding: '1.5rem',
            }}
          >
            <img
              src={activeRental.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'}
              alt={activeRental.title}
              style={{
                width: '180px',
                height: '120px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
              }}
            />
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
                  {activeRental.propertyType}
                </span>
                <Badge status="rented" text="Active Lease" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                {activeRental.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <MapPin size={15} style={{ color: 'var(--primary)' }} />
                <span>{activeRental.address}, {activeRental.city}, {activeRental.state}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right', borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly Rent</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)' }}>
                ${activeRental.rent?.toLocaleString()}
              </div>
              {nextPendingPayment && (
                <button
                  onClick={() => handleOpenPayment(nextPendingPayment)}
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '0.5rem' }}
                >
                  Pay Rent
                </button>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Home}
            title="No Active Rental Property"
            description="You do not currently have an active rental lease. Browse available listings and submit an application to rent a home."
            actionText="Browse Available Properties"
            onAction={() => window.location.assign('/properties')}
          />
        )}
      </div>

      {/* Split Grid: Recent Payments & Recent Maintenance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Recent Payments */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Recent Payments</h3>
            <Link to="/tenant/payments" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>
              View All
            </Link>
          </div>

          {payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No payments recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {payments.slice(0, 4).map((p) => (
                <div
                  key={p._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.925rem' }}>
                      ${p.amount?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Due: {new Date(p.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Badge status={p.status} />
                    {p.status !== 'paid' && (
                      <button
                        onClick={() => handleOpenPayment(p)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        Pay
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Maintenance Requests */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Maintenance Requests</h3>
            <Link to="/tenant/maintenance" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>
              View All
            </Link>
          </div>

          {maintenance.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No maintenance complaints raised.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {maintenance.slice(0, 4).map((m) => (
                <div
                  key={m._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.925rem' }}>{m.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {m.category} • Priority: {m.priority}
                    </div>
                  </div>
                  <Badge status={m.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application Status Section */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Rental Application Status</h3>
          <Link to="/tenant/applications" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>
            Manage Applications
          </Link>
        </div>

        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            You have not submitted any rental applications yet.
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Location</th>
                  <th>Monthly Rent</th>
                  <th>Application Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: '600' }}>{app.propertyId?.title || 'Unknown Property'}</td>
                    <td>{app.propertyId?.city || '–'}, {app.propertyId?.state || '–'}</td>
                    <td style={{ fontWeight: '700' }}>${app.propertyId?.rent?.toLocaleString()}</td>
                    <td>{new Date(app.requestedAt).toLocaleDateString()}</td>
                    <td><Badge status={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <SimulatedPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        onSuccess={() => fetchDashboardData()}
      />
    </div>
  );
};

export default TenantDashboard;
