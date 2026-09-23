import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ message = 'Loading...', minHeight = '300px' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        gap: '0.85rem',
        color: 'var(--text-muted)',
      }}
    >
      <Loader2
        size={36}
        style={{
          color: 'var(--primary)',
          animation: 'spin 1s linear infinite',
        }}
      />
      <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{message}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
