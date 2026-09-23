import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { propertyService } from '../../services/propertyService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Users, DollarSign, Clock, AlertTriangle, CheckCircle, Mail, Phone } from 'lucide-react';

const OwnerTenantsPage = () => {
  const [payments, setPayments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, pendingRent: 0, overdueRent: 0 });
  const [loading, setLoading] = useState(true);

  const fetchTenantData = async () => {
    setLoading(true);
    try {
      const [payRes, propRes] = await Promise.all([
        paymentService.getOwnerPayments(),
        propertyService.getMyProperties(),
      ]);
      setPayments(payRes.data || []);
      setSummary(payRes.summary || { totalIncome: 0, pendingRent: 0, overdueRent: 0 });
      setProperties(propRes.data || []);
    } catch (err) {
      console.error('Failed to load tenants and payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, []);

  if (loading) return <Loader message="Loading tenant directory and rent status..." />;

  // Filter occupied properties
  const rentedProperties = properties.filter((p) => p.status === 'rented' && p.currentTenantId);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Tenants & Rent Invoicing</h1>
          <p className="page-header-subtitle">
            Track active tenant leases, rent payment compliance, and collected earnings.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Rent Collected"
          value={`$${summary.totalIncome?.toLocaleString()}`}
          subtitle="All-time verified payments"
          icon={DollarSign}
          color="success"
        />

        <StatCard
          title="Pending Invoices"
          value={`$${summary.pendingRent?.toLocaleString()}`}
          subtitle="Scheduled this billing cycle"
          icon={Clock}
          color="warning"
        />

        <StatCard
          title="Overdue Balance"
          value={`$${summary.overdueRent?.toLocaleString()}`}
          subtitle="Past due dates"
          icon={AlertTriangle}
          color={summary.overdueRent > 0 ? 'danger' : 'info'}
        />

        <StatCard
          title="Active Tenants"
          value={rentedProperties.length}
          subtitle="Occupied residences"
          icon={Users}
          color="primary"
        />
      </div>

      {/* Active Tenants Directory */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem' }}>
          Active Resident Directory
        </h3>

        {rentedProperties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
            No occupied properties at present.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {rentedProperties.map((p) => (
              <div
                key={p._id}
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>
                      {p.currentTenantId?.name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Leasing: {p.title}
                    </span>
                  </div>
                  <Badge status="rented" text="Active Resident" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={14} /> <span>{p.currentTenantId?.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={14} /> <span>{p.currentTenantId?.phone}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Monthly Rent:</span>
                  <span style={{ fontWeight: '800', color: 'var(--primary)' }}>${p.rent?.toLocaleString()} / mo</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rent Payment Ledger */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem' }}>
          Rent Payment Transaction Ledger
        </h3>

        {payments.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No Payment History"
            description="No rent invoices have been paid or generated yet."
          />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                  <th>Method</th>
                  <th>Transaction ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ fontWeight: '700' }}>{p.tenantId?.name || 'Tenant'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.tenantId?.email}</div>
                    </td>
                    <td style={{ fontWeight: '600' }}>{p.propertyId?.title}</td>
                    <td style={{ fontWeight: '800', color: p.status === 'paid' ? 'var(--success)' : 'var(--text-main)' }}>
                      ${p.amount?.toLocaleString()}
                    </td>
                    <td>{new Date(p.dueDate).toLocaleDateString()}</td>
                    <td>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '–'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{p.paymentMethod || 'Credit Card'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {p.transactionId || '–'}
                    </td>
                    <td>
                      <Badge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerTenantsPage;
