import React from 'react';

const Badge = ({ status, text }) => {
  const normalized = (status || '').toLowerCase().replace(/\s+/g, '-');
  const displayText = text || status;

  return (
    <span className={`badge badge-${normalized}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          display: 'inline-block',
        }}
      />
      {displayText}
    </span>
  );
};

export default Badge;
