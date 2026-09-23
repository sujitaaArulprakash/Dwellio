import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import SimulatedPaymentModal from '../../components/tenant/SimulatedPaymentModal';
import { CreditCard, Receipt, Calendar, CheckCircle2, AlertCircle, Download, Sparkles } from 'lucide-react';

const TenantPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getMyPayments();
      setPayments(res.data || []);
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const openPayModal = (payment) => {
    setSelectedPayment(payment);
    setPaymentModalOpen(true);
  };

  const nextPending = payments.find((p) => p.status === 'pending' || p.status === 'overdue');
  const paidPayments = payments.filter((p) => p.status === 'paid');

  if (loading) return <Loader message="Retrieving your rent invoices and payment history..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Rent & Payments</h1>
          <p className="page-header-subtitle">
            Pay monthly rent, view due dates, and track your verified digital receipts.
          </p>
        </div>
        {nextPending && (
          <button onClick={() => openPayModal(nextPending)} className="btn btn-primary btn-sm">
            <CreditCard size={16} /> Pay Due Rent (${nextPending.amount?.toLocaleString()})
          </button>
        )}
      </div>

      {/* Due Rent Banner */}
      {nextPending ? (
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                }}
              >
                Payment Due
              </span>
              <span style={{ fontSize: '0.85rem', color: '#93c5fd' }}>
                Due on {new Date(nextPending.dueDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.25rem' }}>
              ${nextPending.amount?.toLocaleString()}
            </h2>
            <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              For: {nextPending.propertyId?.title || 'Rented Property'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => openPayModal(nextPending)}
              className="btn btn-lg"
              style={{ background: 'var(--success)', color: '#ffffff', fontWeight: '700' }}
            >
              <CreditCard size={18} /> Pay Now (Demo Simulator)
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.75rem' }}>
              <Sparkles size={13} /> Sandbox simulated payment flow
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: 'var(--success-bg)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <CheckCircle2 size={32} style={{ color: 'var(--success)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: '700', color: 'var(--success-text)', fontSize: '1.1rem' }}>
              All rent payments are up to date!
            </div>
            <div style={{ color: '#047857', fontSize: '0.875rem' }}>
              You have no pending or overdue invoices for your current lease.
            </div>
          </div>
        </div>
      )}

      {/* Payment History Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Receipt size={20} style={{ color: 'var(--primary)' }} /> Payment History & Receipts
        </h3>

        {payments.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No Payment Records"
            description="You don't have any past or pending payments on file."
          />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Property</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Payment Date</th>
                  <th>Method</th>
                  <th>Transaction ID</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      #{p._id.slice(-6).toUpperCase()}
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      {p.propertyId?.title || 'Rental Unit'}
                    </td>
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
                    <td>
                      {p.status !== 'paid' ? (
                        <button
                          onClick={() => openPayModal(p)}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          Pay
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Receipt #${p.transactionId} verified on ${new Date(p.paymentDate).toLocaleDateString()}`)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          title="View Digital Receipt"
                        >
                          <Receipt size={14} /> Receipt
                        </button>
                      )}
                    </td>
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
        onSuccess={() => fetchPayments()}
      />
    </div>
  );
};

export default TenantPaymentsPage;
