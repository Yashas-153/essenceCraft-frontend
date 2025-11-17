import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useAuth } from './useAuth';
import { adminAPI } from '../services/api';

// Create Admin Context
const AdminContext = createContext(null);

/**
 * Admin Provider Component
 * Wrap your admin routes with this to provide admin auth state globally
 */
export const AdminProvider = ({ children }) => {
  const { user, tokens, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if current user is admin
  const checkAdminStatus = useCallback(() => {
    if (!isAuthenticated || !user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Check if user has admin flag
    if (user.is_admin) {
      setIsAdmin(true);
      setLoading(false);
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  /**
   * Make user admin
   * @param {string} email - Email of user to make admin
   */
  const makeUserAdmin = useCallback(async (email) => {
    if (!tokens?.access_token) {
      throw new Error('Not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const updatedUser = await adminAPI.makeUserAdmin(
        email,
        tokens.access_token,
        tokens.token_type
      );
      return { success: true, user: updatedUser };
    } catch (err) {
      const message = err.message || 'Failed to make user admin';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  /**
   * Get auth headers for admin requests
   */
  const getAdminAuthHeaders = useCallback(() => {
    if (!tokens?.access_token) {
      return {};
    }
    return {
      'Authorization': `${tokens.token_type || 'bearer'} ${tokens.access_token}`,
    };
  }, [tokens]);

  /**
   * Check if user has admin access
   */
  const hasAdminAccess = useCallback(() => {
    return isAuthenticated && isAdmin;
  }, [isAuthenticated, isAdmin]);

  const value = {
    isAdmin,
    isAuthenticated,
    hasAdminAccess: hasAdminAccess(),
    user,
    tokens,
    loading,
    error,
    makeUserAdmin,
    getAdminAuthHeaders,
    checkAdminStatus,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

/**
 * Custom hook to use admin context
 */
export const useAdminAuth = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminProvider');
  }
  return context;
};

/**
 * HOC for admin route protection
 */
export const withAdminAuth = (Component) => {
  return function AdminProtectedComponent(props) {
    const { hasAdminAccess, loading } = useAdminAuth();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-stone-600">Verifying admin access...</p>
          </div>
        </div>
      );
    }

    if (!hasAdminAccess) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">Access Denied</h1>
            <p className="text-stone-600 mb-4">
              You don't have permission to access this admin area.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};