import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../services/api';

/**
 * Hook to fetch all products with filters and pagination
 * @param {Object} initialParams - Initial query parameters
 */
export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 12,
    ...initialParams,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsAPI.getAllProducts(params);
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update filters
  const updateFilters = useCallback((newParams) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
      page: 1, // Reset to first page when filters change
    }));
  }, []);

  // Change page
  const setPage = useCallback((page) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  // Refresh products
  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    params,
    updateFilters,
    setPage,
    refetch,
  };
};

/**
 * Hook to fetch a single product by ID
 * @param {number} productId - Product ID
 */
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      console.log('🟢 [useProduct] useEffect triggered with productId:', productId);
      
      if (!productId) {
        console.log('🟡 [useProduct] No productId provided, skipping fetch');
        setLoading(false);
        return;
      }

      try {
        console.log('🔵 [useProduct] Starting fetch for product:', productId);
        setLoading(true);
        setError(null);
        const data = await productsAPI.getProductById(productId);
        console.log('🟢 [useProduct] Product fetched successfully:', data);
        setProduct(data);
      } catch (err) {
        console.error('🔴 [useProduct] Error fetching product:', err);
        setError(err.message || 'Failed to fetch product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const refetch = useCallback(async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await productsAPI.getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  return {
    product,
    loading,
    error,
    refetch,
  };
};