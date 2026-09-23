import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rentalService } from '../../services/rentalService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import MaintenanceRequestModal from '../../components/tenant/MaintenanceRequestModal';
import ReviewModal from '../../components/tenant/ReviewModal';
import {
  Home,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  Wrench,
  Star,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';

const TenantRentalPage = () => {
  const [activeData, setActiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maintModalOpen, setMaintModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const fetchActiveRental = async () => {
    setLoading(true);
    try {
      const res = await rentalService.getActiveRental();
      setActiveData(res.data);
    } catch (err) {
      console.error('Error fetching active rental:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveRental();
  }, []);

  if (loading) return <Loader message="Retrieving your lease agreement details..." />;

  const property = activeData?.property;
  const application = activeData?.application;

  if (!property) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-header-title">My Active Rental</h1>
            <p className="page-header-subtitle">
              Detailed view of your current tenancy, lease terms, and landlord contact info.
            </p>
          </div>
        </div>

        <EmptyState
          icon={Home}
          title="No Active Lease Agreement"
          description="You are currently not renting any property on Nestora. Browse available listings and submit an application to get started."
          actionText="Browse Properties"
          onAction={() => window.location.assign('/properties')}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">My Active Rental</h1>
          <p className="page-header-subtitle">
            Lease and residency details for your current home.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setMaintModalOpen(true)} className="btn btn-secondary btn-sm">
            <Wrench size={16} /> Raise Complaint
          </button>
          <button onClick={() => setReviewModalOpen(true)} className="btn btn-primary btn-sm">
            <Star size={16} /> Review Property
          </button>
        </div>
      </div>

      {/* Property Overview Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'}
            alt={property.title}
            style={{ width: '100%', height: '240px', borderRadius: 'var(--radius-lg)', objectFit: 'cover' }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
                {property.propertyType}
              </span>
              <Badge status="rented" text="Occupied / Active Lease" />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              {property.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              <MapPin size={17} style={{ color: 'var(--primary)' }} />
              <span>{property.address}, {property.city}, {property.state}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bedrooms</div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{property.bedrooms} Beds</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bathrooms</div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{property.bathrooms} Baths</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Area</div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{property.area} sq ft</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Landlord Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Rent & Financials */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={20} style={{ color: 'var(--primary)' }} /> Financial Summary
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Agreed Monthly Rent:</span>
              <span style={{ fontWeight: '800', color: 'var(--primary)' }}>${property.rent?.toLocaleString()} / mo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Security Deposit Held:</span>
              <span style={{ fontWeight: '700' }}>${property.securityDeposit?.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Lease Approval Date:</span>
              <span>{application ? new Date(application.requestedAt).toLocaleDateString() : 'Active'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Schedule:</span>
              <span style={{ fontWeight: '600', color: 'var(--accent)' }}>Monthly Automatic Invoicing</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/tenant/payments" className="btn btn-secondary btn-block btn-sm">
              View All Rent Invoices & History
            </Link>
          </div>
        </div>

        {/* Owner Information */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} style={{ color: 'var(--primary)' }} /> Property Landlord
          </h3>
          {property.ownerId ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                {property.ownerId.profileImage ? (
                  <img
                    src={property.ownerId.profileImage}
                    alt={property.ownerId.name}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.2rem' }}>
                    {property.ownerId.name?.charAt(0) || 'O'}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{property.ownerId.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '600' }}>
                    <ShieldCheck size={14} /> Registered Property Owner
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)', background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Phone size={16} style={{ color: 'var(--primary)' }} />
                  <span>{property.ownerId.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Mail size={16} style={{ color: 'var(--primary)' }} />
                  <span>{property.ownerId.email}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>Owner contact not attached.</div>
          )}
        </div>
      </div>

      {/* Modals */}
      <MaintenanceRequestModal
        isOpen={maintModalOpen}
        onClose={() => setMaintModalOpen(false)}
        propertyId={property._id}
        onSuccess={() => alert('Maintenance ticket submitted to owner!')}
      />

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        propertyId={property._id}
        propertyTitle={property.title}
        onSuccess={() => alert('Review submitted successfully!')}
      />
    </div>
  );
};

export default TenantRentalPage;
