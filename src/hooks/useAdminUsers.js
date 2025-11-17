import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/api';
import { useAdminAuth } from './useAdminAuth';

export const useAdminUsers = () => {
  const { tokens, makeUserAdmin } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
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
   * Get all users
   */
  const fetchUsers = useCallback(async (params = {}) => {
    if (!tokens?.access_token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await adminAPI.getAllUsers(
        params,
        tokens.access_token,
        tokens.token_type
      );
      
      setUsers(data);
      
      // Update pagination if provided
      if (data.pagination) {
        setPagination(data.pagination);
      }
      
      return { success: true, data };
    } catch (err) {
      const message = err.message || 'Failed to fetch users';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  /**
   * Get user by ID
   */
  const fetchUserById = useCallback(async (userId) => {
    if (!tokens?.access_token) {
      throw new Error('Not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const user = await adminAPI.getUserById(
        userId,
        tokens.access_token,
        tokens.token_type
      );
      
      setSelectedUser(user);
      return { success: true, user };
    } catch (err) {
      const message = err.message || 'Failed to fetch user';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  /**
   * Make user admin
   */
  const promoteToAdmin = useCallback(async (email) => {
    setLoading(true);
    setError(null);

    try {
      const result = await makeUserAdmin(email);
      
      if (result.success) {
        // Update user in local state
        setUsers(prev => 
          prev.map(user => 
            user.email === email ? { ...user, is_admin: true } : user
          )
        );
      }
      
      return result;
    } catch (err) {
      const message = err.message || 'Failed to make user admin';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [makeUserAdmin]);

  /**
   * Filter users by admin status
   */
  const getAdminUsers = useCallback(() => {
    return users.filter(user => user.is_admin);
  }, [users]);

  /**
   * Filter users by regular status
   */
  const getRegularUsers = useCallback(() => {
    return users.filter(user => !user.is_admin);
  }, [users]);

  /**
   * Get user statistics
   */
  const getUserStats = useCallback(() => {
    const stats = {
      total: users.length,
      admins: 0,
      regular: 0,
      active: 0,
      inactive: 0,
    };

    users.forEach(user => {
      if (user.is_admin) stats.admins++;
      else stats.regular++;
      
      if (user.is_active) stats.active++;
      else stats.inactive++;
    });

    return stats;
  }, [users]);

  /**
   * Search users by email or name
   */
  const searchUsers = useCallback((searchTerm) => {
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.email.toLowerCase().includes(term) ||
      user.full_name?.toLowerCase().includes(term)
    );
  }, [users]);

  /**
   * Load more users (pagination)
   */
  const loadMore = useCallback(async () => {
    if (!pagination.hasNext) return;
    
    const params = {
      page: pagination.page + 1,
      limit: pagination.limit,
    };
    
    return fetchUsers(params);
  }, [fetchUsers, pagination]);

  /**
   * Refresh users list
   */
  const refresh = useCallback(() => {
    return fetchUsers();
  }, [fetchUsers]);

  /**
   * Clear selected user
   */
  const clearSelectedUser = useCallback(() => {
    setSelectedUser(null);
  }, []);

  // Load users on mount
  useEffect(() => {
    if (tokens?.access_token) {
      fetchUsers();
    }
  }, [tokens?.access_token]);

  return {
    users,
    selectedUser,
    loading,
    error,
    pagination,
    fetchUsers,
    fetchUserById,
    promoteToAdmin,
    getAdminUsers,
    getRegularUsers,
    getUserStats,
    searchUsers,
    loadMore,
    refresh,
    clearSelectedUser,
  };
};