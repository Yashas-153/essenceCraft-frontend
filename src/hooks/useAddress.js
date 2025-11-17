import { useState, useEffect, useCallback } from 'react';
import { addressAPI } from '@/services/api';

/**
 * Custom hook for managing user addresses
 * @returns {Object} Address methods and state
 */
const useAddress = () => {
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
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    console.log('🟡 [getAccessToken] Token found:', !!token);
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
      const data = await addressAPI.getAddresses(addressType);
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
  }, [selectedAddressId]);

  /**
   * Fetch address statistics
   */
  const fetchStatistics = useCallback(async () => {
    try {
      // For now, calculate statistics from addresses array
      // You can implement a dedicated API endpoint later
      const totalAddresses = addresses.length;
      const shippingCount = addresses.filter(addr => addr.address_type === 'shipping').length;
      const billingCount = addresses.filter(addr => addr.address_type === 'billing').length;
      
      const stats = {
        total_addresses: totalAddresses,
        shipping_addresses: shippingCount,
        billing_addresses: billingCount
      };
      
      setStatistics(stats);
      return stats;

    } catch (err) {
      console.error('Error fetching statistics:', err);
      throw err;
    }
  }, [addresses]);

  /**
   * Fetch single address by ID
   */
  const fetchAddressById = useCallback(async (addressId) => {
    setIsLoading(true);
    setError(null);

    try {
      const address = await addressAPI.getAddressById(addressId);
      return address;

    } catch (err) {
      console.error('Error fetching address:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch default address by type
   */
  const fetchDefaultAddress = useCallback(async (addressType) => {
    try {
      const defaultAddress = await addressAPI.getDefaultAddress(addressType);
      return defaultAddress;

    } catch (err) {
      if (err.message.includes('404')) {
        return null; // No default address set
      }
      console.error(`Error fetching default ${addressType} address:`, err);
      throw err;
    }
  }, []);

  /**
   * Create new address
   */
  const createAddress = useCallback(async (addressData) => {
    console.log('🔵 [useAddress.createAddress] Starting address creation');
    console.log('🔵 [useAddress.createAddress] Received data:', addressData);
    setIsLoading(true);
    setError(null);

    try {
      const newAddress = await addressAPI.createAddress(addressData);
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
  }, [fetchAddresses]);

  /**
   * Update existing address
   */
  const updateAddress = useCallback(async (addressId, updateData) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedAddress = await addressAPI.updateAddress(addressId, updateData);
      
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
  }, [fetchAddresses]);

  /**
   * Delete address
   */
  const deleteAddress = useCallback(async (addressId) => {
    setIsLoading(true);
    setError(null);

    try {
      await addressAPI.deleteAddress(addressId);

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
  }, [selectedAddressId, fetchAddresses]);

  /**
   * Set address as default
   */
  const setAsDefault = useCallback(async (addressId) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedAddress = await addressAPI.setAsDefault(addressId);
      
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
  }, [fetchAddresses]);

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
        const authTokens = localStorage.getItem('auth_tokens');
        const token = authTokens ? JSON.parse(authTokens).access_token : null;
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