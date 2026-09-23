import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Building2,
  LayoutDashboard,
  Compass,
  FileText,
  Home,
  CreditCard,
  Wrench,
  Star,
  User,
  LogOut,
  Users,
  ShieldCheck,
  ClipboardList,
  BarChart3,
  PlusCircle,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (user?.role === 'tenant') {
      return [
        { label: 'Dashboard', path: '/tenant/dashboard', icon: LayoutDashboard },
        { label: 'Browse Properties', path: '/properties', icon: Compass },
        { label: 'My Applications', path: '/tenant/applications', icon: FileText },
        { label: 'My Rental', path: '/tenant/rental', icon: Home },
        { label: 'Payments', path: '/tenant/payments', icon: CreditCard },
        { label: 'Maintenance', path: '/tenant/maintenance', icon: Wrench },
        { label: 'Reviews', path: '/tenant/reviews', icon: Star },
        { label: 'Profile', path: '/tenant/profile', icon: User },
      ];
    }

    if (user?.role === 'owner') {
      return [
        { label: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
        { label: 'My Properties', path: '/owner/properties', icon: Home },
        { label: 'Add Property', path: '/owner/properties/new', icon: PlusCircle },
        { label: 'Rental Requests', path: '/owner/requests', icon: FileText },
        { label: 'Tenants & Rent', path: '/owner/tenants', icon: Users },
        { label: 'Maintenance', path: '/owner/maintenance', icon: Wrench },
        { label: 'Profile', path: '/owner/profile', icon: User },
      ];
    }

    if (user?.role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Users', path: '/admin/users', icon: Users },
        { label: 'Properties', path: '/admin/properties', icon: Home },
        { label: 'Rental Requests', path: '/admin/requests', icon: FileText },
        { label: 'Maintenance', path: '/admin/maintenance', icon: Wrench },
        { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
        { label: 'Profile', path: '/admin/profile', icon: User },
      ];
    }

    return [];
  };

  const links = getNavLinks();

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-logo">
          <div style={{
            background: 'var(--primary)',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Building2 size={18} />
          </div>
          <span>Dwellio</span>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div style={{ fontSize: '0.725rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-subtle)', padding: '0 0.5rem 0.5rem', letterSpacing: '0.05em' }}>
          {user?.role} portal
        </div>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="sidebar-footer">
        <div className="user-badge">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="user-avatar" />
          ) : (
            <div className="user-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
          )}
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {user?.role}
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="btn btn-secondary btn-sm btn-block" style={{ color: 'var(--danger)' }}>
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
