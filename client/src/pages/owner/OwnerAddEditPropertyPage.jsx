import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import Loader from '../../components/common/Loader';
import { Building2, Save, ArrowLeft, Upload, CheckSquare, Square } from 'lucide-react';

const AMENITY_OPTIONS = [
  'Wi-Fi',
  'Parking',
  'Security',
  'Water Supply',
  'Electricity Backup',
  'Air Conditioning',
  'Furnished',
  'CCTV',
  'Balcony',
  'Gym',
];

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Studio', 'Condo', 'Townhouse'];

const OwnerAddEditPropertyPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    address: '',
    city: '',
    state: '',
    rent: '',
    securityDeposit: '',
    bedrooms: '2',
    bathrooms: '1',
    area: '',
    amenities: ['Wi-Fi', 'Water Supply', 'Air Conditioning'],
    imagesText: '',
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchProperty = async () => {
        try {
          const res = await propertyService.getPropertyById(id);
          const p = res.data;
          setFormData({
            title: p.title || '',
            description: p.description || '',
            propertyType: p.propertyType || 'Apartment',
            address: p.address || '',
            city: p.city || '',
            state: p.state || '',
            rent: p.rent || '',
            securityDeposit: p.securityDeposit || '',
            bedrooms: String(p.bedrooms || '1'),
            bathrooms: String(p.bathrooms || '1'),
            area: p.area || '',
            amenities: p.amenities || [],
            imagesText: (p.images || []).join('\n'),
          });
        } catch (err) {
          setError(err.message || 'Failed to load property');
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAmenity = (amenity) => {
    const current = formData.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    setFormData({ ...formData, amenities: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Split images text into array of URLs
      const imageUrls = formData.imagesText
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      // We support FormData if files are selected, or JSON payload if URLs are used
      if (files.length > 0) {
        const payload = new FormData();
        payload.append('title', formData.title);
        payload.append('description', formData.description);
        payload.append('propertyType', formData.propertyType);
        payload.append('address', formData.address);
        payload.append('city', formData.city);
        payload.append('state', formData.state);
        payload.append('rent', formData.rent);
        payload.append('securityDeposit', formData.securityDeposit);
        payload.append('bedrooms', formData.bedrooms);
        payload.append('bathrooms', formData.bathrooms);
        payload.append('area', formData.area);
        payload.append('amenities', JSON.stringify(formData.amenities));

        // Add any text URLs
        imageUrls.forEach((url) => payload.append('images', url));

        // Append file uploads
        for (let i = 0; i < files.length; i++) {
          payload.append('images', files[i]);
        }

        if (isEditing) {
          await propertyService.updateProperty(id, payload);
        } else {
          await propertyService.createProperty(payload);
        }
      } else {
        const payload = {
          ...formData,
          images: imageUrls.length > 0 ? imageUrls : [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200'
          ],
        };

        if (isEditing) {
          await propertyService.updateProperty(id, payload);
        } else {
          await propertyService.createProperty(payload);
        }
      }

      alert(isEditing ? 'Property updated successfully!' : 'Property submitted for admin review!');
      navigate('/owner/properties');
    } catch (err) {
      setError(err.message || 'Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading property details..." />;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <div>
          <Link to="/owner/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to My Properties
          </Link>
          <h1 className="page-header-title">
            {isEditing ? 'Edit Property Listing' : 'List a New Property'}
          </h1>
          <p className="page-header-subtitle">
            {isEditing
              ? 'Update your property specifications, photos, and rental rates.'
              : 'New properties are reviewed by platform administrators before appearing in public searches.'}
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {error && (
          <div
            style={{
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="form-group">
            <label className="form-label">Property Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Modern Sunset Loft in Downtown"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select
                name="propertyType"
                className="form-control"
                value={formData.propertyType}
                onChange={handleChange}
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Living Area (sq ft)</label>
              <input
                type="number"
                name="area"
                className="form-control"
                placeholder="e.g. 1200"
                value={formData.area}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="e.g. 742 Montgomery St, Apt 28B"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                placeholder="e.g. San Francisco"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">State / Province</label>
              <input
                type="text"
                name="state"
                className="form-control"
                placeholder="e.g. CA"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Pricing & Rooms */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Monthly Rent ($)</label>
              <input
                type="number"
                name="rent"
                className="form-control"
                placeholder="e.g. 2500"
                value={formData.rent}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Security Deposit ($)</label>
              <input
                type="number"
                name="securityDeposit"
                className="form-control"
                placeholder="e.g. 3000"
                value={formData.securityDeposit}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                className="form-control"
                min="0"
                value={formData.bedrooms}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                className="form-control"
                min="0"
                value={formData.bathrooms}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Property Description</label>
            <textarea
              name="description"
              className="form-control"
              rows={4}
              placeholder="Describe the interior finishes, appliances, building amenities, neighborhood highlights..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Amenities Checklist */}
          <div className="form-group" style={{ margin: '1.75rem 0' }}>
            <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
              Select Amenities Included
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {AMENITY_OPTIONS.map((amenity) => {
                const isChecked = (formData.amenities || []).includes(amenity);
                return (
                  <div
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border)',
                      background: isChecked ? 'var(--primary-light)' : '#ffffff',
                      color: isChecked ? 'var(--primary)' : 'var(--text-main)',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'var(--transition)',
                    }}
                  >
                    {isChecked ? <CheckSquare size={18} /> : <Square size={18} style={{ color: 'var(--text-subtle)' }} />}
                    <span>{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image Upload / URLs */}
          <div className="form-group">
            <label className="form-label">Upload Image Files (Multer Upload)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="form-control"
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Select one or more photos from your device (PNG, JPG, WEBP).
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Or Provide Image URLs (One per line)</label>
            <textarea
              name="imagesText"
              className="form-control"
              rows={3}
              placeholder="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&#10;https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200"
              value={formData.imagesText}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/owner/properties" className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-lg"
              style={{ flex: 2, fontWeight: '700' }}
            >
              <Save size={18} /> {saving ? 'Saving Property...' : isEditing ? 'Save Changes' : 'Submit Property for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerAddEditPropertyPage;
