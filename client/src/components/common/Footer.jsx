import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{
                background: 'var(--primary)',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Building2 size={20} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff' }}>Dwellio</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Nestora Property Platform – Connecting quality tenants with verified property owners. Experience seamless online rental applications, digital leases, simulated rent payments, and transparent maintenance tracking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: '#cbd5e1', transition: 'var(--transition)' }}>Home Overview</Link></li>
              <li><Link to="/properties" style={{ color: '#cbd5e1' }}>Browse Rentals</Link></li>
              <li><Link to="/login" style={{ color: '#cbd5e1' }}>Tenant Portal</Link></li>
              <li><Link to="/login" style={{ color: '#cbd5e1' }}>Owner Portal</Link></li>
              <li><Link to="/about" style={{ color: '#cbd5e1' }}>About Nestora Platform</Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem' }}>Popular Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/properties?type=Apartment" style={{ color: '#cbd5e1' }}>Luxury Apartments</Link></li>
              <li><Link to="/properties?type=House" style={{ color: '#cbd5e1' }}>Single Family Homes</Link></li>
              <li><Link to="/properties?type=Studio" style={{ color: '#cbd5e1' }}>Urban Studios</Link></li>
              <li><Link to="/properties?type=Villa" style={{ color: '#cbd5e1' }}>Coastal Villas</Link></li>
              <li><Link to="/properties?type=Townhouse" style={{ color: '#cbd5e1' }}>Modern Townhomes</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem' }}>Contact & Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <MapPin size={18} style={{ color: 'var(--primary)' }} />
                <span>500 Howard St, San Francisco, CA</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={18} style={{ color: 'var(--primary)' }} />
                <span>+1 (800) 555-DWELL</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={18} style={{ color: 'var(--primary)' }} />
                <span>support@dwellio.com</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
        }}>
          <div>
            © {new Date().getFullYear()} Dwellio Rental Management System (Nestora). All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with React, Express & MongoDB
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
