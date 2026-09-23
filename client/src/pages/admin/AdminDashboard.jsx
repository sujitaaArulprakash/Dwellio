import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';
import RevenueAreaChart from '../../components/charts/RevenueAreaChart';
import PropertyPieChart from '../../components/charts/PropertyPieChart';
import UserDonutChart from '../../components/charts/UserDonutChart';
import RequestBarChart from '../../components/charts/RequestBarChart';
import {
  Users,
  Building2,
  Clock,
  Home,
  DollarSign,
  Wrench,
  Shield,
  FileText,
  ArrowRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader message="Compiling platform-wide analytics and metrics..." />;

  const summary = stats?.summary || {};
  const charts = stats?.charts || {};

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Platform Administration</h1>
          <p className="page-header-subtitle">
            System-wide operational oversight, moderation queues, and real-time revenue analytics.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/properties?status=pending" className="btn btn-primary btn-sm">
            <Clock size={16} /> Pending Properties ({summary.pendingProperties || 0})
          </Link>
          <Link to="/admin/users" className="btn btn-secondary btn-sm">
            <Users size={16} /> User Directory
          </Link>
        </div>
      </div>

      {/* Dashboard KPI Metric Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={summary.totalUsers || 0}
          subtitle={`${summary.totalTenants || 0} Tenants • ${summary.totalOwners || 0} Owners`}
          icon={Users}
          color="primary"
        />

        <StatCard
          title="Total Properties"
          value={summary.totalProperties || 0}
          subtitle={`${summary.approvedProperties || 0} Live Listings`}
          icon={Building2}
          color="info"
        />

        <StatCard
          title="Pending Moderation"
          value={summary.pendingProperties || 0}
          subtitle="Awaiting admin approval"
          icon={Clock}
          color={summary.pendingProperties > 0 ? 'warning' : 'primary'}
        />

        <StatCard
          title="Active Rentals"
          value={summary.activeRentals || 0}
          subtitle="Currently occupied homes"
          icon={Home}
          color="success"
        />

        <StatCard
          title="Platform Revenue"
          value={`$${(summary.totalRevenue || 0).toLocaleString()}`}
          subtitle="Total verified volume"
          icon={DollarSign}
          color="success"
        />

        <StatCard
          title="Pending Complaints"
          value={summary.pendingComplaints || 0}
          subtitle={`${summary.resolvedComplaints || 0} Resolved`}
          icon={Wrench}
          color={summary.pendingComplaints > 0 ? 'danger' : 'info'}
        />
      </div>

      {/* Recharts Analytics Grids */}
      <div className="charts-grid">
        {/* Monthly Revenue Area Chart */}
        <div className="chart-card">
          <div className="chart-title">Platform Monthly Rental Volume</div>
          <RevenueAreaChart data={charts.monthlyRevenue || []} />
        </div>

        {/* User Distribution Donut Chart */}
        <div className="chart-card">
          <div className="chart-title">User Role Distribution</div>
          <UserDonutChart data={charts.userDistribution || []} />
        </div>
      </div>

      <div className="charts-grid">
        {/* Property Type Distribution Pie Chart */}
        <div className="chart-card">
          <div className="chart-title">Property Types Breakdown</div>
          <PropertyPieChart data={charts.propertyDistribution || []} />
        </div>

        {/* Rental Requests Volume Bar Chart */}
        <div className="chart-card">
          <div className="chart-title">Rental Application Volumes</div>
          <RequestBarChart data={charts.requestStatus || []} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
