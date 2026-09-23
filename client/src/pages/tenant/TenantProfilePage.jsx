import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Phone, Lock, Save, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        profileImage: formData.profileImage,
      };
      if (formData.password) payload.password = formData.password;

      await updateProfile(payload);
      setSuccessMsg('Profile information updated successfully!');
      setFormData({ ...formData, password: '' });
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">My Profile</h1>
          <p className="page-header-subtitle">
            Update your personal contact details and security preferences.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {successMsg && (
          <div
            style={{
              background: 'var(--success-bg)',
              color: 'var(--success-text)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
            }}
          >
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {error && (
          <div
            style={{
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Avatar preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="Profile preview"
                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
              />
            ) : (
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1.75rem',
                }}
              >
                {formData.name.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{formData.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                Account Role: <strong style={{ color: 'var(--primary)' }}>{user?.role}</strong>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.5rem', background: 'var(--bg-main)', color: 'var(--text-muted)' }}
                value={user?.email || ''}
                disabled
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="tel"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Profile Image URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={formData.profileImage}
              onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Paste an image link for your avatar.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Change Password (leave empty to keep current)</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="New password (min 6 chars)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: '1.5rem', fontWeight: '700' }}
          >
            <Save size={18} /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
