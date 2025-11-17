import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, ArrowLeft, ShoppingBag, LogIn, MapPin, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import CartItems from '../components/cart/CartItems';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';
import AddressModal from '@/components/checkout/AddressModal';
import useAddress from '@/hooks/useAddress';

const Cart = () => {
  const { cart, loading, error, cartTotals, fetchCart, isLocalCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  // Address hook
  const address = useAddress();
  const isLoggedIn = searchParams.get('loggedin') === 'true' && isAuthenticated;

  // Load addresses if logged in
  useEffect(() => {
    if (isLoggedIn) {
      address.fetchAddresses().catch(err => console.error('Error loading addresses:', err));
    }
  }, [isLoggedIn]);

  const handleItemUpdate = async () => {
    setIsUpdating(true);
    await fetchCart();
    setIsUpdating(false);
  };

  console.log("Cart component cart data:", cart);
  console.log("Is local cart:", isLocalCart);
  console.log("Is authenticated:", isAuthenticated);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Check if cart is empty - handle various empty states
  const isEmpty = !cart || !cart.items || !Array.isArray(cart.items) || cart.items.length === 0;

  if (isEmpty) {
    return <EmptyCart />;
  }

  // Ensure cartTotals has default values
  const safeCartTotals = {
    itemCount: cartTotals?.itemCount || 0,
    subtotal: cartTotals?.subtotal || 0,
    items: cartTotals?.items || []
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-stone-900">
                Shopping <span className="font-semibold">Cart</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-sm">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <span className="font-semibold text-emerald-900">
                {safeCartTotals.itemCount} {safeCartTotals.itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Not logged in warning */}
      {isLocalCart && !isAuthenticated && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <LogIn className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-amber-900 font-medium">Sign in to checkout</p>
                  <p className="text-amber-700 text-sm">
                    You're viewing items in your browser. Sign in to your account to proceed with checkout.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="border-amber-600 text-amber-600 hover:bg-amber-100"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items - 2 columns */}
            <div className="lg:col-span-2">
              <CartItems items={cart.items} onItemUpdate={handleItemUpdate} />
            </div>

            {/* Order summary - 1 column */}
            <div className="lg:col-span-1">
              <CartSummary cartTotals={safeCartTotals} isLocalCart={isLocalCart} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;