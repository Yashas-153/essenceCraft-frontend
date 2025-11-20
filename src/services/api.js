// Base API configuration
const BASE_URL = process.env.REACT_API_APP_URL || 'http://localhost:8000'
const API_BASE_URL = `${BASE_URL}/api/v1`;
// Generic fetch wrapper with error handling
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('📡 [fetchAPI] Making request to:', fullUrl);
    console.log('📡 [fetchAPI] Method:', options.method || 'GET');
    
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    console.log('📡 [fetchAPI] Response status:', response.status);
    console.log('📡 [fetchAPI] Response ok:', response.ok);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('📡 [fetchAPI] Error response:', error);
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📡 [fetchAPI] Response data:', data);
    return data;
  } catch (error) {
    console.error('📡 [fetchAPI] Catch error:', error);
    throw error;
  }
};

// Product API endpoints
export const productsAPI = {
  /**
   * Get all products with optional filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.search - Search query
   * @param {number} params.min_price - Minimum price filter
   * @param {number} params.max_price - Maximum price filter
   */
  getAllProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.min_price) queryParams.append('min_price', params.min_price);
    if (params.max_price) queryParams.append('max_price', params.max_price);

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return fetchAPI(endpoint);
  },

  /**
   * Get single product by ID
   * @param {number} productId - Product ID
   */
  getProductById: async (productId) => {
    console.log('📦 [productsAPI.getProductById] Fetching product with ID:', productId);
    try {
      const data = await fetchAPI(`/products/${productId}`);
      console.log('📦 [productsAPI.getProductById] Product fetched:', data);
      return data;
    } catch (error) {
      console.error('📦 [productsAPI.getProductById] Failed to fetch product:', error);
      throw error;
    }
  },
};

export const cartAPI = {
  /**
   * Get user's cart with all items
   * @returns {Promise} Cart object with items
   */
  getCart: async () => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }

    return fetchAPI('/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Add item to cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   */
  addItem: async (productId, quantity = 1) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }

    return fetchAPI('/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',   // ← REQUIRED
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
      }),
    });
  },


  /**
   * Update cart item quantity
   * @param {number} itemId - Cart item ID
   * @param {number} quantity - New quantity
   */
  updateItem: async (itemId, quantity) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }

    return fetchAPI(`/cart/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        quantity: quantity,
      }),
    });
  },

  /**
   * Remove item from cart
   * @param {number} itemId - Cart item ID
   */
  removeItem: async (itemId) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }

    return fetchAPI(`/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Clear entire cart
   */
  clearCart: async () => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }

    return fetchAPI('/cart', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Authentication API endpoints - using API_BASE_URL + /auth/*
export const authAPI = {
  /**
   * Register new user
   * @param {string} email - User email
   * @param {string} firstName - User first name
   * @param {string} lastName - User last name
   * @param {string} password - User password
   */
  register: async (email, firstName, lastName, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Registration failed');
    }

    return response.json();
  },

  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   */
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Login failed');
    }

    return response.json();
  },

  /**
   * Verify email with token
   * @param {string} token - Email verification token
   */
  verifyEmail: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Email verification failed');
    }

    return response.json();
  },

  /**
   * Add phone number and request OTP
   * @param {string} phone - Phone number
   * @param {string} accessToken - Access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  addPhone: async (phone, accessToken, tokenType = 'bearer') => {
    const response = await fetch(`${API_BASE_URL}/auth/add-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${tokenType} ${accessToken}`,
      },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to send OTP');
    }

    return response.json();
  },

  /**
   * Verify phone with OTP
   * @param {string} phone - Phone number
   * @param {string} otp - OTP code
   * @param {string} accessToken - Access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  verifyPhone: async (phone, otp, accessToken, tokenType = 'bearer') => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${tokenType} ${accessToken}`,
      },
      body: JSON.stringify({ phone, otp }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Phone verification failed');
    }

    return response.json();
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   */
  refreshToken: async (refreshToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Token refresh failed');
    }

    return response.json();
  },

  /**
   * Get current user profile
   * @param {string} accessToken - Access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  getCurrentUser: async (accessToken, tokenType = 'bearer') => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `${tokenType} ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to fetch user');
    }

    return response.json();
  },

  /**
   * Logout user
   * @param {string} accessToken - Access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  logout: async (accessToken, tokenType = 'bearer') => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `${tokenType} ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Logout failed');
    }

    return response.json();
  },

  /**
   * Request OTP for phone signup
   * @param {string} phone - Phone number
   */
  phoneSignup: async (phone) => {
    const response = await fetch(`${API_BASE_URL}/auth/phone-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to send OTP');
    }

    return response.json();
  },

  /**
   * Verify OTP for phone signup/login
   * @param {string} phone - Phone number
   * @param {string} otp - OTP code
   */
  verifyOTP: async (phone, otp) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'OTP verification failed');
    }

    return response.json();
  },

  /**
   * Complete profile after OTP verification
   * @param {Object} profileData - Profile data
   */
  completeProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Profile completion failed');
    }

    return response.json();
  },
};

// Admin API endpoints - requires admin authentication
export const adminAPI = {
  /**
   * Make user admin
   * @param {string} email - User email to make admin
   * @param {string} accessToken - Admin access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  makeUserAdmin: async (email, accessToken, tokenType = 'bearer') => {
    const response = await fetch(`${API_BASE_URL}/admin/make-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${tokenType} ${accessToken}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to make user admin');
    }

    return response.json();
  },

  /**
   * Create product (Admin)
   * @param {Object} productData - Product data
   * @param {string} accessToken - Admin access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  createProduct: async (productData, accessToken, tokenType = 'bearer') => {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${tokenType} ${accessToken}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to create product');
    }

    return response.json();
  },

  /**
   * Update product (Admin)
   * @param {number} productId - Product ID
   * @param {Object} productData - Product data to update
   * @param {string} accessToken - Admin access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  updateProduct: async (productId, productData, accessToken, tokenType = 'bearer') => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${tokenType} ${accessToken}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to update product');
    }

    return response.json();
  },

  /**
   * Delete product (Admin)
   * @param {number} productId - Product ID
   * @param {string} accessToken - Admin access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  deleteProduct: async (productId, accessToken, tokenType = 'bearer') => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `${tokenType} ${accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to delete product');
    }

    return response.json();
  },

  /**
   * Get all products (Admin) - includes inactive products
   * @param {Object} params - Query parameters
   * @param {string} accessToken - Admin access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  getAllProducts: async (params = {}, accessToken, tokenType = 'bearer') => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.min_price) queryParams.append('min_price', params.min_price);
    if (params.max_price) queryParams.append('max_price', params.max_price);

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/admin/products${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `${tokenType} ${accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to fetch products');
    }

    return response.json();
  },

  /**
   * Get all orders (Admin)
   * @param {Object} params - Query parameters
   * @param {string} accessToken - Admin access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  getAllOrders: async (params = {}, accessToken, tokenType = 'bearer') => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/admin/orders${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `${tokenType} ${accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to fetch orders');
    }

    return response.json();
  },

  /**
   * Update order status (Admin)
   * @param {number} orderId - Order ID
   * @param {string} status - New order status
   * @param {string} accessToken - Admin access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  updateOrderStatus: async (orderId, status, accessToken, tokenType = 'bearer') => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${tokenType} ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to update order status');
    }

    return response.json();
  },

  /**
   * Get all users (Admin)
   * @param {Object} params - Query parameters
   * @param {string} accessToken - Admin access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  getAllUsers: async (params = {}, accessToken, tokenType = 'bearer') => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/admin/users${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `${tokenType} ${accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to fetch users');
    }

    return response.json();
  },

  /**
   * Get user by ID (Admin)
   * @param {number} userId - User ID
   * @param {string} accessToken - Admin access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  getUserById: async (userId, accessToken, tokenType = 'bearer') => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: {
        'Authorization': `${tokenType} ${accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to fetch user');
    }

    return response.json();
  },

  /**
   * Get analytics (Admin)
   * @param {string} accessToken - Admin access token
   * @param {string} tokenType - Token type (default: 'bearer')
   */
  getAnalytics: async (accessToken, tokenType = 'bearer') => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
      headers: {
        'Authorization': `${tokenType} ${accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to fetch analytics');
    }

    return response.json();
  },
};

// Address API endpoints
export const addressAPI = {
  /**
   * Get all user addresses
   * @param {string} addressType - Optional address type filter (shipping/billing)
   */
  getAddresses: async (addressType = null) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    const endpoint = addressType 
      ? `/users/me/addresses?address_type=${addressType}`
      : '/users/me/addresses';
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Get single address by ID
   * @param {number} addressId - Address ID
   */
  getAddressById: async (addressId) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI(`/users/me/addresses/${addressId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Create new address
   * @param {Object} addressData - Address data
   */
  createAddress: async (addressData) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI('/users/me/addresses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    });
  },

  /**
   * Update existing address
   * @param {number} addressId - Address ID
   * @param {Object} updateData - Updated address data
   */
  updateAddress: async (addressId, updateData) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI(`/users/me/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Delete address
   * @param {number} addressId - Address ID
   */
  deleteAddress: async (addressId) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI(`/users/me/addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Set address as default
   * @param {number} addressId - Address ID
   */
  setAsDefault: async (addressId) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI(`/users/me/addresses/${addressId}/set-default`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Get default address by type
   * @param {string} addressType - Address type (shipping/billing)
   */
  getDefaultAddress: async (addressType) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI(`/users/me/addresses/default/${addressType}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Shiprocket API endpoints
export const shiprocketAPI = {
  // Order Management
  createOrder: async (orderData) => {
    const token = authAPI.getStoredToken();
    return fetchAPI('/shiprocket/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
  },

  getOrder: async (orderId) => {
    const token = authAPI.getStoredToken();
    return fetchAPI(`/shiprocket/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  cancelOrders: async (data) => {
    const token = authAPI.getStoredToken();
    return fetchAPI('/shiprocket/orders/cancel', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  // Courier Management
  checkServiceability: async (data) => {
    const token = authAPI.getStoredToken();
    return fetchAPI('/shiprocket/couriers/serviceability', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  getCouriers: async () => {
    const token = authAPI.getStoredToken();
    return fetchAPI('/shiprocket/couriers', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Shipment Management
  createShipment: async (data) => {
    const token = authAPI.getStoredToken();
    return fetchAPI('/shiprocket/shipments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  schedulePickup: async (shipmentId) => {
    const token = authAPI.getStoredToken();
    return fetchAPI(`/shiprocket/shipments/${shipmentId}/pickup`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  generateManifest: async (data) => {
    const token = authAPI.getStoredToken();
    return fetchAPI('/shiprocket/shipments/manifest', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  generateLabel: async (data) => {
    const token = authAPI.getStoredToken();
    return fetchAPI('/shiprocket/shipments/label', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  generateInvoice: async (data) => {
    const token = authAPI.getStoredToken();
    return fetchAPI('/shiprocket/orders/invoice', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  // Tracking
  trackByShipmentId: async (shipmentId) => {
    const token = authAPI.getStoredToken();
    return fetchAPI(`/shiprocket/tracking/shipment/${shipmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  trackByAwbCode: async (awbCode) => {
    const token = authAPI.getStoredToken();
    return fetchAPI(`/shiprocket/tracking/awb/${awbCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getUserShipments: async (params = {}) => {
    const token = authAPI.getStoredToken();
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/shiprocket/shipments?${queryString}` : '/shiprocket/shipments';
    
    return fetchAPI(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Returns & Exchanges
  createReturnOrder: async (data) => {
    const token = authAPI.getStoredToken();
    return fetchAPI('/shiprocket/returns', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  getReturnOrders: async (params = {}) => {
    const token = authAPI.getStoredToken();
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/shiprocket/returns?${queryString}` : '/shiprocket/returns';
    
    return fetchAPI(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// User Profile API endpoints
export const userAPI = {
  /**
   * Get current user profile
   */
  getProfile: async () => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI('/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   */
  updateProfile: async (profileData) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI('/users/me', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
  },
};

// Order API endpoints
export const orderAPI = {
  /**
   * Get user orders with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10, max: 100)
   */
  getOrders: async (page = 1, limit = 10) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }

    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    return fetchAPI(`/orders?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Get single order by ID
   * @param {number} orderId - Order ID
   */
  getOrderById: async (orderId) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI(`/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Cancel order
   * @param {number} orderId - Order ID
   */
  cancelOrder: async (orderId) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI(`/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  /**
   * Get order invoice
   * @param {number} orderId - Order ID
   */
  getOrderInvoice: async (orderId) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI(`/orders/${orderId}/invoice`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Payment API endpoints
export const paymentAPI = {
  /**
   * Create payment intent
   * @param {number} orderId - Order ID
   * @param {string} paymentMethod - Payment method (credit_card, debit_card, upi, wallet, cod)
   */
  createPaymentIntent: async (orderId, paymentMethod) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI('/payments/create-intent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_method: paymentMethod,
      }),
    });
  },

  /**
   * Confirm payment
   * @param {string} paymentIntentId - Payment intent ID
   * @param {number} orderId - Order ID
   */
  confirmPayment: async (paymentIntentId, orderId) => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI('/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        payment_intent_id: paymentIntentId,
        order_id: orderId,
      }),
    });
  },

  /**
   * Get payment history/details for user
   */
  getPaymentHistory: async () => {
    const authTokens = localStorage.getItem('auth_tokens');
    const token = authTokens ? JSON.parse(authTokens).access_token : null;
    
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    
    return fetchAPI('/payments/history', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

export default fetchAPI;