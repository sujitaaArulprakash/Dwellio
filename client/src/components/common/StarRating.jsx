import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, size = 16, interactive = false, onRatingChange }) => {
  return (
    <div className="star-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isFilled = starValue <= rating;
        return (
          <Star
            key={starValue}
            size={size}
            className={`star ${isFilled ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              fill: isFilled ? '#f59e0b' : 'none',
              color: isFilled ? '#f59e0b' : '#cbd5e1',
            }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
