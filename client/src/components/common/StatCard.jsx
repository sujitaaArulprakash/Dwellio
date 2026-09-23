import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'primary', subtitle }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={26} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatCard;
