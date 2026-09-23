import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { rentalService } from '../../services/rentalService';
import { paymentService } from '../../services/paymentService';
import { maintenanceService } from '../../services/maintenanceService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import RevenueAreaChart from '../../components/charts/RevenueAreaChart';
import PropertyPieChart from '../../components/charts/PropertyPieChart';
import {
  Building2,
  CheckCircle,
  Home,
  FileText,
  DollarSign,
  Wrench,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const OwnerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState({ totalIncome: 0, pendingRent: 0, overdueRent: 0 });
  const [loading, setLoading] = useState(true);

  const fetchOwnerData = async () => {
    try {
      const [propsRes, reqsRes, payRes, maintRes] = await Promise.all([
        propertyService.getMyProperties(),
        rentalService.getOwnerRequests(),
        paymentService.getOwnerPayments(),
        maintenanceService.getOwnerRequests(),
      ]);

      setProperties(propsRes.data || []);
      setRequests(reqsRes.data || []);
      setPayments(payRes.data || []);
      setPaymentSummary(payRes.summary || { totalIncome: 0, pendingRent: 0, overdueRent: 0 });
      setMaintenance(maintRes.data || []);
    } catch (err) {
      console.error('Failed to load owner dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  if (loading) return <Loader message="Loading owner analytics dashboard..." />;

  // Overview metrics
  const totalProperties = properties.length;
  const availableProperties = properties.filter((p) => p.status === 'approved' || p.status === 'available').length;
  const rentedProperties = properties.filter((p) => p.status === 'rented').length;
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;

  // Monthly potential income
  const totalMonthlyIncome = properties
    .filter((p) => p.status === 'rented')
    .reduce((acc, p) => acc + p.rent, 0);

  // Property type distribution for pie chart
  const typeMap = {};
  properties.forEach((p) => {
    typeMap[p.propertyType] = (typeMap[p.propertyType] || 0) + 1;
  });
  const propertyPieData = Object.keys(typeMap).map((key) => ({
    name: key,
    value: typeMap[key],
  }));

  // Revenue chart by month (calculated from paid payments)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const curYear = new Date().getFullYear();
  const revenueMap = {};
  months.forEach((m) => (revenueMap[m] = 0));
  payments.forEach((p) => {
    if (p.status === 'paid' && p.paymentDate) {
      const d = new Date(p.paymentDate);
      if (d.getFullYear() === curYear) {
        const mName = months[d.getMonth()];
        revenueMap[mName] += p.amount;
      }
    }
  });
  const monthlyRevenueData = months.map((m) => ({ month: m, revenue: revenueMap[m] }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Owner Dashboard</h1>
          <p className="page-header-subtitle">
            Portfolio performance, rental revenue, tenant applications, and property health.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/owner/properties/new" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Add New Property
          </Link>
          <Link to="/owner/requests" className="btn btn-secondary btn-sm">
            <FileText size={16} /> View Inquiries ({pendingRequests})
          </Link>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Properties"
          value={totalProperties}
          subtitle="Portfolio inventory"
          icon={Building2}
          color="primary"
        />

        <StatCard
          title="Available Units"
          value={availableProperties}
          subtitle="Ready for move-in"
          icon={CheckCircle}
          color="info"
        />

        <StatCard
          title="Rented Units"
          value={rentedProperties}
          subtitle="Active tenancies"
          icon={Home}
          color="success"
        />

        <StatCard
          title="Pending Requests"
          value={pendingRequests}
          subtitle="Inquiries awaiting review"
          icon={FileText}
          color={pendingRequests > 0 ? 'warning' : 'primary'}
        />

        <StatCard
          title="Monthly Income"
          value={`$${totalMonthlyIncome.toLocaleString()}`}
          subtitle="Active leased revenue"
          icon={DollarSign}
          color="success"
        />
      </div>

      {/* Analytics Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Collected Rental Revenue ({curYear})</div>
          <RevenueAreaChart data={monthlyRevenueData} />
        </div>

        <div className="chart-card">
          <div className="chart-title">Portfolio Property Types</div>
          <PropertyPieChart data={propertyPieData} />
        </div>
      </div>

      {/* Recent Rental Requests Table */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Recent Rental Applications</h3>
          <Link to="/owner/requests" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem' }}>
            Manage All ({requests.length})
          </Link>
        </div>

        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No rental applications received yet.
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Property</th>
                  <th>Monthly Rent</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map((req) => (
                  <tr key={req._id}>
                    <td>
                      <div style={{ fontWeight: '700' }}>{req.tenantId?.name || 'Tenant'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.tenantId?.email}</div>
                    </td>
                    <td style={{ fontWeight: '600' }}>{req.propertyId?.title}</td>
                    <td style={{ fontWeight: '700' }}>${req.propertyId?.rent?.toLocaleString()}</td>
                    <td>{new Date(req.requestedAt).toLocaleDateString()}</td>
                    <td><Badge status={req.status} /></td>
                    <td>
                      <Link to="/owner/requests" className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
