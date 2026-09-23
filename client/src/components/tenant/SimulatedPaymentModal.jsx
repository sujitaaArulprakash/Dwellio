import React, { useState } from 'react';
import Modal from '../common/Modal';
import { paymentService } from '../../services/paymentService';
import { CreditCard, CheckCircle, ShieldAlert, Sparkles, Receipt } from 'lucide-react';

const SimulatedPaymentModal = ({ isOpen, onClose, payment, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await paymentService.simulatePayRent(payment?._id, paymentMethod);
      setReceipt(res.data);
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      setError(err.message || 'Payment simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReceipt(null);
    setError(null);
    onClose();
  };

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(payment?.amount || 0);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Rent Payment Portal" maxWidth="520px">
      {receipt ? (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <CheckCircle size={38} />
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.35rem' }}>
            Payment Successful!
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Your rent payment has been verified and recorded.
          </p>

          <div
            style={{
              background: 'var(--bg-alt)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              fontSize: '0.9rem',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Transaction ID:</span>
              <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>{receipt.transactionId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
              <span style={{ fontWeight: '800', color: 'var(--success)' }}>
                ${receipt.amount?.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Method:</span>
              <span>{receipt.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Date:</span>
              <span>{new Date(receipt.paymentDate).toLocaleDateString()}</span>
            </div>
          </div>

          <button onClick={handleClose} className="btn btn-primary btn-block">
            Done & Return to Payments
          </button>
        </div>
      ) : (
        <form onSubmit={handlePay}>
          {/* Demo Sandbox Alert */}
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem', color: '#1e40af' }}>
              <strong>Simulated Sandbox Flow:</strong> This is a secure mock payment simulator. No actual credit card charge will occur.
            </div>
          </div>

          {/* Amount Due Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Rent Due
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{formattedAmount}</div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                Property: {payment?.propertyId?.title || 'Current Rental'}
              </div>
            </div>
            <Receipt size={36} style={{ color: '#94a3b8' }} />
          </div>

          {error && (
            <div
              style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
              }}
            >
              {error}
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="form-group">
            <label className="form-label">Select Payment Method</label>
            <select
              className="form-control"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Credit Card">Credit Card (Mock Visa / Mastercard)</option>
              <option value="Debit Card">Debit Card</option>
              <option value="UPI / Bank Transfer">UPI / Instant Bank Transfer</option>
              <option value="Net Banking">Net Banking Portal</option>
            </select>
          </div>

          {/* Dummy Card Input Display */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.85rem' }}>
              <CreditCard size={18} style={{ color: 'var(--primary)' }} />
              <span>Simulated Card Details</span>
            </div>
            <input
              type="text"
              readOnly
              value="•••• •••• •••• 4242  (Demo Card Active)"
              className="form-control"
              style={{ marginBottom: '0.75rem', background: '#fff', color: 'var(--text-muted)', fontSize: '0.85rem' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <input
                type="text"
                readOnly
                value="Exp: 12/28"
                className="form-control"
                style={{ background: '#fff', color: 'var(--text-muted)', fontSize: '0.85rem' }}
              />
              <input
                type="text"
                readOnly
                value="CVV: 888"
                className="form-control"
                style={{ background: '#fff', color: 'var(--text-muted)', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={handleClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
              {loading ? 'Processing Demo Payment...' : `Confirm & Pay ${formattedAmount}`}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default SimulatedPaymentModal;
