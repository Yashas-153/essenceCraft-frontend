// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

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
    return fetchAPI('/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  /**
   * Add item to cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   */
  addItem: async (productId, quantity = 1) => {
    return fetchAPI('/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',   // ← REQUIRED
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
    return fetchAPI(`/cart/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
    return fetchAPI(`/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  /**
   * Clear entire cart
   */
  clearCart: async () => {
    return fetchAPI('/cart', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
};

// Authentication API endpoints
export const authAPI = {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   */
  login: async (email, password) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Register new user (if you have signup endpoint)
   * @param {Object} userData - User registration data
   */
  register: async (userData) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    return fetchAPI('/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  },

  /**
   * Refresh authentication token
   * @param {string} refreshToken - Refresh token
   */
  refreshToken: async (refreshToken) => {
    return fetchAPI('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  /**
   * Logout user
   */
  logout: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetchAPI('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Clear local storage regardless of API call success
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};

export default fetchAPI;