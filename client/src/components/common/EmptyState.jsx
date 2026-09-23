import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items to display at this time.',
  actionText,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={32} />
      </div>
      <div>
        <h4 className="empty-state-title">{title}</h4>
        <p className="empty-state-text">{description}</p>
      </div>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
