import React, { useState } from 'react';
import Modal from '../common/Modal';
import { rentalService } from '../../services/rentalService';
import { Send, CheckCircle2 } from 'lucide-react';

const RentalRequestModal = ({ isOpen, onClose, property, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await rentalService.createRequest(property?._id, message);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to submit rental request');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Request to Rent" maxWidth="500px">
      {success ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <CheckCircle2 size={36} />
          </div>
          <h4 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            Application Submitted!
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            The property owner has received your inquiry. You can track this application in your Tenant Applications dashboard.
          </p>
          <button onClick={handleClose} className="btn btn-primary btn-block">
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)' }}>
              {property?.title}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {property?.address}, {property?.city} • ${property?.rent?.toLocaleString()} / month
            </div>
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

          <div className="form-group">
            <label className="form-label">Message to Property Owner</label>
            <textarea
              className="form-control"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself, desired move-in date, lease length, and employment details..."
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={handleClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
              <Send size={16} /> {loading ? 'Sending...' : 'Submit Application'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default RentalRequestModal;
