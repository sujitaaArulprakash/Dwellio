import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { useAuth } from '../../hooks/useAuth';
import ImageGallery from '../../components/property/ImageGallery';
import Badge from '../../components/common/Badge';
import StarRating from '../../components/common/StarRating';
import Loader from '../../components/common/Loader';
import RentalRequestModal from '../../components/tenant/RentalRequestModal';
import ReviewModal from '../../components/tenant/ReviewModal';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle,
  Wifi,
  Car,
  Shield,
  Droplet,
  Zap,
  Wind,
  Tv,
  Camera,
  Layers,
  Dumbbell,
  Send,
  Star,
  MessageSquare,
} from 'lucide-react';

const AMENITY_ICONS = {
  'Wi-Fi': Wifi,
  Parking: Car,
  Security: Shield,
  'Water Supply': Droplet,
  'Electricity Backup': Zap,
  'Air Conditioning': Wind,
  Furnished: Tv,
  CCTV: Camera,
  Balcony: Layers,
  Gym: Dumbbell,
};

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const fetchProperty = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await propertyService.getPropertyById(id);
      setProperty(res.data);
    } catch (err) {
      setError(err.message || 'Property not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  if (loading) return <Loader message="Loading property details..." minHeight="80vh" />;

  if (error || !property) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>
          Property Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {error || "The property you're looking for doesn't exist or has been taken down."}
        </p>
        <Link to="/properties" className="btn btn-primary">
          Back to All Properties
        </Link>
      </div>
    );
  }

  const isAvailable = property.status === 'approved' || property.status === 'available';
  const isTenant = isAuthenticated && user?.role === 'tenant';

  // Check if current user is the owner
  const isOwnerOfThis =
    isAuthenticated &&
    property.ownerId &&
    (user?._id === property.ownerId._id || user?.id === property.ownerId._id);

  // Check if current user is currently renting this property
  const isCurrentRenter =
    isAuthenticated &&
    property.currentTenantId &&
    (user?._id === property.currentTenantId._id || user?.id === property.currentTenantId._id);

  const formattedRent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.rent);

  const formattedDeposit = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.securityDeposit || 0);

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Breadcrumb / Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link>
          <span>/</span>
          <Link to="/properties" style={{ color: 'var(--primary)' }}>Properties</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{property.title}</span>
        </div>

        {/* Gallery */}
        <ImageGallery images={property.images} />

        {/* Main Content Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column: Details, Specs, Amenities, Description, Reviews */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                }}
              >
                {property.propertyType}
              </span>
              <Badge status={property.status} />
              {property.avgRating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '700' }}>
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  <span>{property.avgRating}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.8rem' }}>
                    ({property.reviewCount || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', lineHeight: '1.25', marginBottom: '0.75rem' }}>
              {property.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
              <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>{property.address}, {property.city}, {property.state}</span>
            </div>

            {/* Quick Specs Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '1rem',
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginBottom: '2.5rem',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <Bed size={16} /> Bedrooms
                </div>
                <div style={{ fontWeight: '800', fontSize: '1.25rem' }}>{property.bedrooms}</div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <Bath size={16} /> Bathrooms
                </div>
                <div style={{ fontWeight: '800', fontSize: '1.25rem' }}>{property.bathrooms}</div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <Maximize2 size={16} /> Area
                </div>
                <div style={{ fontWeight: '800', fontSize: '1.25rem' }}>{property.area} sq ft</div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <Calendar size={16} /> Listed
                </div>
                <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>
                  {new Date(property.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                About this Property
              </h3>
              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>
                Amenities & Facilities
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '1rem',
                }}
              >
                {(property.amenities || []).map((amenity) => {
                  const Icon = AMENITY_ICONS[amenity] || CheckCircle;
                  return (
                    <div
                      key={amenity}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1rem',
                        background: '#ffffff',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}
                    >
                      <div
                        style={{
                          color: 'var(--primary)',
                          background: 'var(--primary-light)',
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Section */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '700' }}>
                    Tenant Reviews ({property.reviews?.length || 0})
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <StarRating rating={Math.round(property.avgRating || 0)} size={18} />
                    <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                      {property.avgRating ? `${property.avgRating} out of 5 stars` : 'No reviews yet'}
                    </span>
                  </div>
                </div>

                {isCurrentRenter && (
                  <button onClick={() => setReviewModalOpen(true)} className="btn btn-primary btn-sm">
                    <Star size={16} /> Write a Review
                  </button>
                )}
              </div>

              {property.reviews && property.reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {property.reviews.map((rev) => (
                    <div
                      key={rev._id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'var(--primary-light)',
                              color: 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                            }}
                          >
                            {rev.tenantId?.name?.charAt(0) || 'T'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.925rem' }}>
                              {rev.tenantId?.name || 'Verified Tenant'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        <StarRating rating={rev.rating} size={14} />
                      </div>
                      <p style={{ color: '#334155', fontSize: '0.925rem', lineHeight: '1.6' }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', background: '#ffffff', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>
                  No reviews submitted for this property yet.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pricing Card, Landlord Info, Rental Request CTA */}
          <div style={{ maxWidth: '400px', width: '100%', position: 'sticky', top: '90px' }}>
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Monthly Rent
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {formattedRent} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>/ month</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Security Deposit</div>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{formattedDeposit}</div>
                </div>
              </div>

              {/* Status summary */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', background: 'var(--bg-main)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Occupancy Status:</span>
                <Badge status={property.status} />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {isTenant ? (
                  <button
                    onClick={() => setRequestModalOpen(true)}
                    disabled={!isAvailable}
                    className="btn btn-primary btn-block btn-lg"
                    style={{ fontWeight: '700' }}
                  >
                    <Send size={18} /> {isAvailable ? 'Request to Rent' : 'Property Unavailable'}
                  </button>
                ) : !isAuthenticated ? (
                  <button
                    onClick={() => navigate('/login', { state: { from: `/properties/${id}` } })}
                    className="btn btn-primary btn-block btn-lg"
                  >
                    Log In to Apply
                  </button>
                ) : isOwnerOfThis ? (
                  <Link to={`/owner/properties`} className="btn btn-secondary btn-block">
                    Manage My Property
                  </Link>
                ) : (
                  <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0.5rem' }}>
                    You are logged in as {user?.role}. Only tenants can submit rental requests.
                  </div>
                )}
              </div>

              {/* Landlord Card */}
              {property.ownerId && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.85rem' }}>
                    Property Managed By
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                    {property.ownerId.profileImage ? (
                      <img
                        src={property.ownerId.profileImage}
                        alt={property.ownerId.name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '1.1rem',
                        }}
                      >
                        {property.ownerId.name?.charAt(0) || 'O'}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1rem' }}>{property.ownerId.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '600' }}>
                        <ShieldCheck size={14} /> Verified Property Owner
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={15} /> <span>{property.ownerId.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={15} /> <span>{property.ownerId.email}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RentalRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        property={property}
        onSuccess={fetchProperty}
      />

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        propertyId={property._id}
        propertyTitle={property.title}
        onSuccess={fetchProperty}
      />
    </div>
  );
};

export default PropertyDetailPage;
