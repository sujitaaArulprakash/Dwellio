import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Shield, Users, CreditCard, Wrench, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: '700',
              marginBottom: '1rem',
            }}
          >
            About Dwellio & Nestora
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Next-Generation Rental Property Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.6' }}>
            Bridging the gap between property owners, tenants, and community administrators with modern web technology, automated lease workflows, and transparent communication.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>
            Our Mission
          </h2>
          <p style={{ color: '#334155', lineHeight: '1.8', marginBottom: '1.25rem' }}>
            Rental property management has traditionally been fraught with friction—opaque listings, slow manual applications, paper checks, and untracked repair requests. Dwellio (powered by Nestora) eliminates these inefficiencies through a modern, cloud-first full-stack system.
          </p>
          <p style={{ color: '#334155', lineHeight: '1.8' }}>
            Built using React.js on the frontend, Node.js + Express.js on the backend, and MongoDB with Mongoose, the platform adheres strictly to production-grade architectural patterns with secure JWT authentication, role-based authorization, and real-time operational analytics.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="card">
            <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
              <Users size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>For Tenants</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Browse verified properties, submit digital rental applications, track application status, simulate rent payments with mock receipts, and file maintenance tickets with photo attachments.
            </p>
          </div>

          <div className="card">
            <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
              <Building2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>For Owners</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Publish new properties, manage listings, review tenant applications with single-click lease approval, monitor occupancy and revenue, and resolve maintenance tickets.
            </p>
          </div>

          <div className="card">
            <div style={{ color: '#8b5cf6', marginBottom: '1rem' }}>
              <Shield size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>For Admins</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Global platform oversight, property moderation queue (approve/reject/delete), user directory management (active/disabled), and visual Recharts operational metrics.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/properties" className="btn btn-primary btn-lg">
            Browse Current Listings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
