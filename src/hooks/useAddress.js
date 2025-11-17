import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing user addresses
 * @param {string} apiBaseUrl - Base URL for the API (default: http://localhost:8000/api/v1)
 * @returns {Object} Address methods and state
 */
const useAddress = (apiBaseUrl = 'http://localhost:8000/api/v1') => {
  const [addresses, setAddresses] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [defaultShippingAddress, setDefaultShippingAddress] = useState(null);
  const [defaultBillingAddress, setDefaultBillingAddress] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);

  /**
   * Get access token from localStorage
   */
  const getAccessToken = useCallback(() => {
    console.log('🟡 [getAccessToken] Checking for token in localStorage');
    const token = localStorage.getItem('token');
    console.log('🟡 [getAccessToken] Token found:', !!token);
    console.log('🟡 [getAccessToken] Token value (first 20 chars):', token?.substring(0, 20) + '...');
    if (!token) {
      console.error('🟡 [getAccessToken] No token found!');
      throw new Error('No access token found. Please login first.');
    }
    return token;
  }, []);

  /**
   * Fetch all addresses
   */
  const fetchAddresses = useCallback(async (addressType = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const url = addressType 
        ? `${apiBaseUrl}/users/me/addresses?address_type=${addressType}`
        : `${apiBaseUrl}/users/me/addresses`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      setAddresses(data);

      // Separate by type
      const shipping = data.filter(addr => addr.address_type === 'shipping');
      const billing = data.filter(addr => addr.address_type === 'billing');
      
      setShippingAddresses(shipping);
      setBillingAddresses(billing);

      // Set default addresses
      const defaultShipping = shipping.find(addr => addr.is_default);
      const defaultBilling = billing.find(addr => addr.is_default);
      
      setDefaultShippingAddress(defaultShipping || null);
      setDefaultBillingAddress(defaultBilling || null);

      // Auto-select default shipping address if none selected
      if (!selectedAddressId && defaultShipping) {
        setSelectedAddressId(defaultShipping.id);
      }

      return data;

    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, getAccessToken, selectedAddressId]);

  /**
   * Fetch address statistics
   */
  const fetchStatistics = useCallback(async () => {
    try {
      const token = getAccessToken();
      const response = await fetch(`${apiBaseUrl}/addresses/statistics/count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStatistics(data);
      return data;

    } catch (err) {
      console.error('Error fetching statistics:', err);
      throw err;
    }
  }, [apiBaseUrl, getAccessToken]);

  /**
   * Fetch single address by ID
   */
  const fetchAddressById = useCallback(async (addressId) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const response = await fetch(`${apiBaseUrl}/users/me/addresses/${addressId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Address not found');
      }

      return await response.json();

    } catch (err) {
      console.error('Error fetching address:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, getAccessToken]);

  /**
   * Fetch default address by type
   */
  const fetchDefaultAddress = useCallback(async (addressType) => {
    try {
      const token = getAccessToken();
      const response = await fetch(`${apiBaseUrl}/users/me/addresses/default/${addressType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No default address set
        }
        throw new Error(`Failed to fetch default ${addressType} address`);
      }

      return await response.json();

    } catch (err) {
      console.error(`Error fetching default ${addressType} address:`, err);
      throw err;
    }
  }, [apiBaseUrl, getAccessToken]);

  /**
   * Create new address
   */
  const createAddress = useCallback(async (addressData) => {
    console.log('🔵 [useAddress.createAddress] Starting address creation');
    console.log('🔵 [useAddress.createAddress] Received data:', addressData);
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔵 [useAddress.createAddress] Getting access token...');
      const token = getAccessToken();
      console.log('🔵 [useAddress.createAddress] Token obtained, length:', token?.length);
      
      const url = `${apiBaseUrl}/users/me/addresses`;
      console.log('🔵 [useAddress.createAddress] Making POST request to:', url);
      console.log('🔵 [useAddress.createAddress] Request body:', JSON.stringify(addressData));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });

      console.log('🔵 [useAddress.createAddress] Response status:', response.status);
      console.log('🔵 [useAddress.createAddress] Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('🔵 [useAddress.createAddress] Error response:', errorData);
        throw new Error(errorData.detail || errorData.message || 'Failed to create address');
      }

      const newAddress = await response.json();
      console.log('🔵 [useAddress.createAddress] Address created successfully:', newAddress);
      
      // Refresh addresses list after successful creation
      setTimeout(() => {
        console.log('🔵 [useAddress.createAddress] Refreshing addresses list...');
        fetchAddresses().catch(err => console.error('🔵 [useAddress.createAddress] Error refreshing addresses:', err));
      }, 500);
      
      return newAddress;

    } catch (err) {
      console.error('🔵 [useAddress.createAddress] Catch block - Error:', err);
      console.error('🔵 [useAddress.createAddress] Error message:', err.message);
      setError(err.message);
      throw err;
    } finally {
      console.log('🔵 [useAddress.createAddress] Finally block - Setting isLoading to false');
      setIsLoading(false);
    }
  }, [apiBaseUrl, getAccessToken, fetchAddresses]);

  /**
   * Update existing address
   */
  const updateAddress = useCallback(async (addressId, updateData) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const response = await fetch(`${apiBaseUrl}/users/me/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update address');
      }

      const updatedAddress = await response.json();
      
      // Refresh addresses list after successful update
      setTimeout(() => {
        fetchAddresses().catch(err => console.error('Error refreshing addresses:', err));
      }, 500);
      
      return updatedAddress;

    } catch (err) {
      console.error('Error updating address:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, getAccessToken, fetchAddresses]);

  /**
   * Delete address
   */
  const deleteAddress = useCallback(async (addressId) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const response = await fetch(`${apiBaseUrl}/users/me/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }

      // If deleted address was selected, clear selection
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }

      // Refresh addresses list after successful deletion
      setTimeout(() => {
        fetchAddresses().catch(err => console.error('Error refreshing addresses:', err));
      }, 500);
      
      return true;

    } catch (err) {
      console.error('Error deleting address:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, getAccessToken, selectedAddressId, fetchAddresses]);

  /**
   * Set address as default
   */
  const setAsDefault = useCallback(async (addressId) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const response = await fetch(`${apiBaseUrl}/users/me/addresses/${addressId}/set-default`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }

      const updatedAddress = await response.json();
      
      // Refresh addresses list after successful update
      setTimeout(() => {
        fetchAddresses().catch(err => console.error('Error refreshing addresses:', err));
      }, 500);
      
      return updatedAddress;

    } catch (err) {
      console.error('Error setting default address:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, getAccessToken, fetchAddresses]);

  /**
   * Validate address data before submission
   */
  const validateAddress = useCallback((addressData) => {
    const errors = {};

    if (!addressData.street_address || addressData.street_address.length < 5) {
      errors.street_address = 'Street address must be at least 5 characters';
    }

    if (!addressData.city || addressData.city.length < 2) {
      errors.city = 'City is required';
    }

    if (!addressData.state || addressData.state.length < 2) {
      errors.state = 'State is required';
    }

    if (!addressData.postal_code) {
      errors.postal_code = 'Postal code is required';
    } else if (addressData.country === 'India' && !/^\d{6}$/.test(addressData.postal_code)) {
      errors.postal_code = 'Indian postal code must be 6 digits';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  /**
   * Select address for checkout
   */
  const selectAddress = useCallback((addressId) => {
    setSelectedAddressId(addressId);
  }, []);

  /**
   * Get selected address object
   */
  const getSelectedAddress = useCallback(() => {
    if (!selectedAddressId) return null;
    return addresses.find(addr => addr.id === selectedAddressId);
  }, [selectedAddressId, addresses]);

  /**
   * Check if user has any addresses
   */
  const hasAddresses = useCallback(() => {
    return addresses.length > 0;
  }, [addresses]);

  /**
   * Check if user has default address of type
   */
  const hasDefaultAddress = useCallback((addressType) => {
    if (addressType === 'shipping') {
      return defaultShippingAddress !== null;
    } else if (addressType === 'billing') {
      return defaultBillingAddress !== null;
    }
    return false;
  }, [defaultShippingAddress, defaultBillingAddress]);

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setAddresses([]);
    setShippingAddresses([]);
    setBillingAddresses([]);
    setDefaultShippingAddress(null);
    setDefaultBillingAddress(null);
    setSelectedAddressId(null);
    setIsLoading(false);
    setError(null);
    setStatistics(null);
  }, []);

  /**
   * Initialize - fetch addresses on mount
   */
  useEffect(() => {
    const initializeAddresses = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          await fetchAddresses();
          await fetchStatistics();
        }
      } catch (err) {
        console.error('Error initializing addresses:', err);
      }
    };

    initializeAddresses();
  }, []); // Empty dependency array - only run on mount

  return {
    // State
    addresses,
    shippingAddresses,
    billingAddresses,
    defaultShippingAddress,
    defaultBillingAddress,
    selectedAddressId,
    isLoading,
    error,
    statistics,

    // Methods - Fetch
    fetchAddresses,
    fetchAddressById,
    fetchDefaultAddress,
    fetchStatistics,

    // Methods - CRUD
    createAddress,
    updateAddress,
    deleteAddress,
    setAsDefault,

    // Methods - Selection
    selectAddress,
    getSelectedAddress,

    // Methods - Validation & Utilities
    validateAddress,
    hasAddresses,
    hasDefaultAddress,
    reset
  };
};

export default useAddress;