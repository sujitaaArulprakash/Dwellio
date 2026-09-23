import React, { useState } from 'react';
import Modal from '../common/Modal';
import StarRating from '../common/StarRating';
import { reviewService } from '../../services/reviewService';
import { Star } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, propertyId, propertyTitle, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await reviewService.createReview({ propertyId, rating, comment });
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(5);
    setComment('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Submit Property Review" maxWidth="500px">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>
            {propertyTitle}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Share your authentic rental experience with future tenants.
          </p>
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

        <div className="form-group" style={{ textAlign: 'center', margin: '1.5rem 0' }}>
          <label className="form-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
            Overall Rating: {rating} / 5
          </label>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <StarRating rating={rating} size={32} interactive onRatingChange={setRating} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Your Review & Feedback</label>
          <textarea
            className="form-control"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the condition of the home, landlord communication, and neighborhood amenities?"
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={handleClose} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
            <Star size={16} /> {loading ? 'Submitting...' : 'Post Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;
