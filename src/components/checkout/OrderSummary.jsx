import React from 'react';
import { ShoppingBag, MapPin } from 'lucide-react';

const OrderSummary = ({
  cartTotals = { subtotal: 0, itemCount: 0, items: [] },
  currencySymbol = '$',
  selectedAddressId = null,
  selectedAddress = null
}) => {
  // Calculate totals
  const subtotal = cartTotals.subtotal || 0;
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over ₹50
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-lg shadow-md border border-stone-100 sticky top-6">
      {/* Header */}
      <div className="border-b border-stone-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-stone-900">Order Summary</h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Items count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-600">
            <ShoppingBag className="w-4 h-4" />
            <span>Items ({cartTotals.itemCount})</span>
          </div>
          <span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span>
        </div>

        {/* Items list */}
        {cartTotals.items && cartTotals.items.length > 0 && (
          <div className="max-h-48 overflow-y-auto border-t border-stone-200 pt-4 space-y-2">
            {cartTotals.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div className="text-stone-600">
                  <p className="truncate">{item.product?.name || 'Product'}</p>
                  <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-stone-900 font-medium">
                  {currencySymbol}{((item.product?.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Cost breakdown */}
        <div className="border-t border-stone-200 pt-4 space-y-3">
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
        </div>

        {/* Total */}
        <div className="border-t-2 border-stone-300 pt-4">
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

        {/* Delivery address info */}
        {selectedAddressId && selectedAddress && (
          <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-stone-900">Delivery Address</p>
                <p className="text-stone-600 mt-2">
                  {selectedAddress.street_address || selectedAddress.street}
                </p>
                <p className="text-stone-600">
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}
                </p>
                <p className="text-stone-500 text-xs mt-2">
                  Estimated delivery: 3-5 business days
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="pt-4 border-t border-stone-200 space-y-2 text-sm text-stone-600">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>Free shipping on orders over ₹50</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>30-day return policy</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>100% satisfaction guarantee</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>Secure Razorpay payments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
