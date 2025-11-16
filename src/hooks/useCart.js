import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { cartAPI } from '@/services/api';

// Create Cart Context
const CartContext = createContext();

/**
 * Cart Provider Component
 * Wrap your app with this to provide cart state globally
 */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartAPI.getCart();
      setCart(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (productId, quantity = 1) => {
    try {
      setError(null);
      await cartAPI.addItem(productId, quantity);
      await fetchCart(); // Refresh cart after adding
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to add item to cart');
      return { success: false, error: err.message };
    }
  }, [fetchCart]);

  const updateItem = useCallback(async (itemId, quantity) => {
    try {
      setError(null);
      await cartAPI.updateItem(itemId, quantity);
      await fetchCart(); // Refresh cart after updating
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to update item');
      return { success: false, error: err.message };
    }
  }, [fetchCart]);

  const removeItem = useCallback(async (itemId) => {
    try {
      setError(null);
      await cartAPI.removeItem(itemId);
      await fetchCart(); // Refresh cart after removing
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to remove item');
      return { success: false, error: err.message };
    }
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    try {
      setError(null);
      await cartAPI.clearCart();
      setCart({ items: [] }); // Clear local cart state
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to clear cart');
      return { success: false, error: err.message };
    }
  }, []);

  // Calculate cart totals
  const cartTotals = useCallback(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        subtotal: 0,
        itemCount: 0,
        items: [],
      };
    }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
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
    addItem,
    updateItem,
    removeItem,
    clearCart,
    fetchCart,
    cartTotals: cartTotals(),
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