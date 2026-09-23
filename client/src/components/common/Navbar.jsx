import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Building2, Menu, X, User, LogOut, LayoutDashboard, Home, Compass } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'owner') return '/owner/dashboard';
    return '/tenant/dashboard';
  };

  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)',
            color: '#fff',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)',
          }}>
            <Building2 size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Dwellio
            </span>
            <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '-4px' }}>
              Nestora Rentals
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-links">
          <Link
            to="/"
            style={{
              fontWeight: '600',
              fontSize: '0.95rem',
              color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Home size={17} /> Home
          </Link>
          <Link
            to="/properties"
            style={{
              fontWeight: '600',
              fontSize: '0.95rem',
              color: location.pathname.startsWith('/properties') ? 'var(--primary)' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Compass size={17} /> Properties
          </Link>
          <Link
            to="/about"
            style={{
              fontWeight: '600',
              fontSize: '0.95rem',
              color: location.pathname === '/about' ? 'var(--primary)' : 'var(--text-main)',
            }}
          >
            About
          </Link>
        </div>

        {/* Right side auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }} className="desktop-auth">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Link to={getDashboardPath()} className="btn btn-primary btn-sm">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-alt)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)' }}>
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.75rem' }}>
                    {user.name.charAt(0)}
                  </div>
                )}
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>{user.name.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-main)' }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: 'var(--header-height)',
          left: 0,
          right: 0,
          background: '#ffffff',
          borderBottom: '1px solid var(--border)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: '600', padding: '0.5rem 0' }}>Home</Link>
          <Link to="/properties" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: '600', padding: '0.5rem 0' }}>Properties</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: '600', padding: '0.5rem 0' }}>About</Link>
          <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }}></div>
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-block">
                Go to Dashboard
              </Link>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-secondary btn-block">
                Log Out ({user?.name})
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-block">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-block">
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-links, .desktop-auth { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
