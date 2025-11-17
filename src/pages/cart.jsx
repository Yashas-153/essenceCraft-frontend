import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, ArrowLeft, ShoppingBag, LogIn, ArrowRight, Lock, Tag, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import CartItems from '../components/cart/CartItems';
import EmptyCart from '../components/cart/EmptyCart';
import { useToast } from '@/components/ui/use-toast';
import { ToastContainer } from '@/components/ui/toast';

const Cart = () => {
  const { cart, loading, error, cartTotals, fetchCart, isLocalCart, currency } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isUpdating, setIsUpdating] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const { toast, toasts, dismiss } = useToast();
  
  const isLoggedIn = searchParams.get('loggedin') === 'true' && isAuthenticated;

  const handleItemUpdate = async () => {
    setIsUpdating(true);
    await fetchCart();
    setIsUpdating(false);
  };

  // Promo code handler
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setPromoApplied(true);
      setPromoDiscount(safeCartTotals.subtotal * 0.1);
      toast({
        title: 'Promo code applied!',
        description: '10% discount applied to your order.',
        variant: 'success'
      });
    } else {
      toast({
        title: 'Invalid promo code',
        description: 'Please check your promo code and try again.',
        variant: 'destructive'
      });
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated && isLocalCart) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

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

  // Calculate totals with promo
  const shipping = safeCartTotals.subtotal > 50 ? 0 : 5.99;
  const tax = safeCartTotals.subtotal * 0.08;
  const discount = promoApplied ? promoDiscount : 0;
  const finalTotal = safeCartTotals.subtotal + shipping + tax - discount;
  const currencySymbol = currency?.symbol || '$';

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
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items - 2 columns */}
            <div className="lg:col-span-2">
              <CartItems items={cart.items} onItemUpdate={handleItemUpdate} />
              
              {/* Wishlist suggestion - Myntra style */}
              <div className="mt-6 p-4 bg-white rounded-lg border border-stone-200">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <h3 className="font-semibold text-stone-900">Items you might like</h3>
                </div>
                <p className="text-stone-600 text-sm">
                  Continue shopping to discover more products you'll love
                </p>
                <Button
                  onClick={() => navigate('/products')}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>

            {/* Order summary - 1 column - Myntra style */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-stone-200 sticky top-6">
                <div className="p-6 border-b border-stone-200">
                  <h2 className="text-lg font-semibold text-stone-900">Price Details</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Promo Code */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Apply Coupon
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter coupon code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        disabled={promoApplied}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleApplyPromo}
                        disabled={!promoCode || promoApplied}
                        variant="outline"
                        className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                      >
                        Apply
                      </Button>
                    </div>
                    {promoApplied && (
                      <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {promoCode} applied! You saved {currencySymbol}{promoDiscount.toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-3 pt-4 border-t border-stone-200">
                    <div className="flex justify-between">
                      <span className="text-stone-600">Price ({safeCartTotals.itemCount} item{safeCartTotals.itemCount !== 1 ? 's' : ''})</span>
                      <span className="font-medium">{currencySymbol}{safeCartTotals.subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-stone-600">Delivery Charges</span>
                      <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : ''}`}>
                        {shipping === 0 ? (
                          <>
                            <span className="line-through text-stone-400 mr-2">{currencySymbol}5.99</span>
                            FREE
                          </>
                        ) : (
                          `${currencySymbol}${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    {shipping > 0 && (
                      <p className="text-xs text-emerald-600">
                        Add {currencySymbol}{(50 - safeCartTotals.subtotal).toFixed(2)} more for free delivery
                      </p>
                    )}

                    <div className="flex justify-between">
                      <span className="text-stone-600">Tax</span>
                      <span className="font-medium">{currencySymbol}{tax.toFixed(2)}</span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount</span>
                        <span className="font-medium">-{currencySymbol}{discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t-2 border-stone-300">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-lg font-semibold text-stone-900">Total Amount</span>
                      <span className="text-xl font-bold text-stone-900">
                        {currencySymbol}{finalTotal.toFixed(2)}
                      </span>
                    </div>
                    {promoApplied && (
                      <p className="text-sm text-emerald-600 mb-4">
                        You will save {currencySymbol}{discount.toFixed(2)} on this order
                      </p>
                    )}
                  </div>

                  {/* Not logged in warning */}
                  {isLocalCart && !isAuthenticated && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <div className="flex gap-2">
                        <LogIn className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <div>
                          <p className="text-amber-900 font-medium text-sm mb-1">
                            Login for Best Experience
                          </p>
                          <p className="text-amber-700 text-xs">
                            Get access to your Orders, Wishlist and Recommendations
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Checkout button */}
                  {isLocalCart && !isAuthenticated ? (
                    <Button
                      onClick={() => navigate('/login')}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12 text-lg"
                    >
                      Login & Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCheckout}
                      disabled={safeCartTotals.itemCount === 0}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12 text-lg"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}

                  {/* Security & Policies */}
                  <div className="pt-4 border-t border-stone-200 space-y-2">
                    <div className="flex items-center justify-center gap-2 text-stone-500 text-sm">
                      <Lock className="w-4 h-4" />
                      <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={dismiss} />
    </div>
  );
};

export default Cart;