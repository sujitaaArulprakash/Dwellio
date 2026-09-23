import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../../components/property/PropertyCard';
import Loader from '../../components/common/Loader';
import {
  Search,
  Building2,
  ShieldCheck,
  CreditCard,
  Wrench,
  Star,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero search form state
  const [heroSearch, setHeroSearch] = useState({
    city: '',
    propertyType: 'All',
    maxRent: '',
  });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await propertyService.getProperties({ limit: 6, sort: 'newest' });
        setFeaturedProperties(res.data || []);
      } catch (err) {
        console.error('Failed to load featured properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (heroSearch.city) queryParams.append('city', heroSearch.city);
    if (heroSearch.propertyType && heroSearch.propertyType !== 'All') {
      queryParams.append('propertyType', heroSearch.propertyType);
    }
    if (heroSearch.maxRent) queryParams.append('maxRent', heroSearch.maxRent);
    navigate(`/properties?${queryParams.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'radial-gradient(circle at top right, #1e3a8a 0%, #0f172a 100%)',
          color: '#ffffff',
          padding: '5rem 0 6rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.5,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(37, 99, 235, 0.25)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#93c5fd',
                marginBottom: '1.5rem',
              }}
            >
              <Sparkles size={16} /> Nestora Rental Management Platform
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: '800',
                letterSpacing: '-0.03em',
                lineHeight: '1.15',
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              Find a Place You'll Love to Live
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: '#cbd5e1',
                lineHeight: '1.6',
                marginBottom: '3rem',
                maxWidth: '660px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Discover comfortable rental homes, connect with trusted owners, and manage your rental journey effortlessly.
            </p>

            {/* Hero Search Box */}
            <form
              onSubmit={handleHeroSubmit}
              style={{
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
                gap: '1rem',
                alignItems: 'flex-end',
                textAlign: 'left',
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: '#475569', fontSize: '0.8rem' }}>
                  City / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, Austin"
                  value={heroSearch.city}
                  onChange={(e) => setHeroSearch({ ...heroSearch, city: e.target.value })}
                  className="form-control"
                  style={{ border: '1px solid #cbd5e1', height: '46px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: '#475569', fontSize: '0.8rem' }}>
                  Property Type
                </label>
                <select
                  value={heroSearch.propertyType}
                  onChange={(e) => setHeroSearch({ ...heroSearch, propertyType: e.target.value })}
                  className="form-control"
                  style={{ border: '1px solid #cbd5e1', height: '46px' }}
                >
                  <option value="All">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Studio">Studio</option>
                  <option value="Condo">Condo</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: '#475569', fontSize: '0.8rem' }}>
                  Max Budget ($ / mo)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 3500"
                  value={heroSearch.maxRent}
                  onChange={(e) => setHeroSearch({ ...heroSearch, maxRent: e.target.value })}
                  className="form-control"
                  style={{ border: '1px solid #cbd5e1', height: '46px' }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    height: '46px',
                    padding: '0 1.75rem',
                    borderRadius: 'var(--radius-md)',
                    width: '100%',
                  }}
                >
                  <Search size={18} /> Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', gap: '1rem' }}>
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Curated Spaces
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.25rem' }}>
                Featured Rental Properties
              </h2>
            </div>
            <Link to="/properties" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Explore All Properties <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading verified rental listings..." />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem',
              }}
            >
              {featuredProperties.slice(0, 6).map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How Nestora Works */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-main)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 4rem' }}>
            <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Seamless Experience
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0.5rem 0' }}>
              How Nestora Works
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              From discovering your ideal home to paying rent and scheduling repairs, our unified platform coordinates every step.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
            }}
          >
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <Search size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>1. Discover & Apply</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Browse verified homes with filterable amenities, realistic photos, and submit rental applications in seconds.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>2. Landlord Review</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Property owners review tenant profiles, communicate notes, and approve leases with one click.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-lg)',
                  background: '#fef3c7',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <CreditCard size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>3. Pay & Manage</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Simulate effortless digital rent payments, receive receipts, and track due dates directly from your dashboard.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-lg)',
                  background: '#ede9fe',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <Wrench size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>4. Instant Support</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Log maintenance requests with photos, track resolution milestones, and post authentic landlord reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Nestora */}
      <section style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Built For Trust
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0.75rem 0 1.5rem' }}>
                Why Choose Dwellio & Nestora?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Admin Moderated Listings</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      Every property listed by an owner must pass admin scrutiny before going public, keeping scam listings away.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Direct Landlord-Tenant Interaction</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      No middlemen or hidden broker commissions. Connect directly with owners with verified phone and email contacts.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Interactive Status Timelines</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      Tenants and owners share a live visual timeline for maintenance complaints (Pending → In Progress → Resolved).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat highlights */}
            <div
              style={{
                background: 'radial-gradient(circle, #f8fafc 0%, #edf2f7 100%)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>99%</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Verified Listings</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)' }}>24h</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Avg Application Turnaround</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#8b5cf6' }}>100%</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Digital Transparency</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f59e0b' }}>4.9 ★</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Tenant Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Community Feedback
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', margin: '0.5rem 0' }}>
              What Our Community Says
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            <div className="card">
              <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '1rem' }}>
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                "Dwellio made finding my San Francisco penthouse effortless. The application went through cleanly, and the rent simulation makes tracking payments stress-free."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120"
                  alt="Alex Rivera"
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Alex Rivera</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tenant in San Francisco</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '1rem' }}>
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                "As an owner managing multiple homes in Austin and Seattle, having tenant maintenance tickets and revenue analytics on one dashboard is a game-changer."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120"
                  alt="Marcus Vance"
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Marcus Vance</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Property Owner</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '1rem' }}>
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                "The transparency is what sold me. You know the exact security deposit, breakdown of amenities, and can see real reviews from past tenants."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120"
                  alt="Sophia Chen"
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Sophia Chen</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tenant in Chicago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)',
          color: '#ffffff',
          padding: '5rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem' }}>
            Ready to Find Your Next Home?
          </h2>
          <p style={{ color: '#dbeafe', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Join hundreds of satisfied tenants and property managers. Browse available properties or register to list your rentals today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/properties" className="btn btn-lg" style={{ background: '#ffffff', color: 'var(--primary)' }}>
              Explore Properties
            </Link>
            <Link to="/register" className="btn btn-lg" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
              Join as Tenant or Owner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
