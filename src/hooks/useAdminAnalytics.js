import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/api';
import { useAdminAuth } from './useAdminAuth';

export const useAdminAnalytics = () => {
  const { tokens } = useAdminAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Fetch analytics data
   */
  const fetchAnalytics = useCallback(async () => {
    if (!tokens?.access_token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await adminAPI.getAnalytics(
        tokens.access_token,
        tokens.token_type
      );
      
      setAnalytics(data);
      setLastUpdated(new Date());
      
      return { success: true, data };
    } catch (err) {
      const message = err.message || 'Failed to fetch analytics';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  /**
   * Get order statistics
   */
  const getOrderStats = useCallback(() => {
    if (!analytics) return null;

    return {
      total: analytics.total_orders,
      pending: analytics.pending_orders,
      processing: analytics.processing_orders,
      shipped: analytics.shipped_orders,
      delivered: analytics.delivered_orders,
      cancelled: analytics.cancelled_orders,
    };
  }, [analytics]);

  /**
   * Get user statistics
   */
  const getUserStats = useCallback(() => {
    if (!analytics) return null;

    return {
      total: analytics.total_users,
    };
  }, [analytics]);

  /**
   * Get revenue statistics
   */
  const getRevenueStats = useCallback(() => {
    if (!analytics) return null;

    return {
      total: analytics.total_revenue,
      byMonth: analytics.revenue_by_month,
    };
  }, [analytics]);

  /**
   * Get top products
   */
  const getTopProducts = useCallback(() => {
    if (!analytics) return [];

    return analytics.top_products || [];
  }, [analytics]);

  /**
   * Calculate growth rates
   */
  const getGrowthRates = useCallback(() => {
    if (!analytics?.revenue_by_month || analytics.revenue_by_month.length < 2) {
      return null;
    }

    const revenueData = analytics.revenue_by_month;
    const currentMonth = revenueData[revenueData.length - 1];
    const previousMonth = revenueData[revenueData.length - 2];

    const revenueGrowth = previousMonth.revenue > 0 
      ? ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100 
      : 0;

    return {
      revenue: revenueGrowth,
    };
  }, [analytics]);

  /**
   * Get order completion rate
   */
  const getOrderCompletionRate = useCallback(() => {
    if (!analytics) return 0;

    const totalOrders = analytics.total_orders;
    const completedOrders = analytics.delivered_orders;

    return totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
  }, [analytics]);

  /**
   * Get order status distribution
   */
  const getOrderStatusDistribution = useCallback(() => {
    if (!analytics) return [];

    const total = analytics.total_orders;
    if (total === 0) return [];

    return [
      { status: 'Pending', count: analytics.pending_orders, percentage: (analytics.pending_orders / total) * 100 },
      { status: 'Processing', count: analytics.processing_orders, percentage: (analytics.processing_orders / total) * 100 },
      { status: 'Shipped', count: analytics.shipped_orders, percentage: (analytics.shipped_orders / total) * 100 },
      { status: 'Delivered', count: analytics.delivered_orders, percentage: (analytics.delivered_orders / total) * 100 },
      { status: 'Cancelled', count: analytics.cancelled_orders, percentage: (analytics.cancelled_orders / total) * 100 },
    ];
  }, [analytics]);

  /**
   * Refresh analytics data
   */
  const refresh = useCallback(() => {
    return fetchAnalytics();
  }, [fetchAnalytics]);

  /**
   * Check if data needs refresh (older than 5 minutes)
   */
  const needsRefresh = useCallback(() => {
    if (!lastUpdated) return true;
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastUpdated < fiveMinutesAgo;
  }, [lastUpdated]);

  /**
   * Auto-refresh if needed
   */
  const autoRefresh = useCallback(() => {
    if (needsRefresh()) {
      return fetchAnalytics();
    }
  }, [needsRefresh, fetchAnalytics]);

  // Load analytics on mount
  useEffect(() => {
    if (tokens?.access_token) {
      fetchAnalytics();
    }
  }, [tokens?.access_token]);

  // Auto-refresh every 5 minutes when component is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (tokens?.access_token && needsRefresh()) {
        fetchAnalytics();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [tokens?.access_token, needsRefresh, fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    lastUpdated,
    fetchAnalytics,
    getOrderStats,
    getUserStats,
    getRevenueStats,
    getTopProducts,
    getGrowthRates,
    getOrderCompletionRate,
    getOrderStatusDistribution,
    refresh,
    needsRefresh,
    autoRefresh,
  };
};