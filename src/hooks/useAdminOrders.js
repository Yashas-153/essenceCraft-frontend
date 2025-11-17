import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/api';
import { useAdminAuth } from './useAdminAuth';

// Order status constants
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const useAdminOrders = () => {
  const { tokens } = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  /**
   * Get all orders
   */
  const fetchOrders = useCallback(async (params = {}) => {
    if (!tokens?.access_token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await adminAPI.getAllOrders(
        params,
        tokens.access_token,
        tokens.token_type
      );
      
      setOrders(data);
      
      // Update pagination if provided
      if (data.pagination) {
        setPagination(data.pagination);
      }
      
      return { success: true, data };
    } catch (err) {
      const message = err.message || 'Failed to fetch orders';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  /**
   * Update order status
   */
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    if (!tokens?.access_token) {
      throw new Error('Not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const updatedOrder = await adminAPI.updateOrderStatus(
        orderId,
        newStatus,
        tokens.access_token,
        tokens.token_type
      );
      
      // Update in local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      
      return { success: true, order: updatedOrder };
    } catch (err) {
      const message = err.message || 'Failed to update order status';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  /**
   * Filter orders by status
   */
  const filterByStatus = useCallback(async (status) => {
    const params = { status };
    return fetchOrders(params);
  }, [fetchOrders]);

  /**
   * Get orders by multiple statuses
   */
  const getOrdersByStatuses = useCallback((statuses) => {
    return orders.filter(order => statuses.includes(order.status));
  }, [orders]);

  /**
   * Get order statistics
   */
  const getOrderStats = useCallback(() => {
    const stats = {
      total: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      refunded: 0,
    };

    orders.forEach(order => {
      if (stats.hasOwnProperty(order.status)) {
        stats[order.status]++;
      }
    });

    return stats;
  }, [orders]);

  /**
   * Load more orders (pagination)
   */
  const loadMore = useCallback(async () => {
    if (!pagination.hasNext) return;
    
    const params = {
      page: pagination.page + 1,
      limit: pagination.limit,
    };
    
    return fetchOrders(params);
  }, [fetchOrders, pagination]);

  /**
   * Refresh orders list
   */
  const refresh = useCallback(() => {
    return fetchOrders();
  }, [fetchOrders]);

  /**
   * Bulk update order statuses
   */
  const bulkUpdateStatus = useCallback(async (orderIds, newStatus) => {
    const results = [];
    
    for (const orderId of orderIds) {
      const result = await updateOrderStatus(orderId, newStatus);
      results.push({ orderId, ...result });
    }
    
    return results;
  }, [updateOrderStatus]);

  // Load orders on mount
  useEffect(() => {
    if (tokens?.access_token) {
      fetchOrders();
    }
  }, [tokens?.access_token]);

  return {
    orders,
    loading,
    error,
    pagination,
    fetchOrders,
    updateOrderStatus,
    filterByStatus,
    getOrdersByStatuses,
    getOrderStats,
    loadMore,
    refresh,
    bulkUpdateStatus,
    ORDER_STATUSES,
  };
};