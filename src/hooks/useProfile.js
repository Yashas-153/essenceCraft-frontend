import { useState, useEffect, useCallback } from 'react';
import { userAPI, orderAPI } from '../services/api';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing user profile data
 * Handles fetching and updating user profile and orders
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreOrders, setHasMoreOrders] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getProfile();
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
      toast.error('Failed to load profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await userAPI.updateProfile(profileData);
      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      toast.error('Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user orders with pagination
  const fetchOrders = useCallback(async (page = 1, limit = 10) => {
    try {
      setOrdersLoading(true);
      setError(null);
      const data = await orderAPI.getOrders(page, limit);
      
      // Handle pagination - append or replace based on page
      if (page === 1) {
        setOrders(data);
      } else {
        setOrders(prev => [...prev, ...data]);
      }
      
      setCurrentPage(page);
      setHasMoreOrders(data.length === limit);
      setTotalOrders(prev => page === 1 ? data.length : prev + data.length);
      
      return data;
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
      toast.error('Failed to load orders');
      throw err;
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Fetch order details by ID
  const fetchOrderById = useCallback(async (orderId) => {
    try {
      const data = await orderAPI.getOrderById(orderId);
      return data;
    } catch (err) {
      console.error('Error fetching order:', err);
      toast.error('Failed to load order details');
      throw err;
    }
  }, []);

  // Cancel order
  const cancelOrder = useCallback(async (orderId) => {
    try {
      const cancelledOrder = await orderAPI.cancelOrder(orderId);
      
      // Update orders list with cancelled order
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? cancelledOrder : order
        )
      );
      
      toast.success('Order cancelled successfully');
      return cancelledOrder;
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error(err.message || 'Failed to cancel order');
      throw err;
    }
  }, []);

  // Get order invoice
  const getOrderInvoice = useCallback(async (orderId) => {
    try {
      const invoice = await orderAPI.getOrderInvoice(orderId);
      toast.success('Invoice retrieved successfully');
      return invoice;
    } catch (err) {
      console.error('Error fetching invoice:', err);
      toast.error('Failed to load invoice');
      throw err;
    }
  }, []);

  // Load more orders (pagination)
  const loadMoreOrders = useCallback(async () => {
    if (!ordersLoading && hasMoreOrders) {
      await fetchOrders(currentPage + 1);
    }
  }, [ordersLoading, hasMoreOrders, currentPage, fetchOrders]);

  // Refresh all profile data
  const refreshProfile = useCallback(async () => {
    await Promise.all([
      fetchProfile(),
      fetchOrders(1),
    ]);
  }, [fetchProfile, fetchOrders]);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchProfile();
        await fetchOrders(1);
      } catch (err) {
        console.error('Error loading initial profile data:', err);
      }
    };

    loadInitialData();
  }, [fetchProfile, fetchOrders]);

  return {
    // Profile data
    profile,
    orders,
    
    // Loading states
    loading,
    ordersLoading,
    
    // Error state
    error,
    
    // Pagination
    currentPage,
    hasMoreOrders,
    totalOrders,
    
    // Profile actions
    fetchProfile,
    updateProfile,
    refreshProfile,
    
    // Order actions
    fetchOrders,
    fetchOrderById,
    cancelOrder,
    getOrderInvoice,
    loadMoreOrders,
  };
};

export default useProfile;
