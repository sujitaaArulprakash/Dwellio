import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div
      style={{
        padding: '6rem 1.5rem',
        textAlign: 'center',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: '6rem',
          fontWeight: '900',
          color: 'var(--primary)',
          lineHeight: '1',
          marginBottom: '1rem',
        }}
      >
        404
      </div>
      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', maxWidth: '460px', marginBottom: '2rem' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={18} /> Return Home
        </Link>
        <Link to="/properties" className="btn btn-secondary">
          Browse Rentals
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
