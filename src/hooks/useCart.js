import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { cartAPI } from '@/services/api';
import { useAuth } from './useAuth';

// Create Cart Context
const CartContext = createContext();

// Local storage key
const LOCAL_CART_KEY = 'essence_craft_local_cart';
const BACKEND_CART_SYNCED = 'essence_craft_cart_synced';

/**
 * Cart Provider Component
 * Wrap your app with this to provide cart state globally
 */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLocalCart, setIsLocalCart] = useState(false);
  const [currency, setCurrency] = useState({
    type: 'USD',
    symbol: '$'
  });
  const { isAuthenticated, user } = useAuth();

  // Load cart on mount
  useEffect(() => {
    initializeCart();
  }, []);

  // Sync local cart to backend when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      syncLocalCartToBackend();
    }
  }, [isAuthenticated, user]);

  /**
   * Initialize cart - load from local storage if not logged in, from backend if logged in
   */
  const initializeCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const authTokens = localStorage.getItem('auth_tokens');
      const token = authTokens ? JSON.parse(authTokens).access_token : null;

      if (token) {
        // User is logged in - fetch from backend
        console.log('📦 Loading cart from backend');
        const data = await cartAPI.getCart();
        setCart(data || { items: [] });
        
        // Extract and set currency information
        if (data?.currency_type && data?.currency_symbol) {
          console.log('💱 Setting currency:', { type: data.currency_type, symbol: data.currency_symbol });
          setCurrency({
            type: data.currency_type,
            symbol: data.currency_symbol
          });
        }
        
        setIsLocalCart(false);
        localStorage.setItem(BACKEND_CART_SYNCED, 'true');
      } else {
        // User is not logged in - load from local storage
        console.log('📦 Loading cart from local storage');
        const localCart = localStorage.getItem(LOCAL_CART_KEY);
        if (localCart) {
          setCart(JSON.parse(localCart));
        } else {
          setCart({ items: [] });
        }
        setIsLocalCart(true);
        // Use default currency for local cart
        setCurrency({
          type: 'INR',
          symbol: '₹'
        });
      }
    } catch (err) {
      console.error('Error initializing cart:', err);
      // If backend fetch fails, try local storage as fallback
      const localCart = localStorage.getItem(LOCAL_CART_KEY);
      setCart(localCart ? JSON.parse(localCart) : { items: [] });
      setIsLocalCart(true);
      setCurrency({
        type: 'INR',
        symbol: '₹'
      });
      setError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sync local cart items to backend when user logs in
   */
  const syncLocalCartToBackend = useCallback(async () => {
    try {
      const localCart = localStorage.getItem(LOCAL_CART_KEY);
      
      if (!localCart) {
        console.log('📦 No local cart to sync');
        return;
      }

      const parsedLocalCart = JSON.parse(localCart);
      
      if (!parsedLocalCart.items || parsedLocalCart.items.length === 0) {
        console.log('📦 Local cart is empty, nothing to sync');
        localStorage.removeItem(LOCAL_CART_KEY);
        return;
      }

      console.log('📦 Syncing local cart to backend:', parsedLocalCart);

      // Add each local cart item to backend
      for (const item of parsedLocalCart.items) {
        try {
          await cartAPI.addItem(item.product_id, item.quantity);
          console.log(`✅ Synced item: ${item.product_id} (qty: ${item.quantity})`);
        } catch (err) {
          console.error(`❌ Failed to sync item ${item.product_id}:`, err);
        }
      }

      // Refresh cart from backend
      const backendCart = await cartAPI.getCart();
      setCart(backendCart || { items: [] });
      setIsLocalCart(false);

      // Clear local cart
      localStorage.removeItem(LOCAL_CART_KEY);
      localStorage.setItem(BACKEND_CART_SYNCED, 'true');

      console.log('📦 Cart sync completed');
    } catch (err) {
      console.error('Error syncing cart:', err);
      setError('Failed to sync cart with your account');
    }
  }, []);

  /**
   * Fetch cart from backend
   */
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const authTokens = localStorage.getItem('auth_tokens');
      const token = authTokens ? JSON.parse(authTokens).access_token : null;

      if (token) {
        // Fetch from backend
        const data = await cartAPI.getCart();
        setCart(data || { items: [] });
        
        // Extract and set currency information
        if (data?.currency_type && data?.currency_symbol) {
          console.log('💱 Updating currency:', { type: data.currency_type, symbol: data.currency_symbol });
          setCurrency({
            type: data.currency_type,
            symbol: data.currency_symbol
          });
        }
        
        setIsLocalCart(false);
      } else {
        // Load from local storage
        const localCart = localStorage.getItem(LOCAL_CART_KEY);
        setCart(localCart ? JSON.parse(localCart) : { items: [] });
        setIsLocalCart(true);
        setCurrency({
          type: 'INR',
          symbol: '₹'
        });
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message || 'Failed to fetch cart');
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add item to cart (local or backend)
   */
  const addItem = useCallback(async (productId, quantity = 1, productData = null) => {
    try {
      setError(null);
      const authTokens = localStorage.getItem('auth_tokens');
      const token = authTokens ? JSON.parse(authTokens).access_token : null;

      if (token) {
        // Add to backend
        await cartAPI.addItem(productId, quantity);
        await fetchCart();
      } else {
        // Add to local cart
        const localCart = localStorage.getItem(LOCAL_CART_KEY);
        const cart = localCart ? JSON.parse(localCart) : { items: [] };

        const existingItem = cart.items.find(item => item.product_id === productId);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({
            product_id: productId,
            quantity: quantity,
            product: productData || { id: productId, price: 0 }
          });
        }

        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
        setCart(cart);
        setIsLocalCart(true);
      }

      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to add item to cart');
      return { success: false, error: err.message };
    }
  }, [fetchCart]);

  /**
   * Update item quantity (local or backend)
   */
  const updateItem = useCallback(async (itemId, quantity) => {
    try {
      setError(null);
      const authTokens = localStorage.getItem('auth_tokens');
      const token = authTokens ? JSON.parse(authTokens).access_token : null;

      if (token) {
        // Update in backend
        await cartAPI.updateItem(itemId, quantity);
        await fetchCart();
      } else {
        // Update in local cart
        const localCart = localStorage.getItem(LOCAL_CART_KEY);
        const cart = localCart ? JSON.parse(localCart) : { items: [] };

        const item = cart.items.find(item => item.product_id === itemId);
        if (item) {
          item.quantity = quantity;
          localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
          setCart(cart);
          setIsLocalCart(true);
        }
      }

      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to update item');
      return { success: false, error: err.message };
    }
  }, [fetchCart]);

  /**
   * Remove item from cart (local or backend)
   */
  const removeItem = useCallback(async (itemId) => {
    try {
      setError(null);
      const authTokens = localStorage.getItem('auth_tokens');
      const token = authTokens ? JSON.parse(authTokens).access_token : null;

      if (token) {
        // Remove from backend
        await cartAPI.removeItem(itemId);
        await fetchCart();
      } else {
        // Remove from local cart
        const localCart = localStorage.getItem(LOCAL_CART_KEY);
        const cart = localCart ? JSON.parse(localCart) : { items: [] };

        cart.items = cart.items.filter(item => item.product_id !== itemId);
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
        setCart(cart);
        setIsLocalCart(true);
      }

      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to remove item');
      return { success: false, error: err.message };
    }
  }, [fetchCart]);

  /**
   * Clear cart (local or backend)
   */
  const clearCart = useCallback(async () => {
    try {
      setError(null);
      const authTokens = localStorage.getItem('auth_tokens');
      const token = authTokens ? JSON.parse(authTokens).access_token : null;

      if (token) {
        // Clear backend cart
        await cartAPI.clearCart();
      }

      // Clear local cart
      localStorage.removeItem(LOCAL_CART_KEY);
      setCart({ items: [] });
      setIsLocalCart(false);

      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to clear cart');
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Calculate cart totals
   */
  const calculateCartTotals = useCallback(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        subtotal: 0,
        itemCount: 0,
        items: [],
      };
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);

    const itemCount = cart.items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    return {
      subtotal: subtotal,
      itemCount: itemCount,
      items: cart.items,
    };
  }, [cart]);

  const value = {
    cart,
    loading,
    error,
    isLocalCart,
    currency,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    fetchCart,
    syncLocalCartToBackend,
    cartTotals: calculateCartTotals(),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Custom hook to use cart context
 * @returns Cart context value
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};