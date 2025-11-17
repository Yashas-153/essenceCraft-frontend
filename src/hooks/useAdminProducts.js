import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/api';
import { useAdminAuth } from './useAdminAuth';

export const useAdminProducts = () => {
  const { tokens } = useAdminAuth();
  const [products, setProducts] = useState([]);
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
   * Get all products (includes inactive)
   */
  const fetchProducts = useCallback(async (params = {}) => {
    if (!tokens?.access_token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await adminAPI.getAllProducts(
        params,
        tokens.access_token,
        tokens.token_type
      );
      
      setProducts(data);
      
      // Update pagination if provided
      if (data.pagination) {
        setPagination(data.pagination);
      }
      
      return { success: true, data };
    } catch (err) {
      const message = err.message || 'Failed to fetch products';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  /**
   * Create new product
   */
  const createProduct = useCallback(async (productData) => {
    if (!tokens?.access_token) {
      throw new Error('Not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const newProduct = await adminAPI.createProduct(
        productData,
        tokens.access_token,
        tokens.token_type
      );
      
      // Add to local state
      setProducts(prev => [newProduct, ...prev]);
      
      return { success: true, product: newProduct };
    } catch (err) {
      const message = err.message || 'Failed to create product';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  /**
   * Update existing product
   */
  const updateProduct = useCallback(async (productId, productData) => {
    if (!tokens?.access_token) {
      throw new Error('Not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const updatedProduct = await adminAPI.updateProduct(
        productId,
        productData,
        tokens.access_token,
        tokens.token_type
      );
      
      // Update in local state
      setProducts(prev => 
        prev.map(product => 
          product.id === productId ? updatedProduct : product
        )
      );
      
      return { success: true, product: updatedProduct };
    } catch (err) {
      const message = err.message || 'Failed to update product';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  /**
   * Delete product
   */
  const deleteProduct = useCallback(async (productId) => {
    if (!tokens?.access_token) {
      throw new Error('Not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      await adminAPI.deleteProduct(
        productId,
        tokens.access_token,
        tokens.token_type
      );
      
      // Remove from local state
      setProducts(prev => prev.filter(product => product.id !== productId));
      
      return { success: true };
    } catch (err) {
      const message = err.message || 'Failed to delete product';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  /**
   * Search products
   */
  const searchProducts = useCallback(async (searchTerm, filters = {}) => {
    const params = {
      search: searchTerm,
      ...filters,
    };
    return fetchProducts(params);
  }, [fetchProducts]);

  /**
   * Load more products (pagination)
   */
  const loadMore = useCallback(async () => {
    if (!pagination.hasNext) return;
    
    const params = {
      page: pagination.page + 1,
      limit: pagination.limit,
    };
    
    return fetchProducts(params);
  }, [fetchProducts, pagination]);

  /**
   * Refresh products list
   */
  const refresh = useCallback(() => {
    return fetchProducts();
  }, [fetchProducts]);

  // Load products on mount
  useEffect(() => {
    if (tokens?.access_token) {
      fetchProducts();
    }
  }, [tokens?.access_token]);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    loadMore,
    refresh,
  };
};