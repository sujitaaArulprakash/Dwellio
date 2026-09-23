import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import StarRating from '../../components/common/StarRating';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Star, MessageSquare } from 'lucide-react';

const TenantReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewService.getMyReviews();
      setReviews(res.data || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) return <Loader message="Loading your submitted reviews..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">My Property Reviews</h1>
          <p className="page-header-subtitle">
            Feedback and ratings you've contributed to the Nestora community.
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No Reviews Submitted"
          description="Once you have an active or completed tenancy, you can leave helpful reviews on your rental property page."
          actionText="View Active Rental"
          onAction={() => window.location.assign('/tenant/rental')}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {reviews.map((rev) => (
            <div key={rev._id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <StarRating rating={rev.rating} size={18} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {rev.propertyId?.title || 'Rental Residence'}
              </h3>
              <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '1rem' }}>
                "{rev.comment}"
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                {rev.propertyId?.address}, {rev.propertyId?.city}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantReviewsPage;
