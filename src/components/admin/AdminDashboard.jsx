import React from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics';
import { Button } from '../ui/button';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'emerald' }) => {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-600">{title}</p>
          <p className="text-3xl font-bold text-stone-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

const OrderStatusChart = ({ orderStats }) => {
  const statuses = [
    { name: 'Pending', value: orderStats?.pending || 0, color: 'bg-amber-500' },
    { name: 'Processing', value: orderStats?.processing || 0, color: 'bg-blue-500' },
    { name: 'Shipped', value: orderStats?.shipped || 0, color: 'bg-purple-500' },
    { name: 'Delivered', value: orderStats?.delivered || 0, color: 'bg-emerald-500' },
    { name: 'Cancelled', value: orderStats?.cancelled || 0, color: 'bg-red-500' },
  ];

  const total = statuses.reduce((sum, status) => sum + status.value, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
      <h3 className="text-lg font-semibold text-stone-900 mb-4">Order Status Distribution</h3>
      <div className="space-y-3">
        {statuses.map((status) => {
          const percentage = total > 0 ? (status.value / total) * 100 : 0;
          return (
            <div key={status.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                <span className="text-sm text-stone-600">{status.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-stone-900">{status.value}</span>
                <span className="text-xs text-stone-500">({percentage.toFixed(1)}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TopProducts = ({ topProducts }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
      <h3 className="text-lg font-semibold text-stone-900 mb-4">Top Products</h3>
      <div className="space-y-3">
        {topProducts && topProducts.length > 0 ? (
          topProducts.slice(0, 5).map((product, index) => (
            <div key={product.product_id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-emerald-700">#{index + 1}</span>
                </div>
                <span className="text-sm text-stone-900 truncate">{product.name}</span>
              </div>
              <span className="text-sm font-medium text-stone-600">{product.total_sold} sold</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-stone-500">No sales data available</p>
        )}
      </div>
    </div>
  );
};

const RevenueChart = ({ revenueData }) => {
  if (!revenueData || revenueData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Revenue Trend</h3>
        <p className="text-sm text-stone-500">No revenue data available</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...revenueData.map(item => item.revenue));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
      <h3 className="text-lg font-semibold text-stone-900 mb-4">Revenue Trend (Last 12 Months)</h3>
      <div className="space-y-2">
        {revenueData.slice(-6).map((item) => {
          const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
          return (
            <div key={item.month} className="flex items-center space-x-3">
              <div className="w-16 text-xs text-stone-500">{item.month}</div>
              <div className="flex-1 bg-stone-100 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="w-20 text-xs text-stone-900 text-right">
                ₹{item.revenue.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { 
    analytics, 
    loading, 
    error, 
    lastUpdated, 
    refresh,
    getOrderStats,
    getUserStats,
    getRevenueStats,
    getTopProducts,
    getGrowthRates 
  } = useAdminAnalytics();

  const orderStats = getOrderStats();
  const userStats = getUserStats();
  const revenueStats = getRevenueStats();
  const topProducts = getTopProducts();
  const growthRates = getGrowthRates();

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin mx-auto mb-2" />
          <p className="text-stone-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-stone-600 mb-4">{error}</p>
          <Button onClick={refresh} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Dashboard Overview</h1>
          <p className="text-stone-600">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {lastUpdated && (
            <p className="text-xs text-stone-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <Button onClick={refresh} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${revenueStats?.total?.toLocaleString() || '0'}`}
          icon={DollarSign}
          trend={growthRates?.revenue > 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(growthRates?.revenue || 0).toFixed(1)}% from last month`}
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value={orderStats?.total?.toLocaleString() || '0'}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={userStats?.total?.toLocaleString() || '0'}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Pending Orders"
          value={orderStats?.pending?.toLocaleString() || '0'}
          icon={Package}
          color="amber"
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart orderStats={orderStats} />
        <TopProducts topProducts={topProducts} />
      </div>

      {/* Revenue Chart */}
      <RevenueChart revenueData={revenueStats?.byMonth} />

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Add New Product
          </Button>
          <Button variant="outline">
            View All Orders
          </Button>
          <Button variant="outline">
            Manage Users
          </Button>
          <Button variant="outline">
            Export Reports
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;