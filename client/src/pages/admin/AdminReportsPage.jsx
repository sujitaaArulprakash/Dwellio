import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';
import { BarChart3, Download, DollarSign, CheckCircle2, TrendingUp, Users, Building2 } from 'lucide-react';

const AdminReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load report stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  if (loading) return <Loader message="Generating operational platform audit report..." />;

  const summary = stats?.summary || {};

  const handleExport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      platform: 'Dwellio Rental Management System',
      kpis: summary,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dwellio-platform-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Platform Reports & Operational Audit</h1>
          <p className="page-header-subtitle">
            Executive summary of network revenue, rental occupancy, and operational compliance.
          </p>
        </div>
        <button onClick={handleExport} className="btn btn-primary btn-sm">
          <Download size={16} /> Export JSON Audit
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Gross Revenue"
          value={`$${(summary.totalRevenue || 0).toLocaleString()}`}
          subtitle="Processed rent volume"
          icon={DollarSign}
          color="success"
        />

        <StatCard
          title="Occupancy Ratio"
          value={
            summary.totalProperties
              ? `${Math.round(((summary.activeRentals || 0) / summary.totalProperties) * 100)}%`
              : '0%'
          }
          subtitle={`${summary.activeRentals || 0} rented / ${summary.totalProperties || 0} listings`}
          icon={CheckCircle2}
          color="primary"
        />

        <StatCard
          title="Complaint Resolution"
          value={
            summary.resolvedComplaints + summary.pendingComplaints > 0
              ? `${Math.round(
                  ((summary.resolvedComplaints || 0) /
                    ((summary.resolvedComplaints || 0) + (summary.pendingComplaints || 0))) *
                    100
                )}%`
              : '100%'
          }
          subtitle={`${summary.resolvedComplaints || 0} resolved`}
          icon={TrendingUp}
          color="success"
        />

        <StatCard
          title="Application Rate"
          value={summary.totalRequests || 0}
          subtitle="Total requests submitted"
          icon={BarChart3}
          color="info"
        />
      </div>

      {/* Summary Matrix Card */}
      <div className="card" style={{ padding: '2rem', marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>
          Platform Health & Operations Matrix
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--primary)' }}>
              User Demographics
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Registered Tenants:</span>
                <strong>{summary.totalTenants || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Property Owners:</span>
                <strong>{summary.totalOwners || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Active Accounts:</span>
                <strong>{summary.totalUsers || 0}</strong>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--accent)' }}>
              Property Portfolio
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Live Approved Listings:</span>
                <strong>{summary.approvedProperties || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Pending Moderation Queue:</span>
                <strong style={{ color: 'var(--warning)' }}>{summary.pendingProperties || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Currently Leased:</span>
                <strong>{summary.activeRentals || 0}</strong>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', color: '#8b5cf6' }}>
              System Compliance
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Database Engine:</span>
                <strong>MongoDB + Mongoose</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Authentication:</span>
                <strong>JWT + bcrypt</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Audit Status:</span>
                <span style={{ color: 'var(--success-text)', fontWeight: '700' }}>Active & Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
