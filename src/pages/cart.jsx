import React from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import CartItems from '../components/cart/CartItems';
import CartSummary from '../components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';

const Cart = () => {
  const { cart, loading, error, cartTotals } = useCart();
  const navigate = useNavigate();

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

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-stone-900 mb-4">Error Loading Cart</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/products')} className="bg-emerald-700 hover:bg-emerald-800">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  if (isEmpty) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/products')}
                className="flex items-center text-stone-600 hover:text-emerald-700 transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </button>
              <h1 className="text-3xl md:text-4xl font-light text-stone-900">
                Shopping <span className="font-semibold">Cart</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-sm">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <span className="font-semibold text-emerald-900">
                {cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cart content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items - 2 columns */}
            <div className="lg:col-span-2">
              <CartItems items={cart.items} />
            </div>

            {/* Order summary - 1 column */}
            <div className="lg:col-span-1">
              <CartSummary cartTotals={cartTotals} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;