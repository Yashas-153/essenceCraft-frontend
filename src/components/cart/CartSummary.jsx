import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Tag, ArrowRight, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ToastContainer } from '@/components/ui/toast';

const CartSummary = ({ cartTotals, userDetails, selectedAddressId, isLocalCart = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currency } = useCart();
  const { toast, toasts, dismiss } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Get currency symbol
  const currencySymbol = currency?.symbol || '$';

  console.log('💱 CartSummary Currency:', { currency, currencySymbol });

  // Calculate totals
  const subtotal = cartTotals.subtotal;
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over ₹50
  const tax = subtotal * 0.08; // 8% tax (example)
  const discount = promoApplied ? promoDiscount : 0;
  const total = subtotal + shipping + tax - discount;

  const handleApplyPromo = () => {
    // TODO: Implement promo code validation with backend
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setPromoApplied(true);
      setPromoDiscount(subtotal * 0.1); // 10% off
      toast({
        title: 'Promo code applied!',
        description: '10% discount has been applied to your order.',
        variant: 'success'
      });
    } else {
      toast({
        title: 'Invalid promo code',
        description: 'The promo code you entered is not valid.',
        variant: 'destructive'
      });
    }
  };

  const handleCheckout = async () => {
    // If user is not logged in, redirect to login
    if (!isAuthenticated && isLocalCart) {
      toast({
        title: 'Login required',
        description: 'Please login or sign up to proceed with checkout.',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    if (!userDetails || !userDetails.email) {
      toast({
        title: 'Login required',
        description: 'Please login to complete your purchase.',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    if (cartTotals.itemCount === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add some items to your cart before checkout.',
        variant: 'destructive'
      });
      return;
    }

    // Navigate to checkout page
    navigate('/checkout');
  };

  return (
    <>
      <div className="bg-white rounded-sm shadow-md border border-stone-100 sticky top-6">
      {/* Header */}
      <div className="border-b border-stone-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-stone-900">Order Summary</h2>
      </div>

      {/* Summary details */}
      <div className="p-6 space-y-4">
        {/* Items count */}
        <div className="flex items-center justify-between text-stone-600">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Items ({cartTotals.itemCount})</span>
          </div>
          <span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span>
        </div>

        {/* Promo code */}
        <div className="pt-4 border-t border-stone-200">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Promo Code
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              disabled={promoApplied}
              className="flex-1"
            />
            <Button
              onClick={handleApplyPromo}
              disabled={!promoCode || promoApplied}
              variant="outline"
              className="border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50"
            >
              Apply
            </Button>
          </div>
          {promoApplied && (
            <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Promo code applied!
            </p>
          )}
        </div>

        {/* Cost breakdown */}
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>{currencySymbol}{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-stone-600">
            <div className="flex items-center gap-1">
              <span>Shipping</span>
              {shipping === 0 && (
                <span className="text-xs text-emerald-600 font-medium">(Free)</span>
              )}
            </div>
            <span>{shipping === 0 ? 'FREE' : `${currencySymbol}${shipping.toFixed(2)}`}</span>
          </div>

          {shipping > 0 && (
            <p className="text-xs text-stone-500">
              Add {currencySymbol}{(50 - subtotal).toFixed(2)} more for free shipping
            </p>
          )}

          <div className="flex justify-between text-stone-600">
            <span>Tax (8%)</span>
            <span>{currencySymbol}{tax.toFixed(2)}</span>
          </div>

          {promoApplied && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount</span>
              <span>-{currencySymbol}{discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="pt-4 border-t-2 border-stone-300">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-lg font-semibold text-stone-900">Total</span>
            <span className="text-3xl font-bold text-emerald-700">
              {currencySymbol}{total.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Including all taxes and fees
          </p>
        </div>

        {/* Error message - removed since checkout moved to separate page */}

        {/* Not logged in warning */}
        {isLocalCart && !isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-900 font-medium text-sm mb-2">
                  Sign in to proceed with checkout
                </p>
                <p className="text-blue-700 text-xs mb-3">
                  Your items are saved in your browser. Sign in to your account to securely complete your purchase.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Checkout button - different based on auth status */}
        {isLocalCart && !isAuthenticated ? (
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-14 text-lg rounded-sm shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Sign In to Checkout
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleCheckout}
            disabled={cartTotals.itemCount === 0}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-14 text-lg rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}

        {/* Security message */}
        <div className="flex items-center justify-center gap-2 text-stone-500 text-sm pt-2">
          <Lock className="w-4 h-4" />
          <span>Secure checkout powered by Razorpay</span>
        </div>

        {/* Additional info */}
        <div className="pt-4 border-t border-stone-200 space-y-2 text-sm text-stone-600">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5"></div>
            <span>Free shipping on orders over $50</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5"></div>
            <span>30-day return policy</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5"></div>
            <span>100% satisfaction guarantee</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5"></div>
            <span>All payment methods accepted</span>
          </div>
        </div>
      </div>
    </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={dismiss} />
    </>
  );
};

export default CartSummary;