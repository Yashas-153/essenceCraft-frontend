import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Package, MapPin, CreditCard, CheckCircle2 } from 'lucide-react';

const OrderReview = ({
  cart,
  selectedAddress,
  paymentMethod,
  totals,
  onBack = () => {},
  onPlaceOrder = () => {},
  isProcessing = false
}) => {
  const paymentMethodNames = {
    upi: 'UPI',
    credit_card: 'Credit Card',
    debit_card: 'Debit Card',
    wallet: 'Digital Wallet',
    netbanking: 'Net Banking'
  };

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h2 className="text-2xl font-semibold text-stone-900 flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-700" />
          Review Your Order
        </h2>
        <p className="text-stone-600">
          Please review your order details before completing your purchase
        </p>
      </div>

      {/* Delivery Address */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-5 h-5 text-emerald-700 mt-0.5" />
          <div>
            <h3 className="font-semibold text-stone-900 mb-2">Delivery Address</h3>
            {selectedAddress ? (
              <div className="text-stone-700">
                <p className="font-medium">{selectedAddress.street_address || selectedAddress.street}</p>
                <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}</p>
                <p>{selectedAddress.country}</p>
              </div>
            ) : (
              <p className="text-stone-600">No address selected</p>
            )}
          </div>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="text-emerald-700 border-emerald-700 hover:bg-emerald-50"
        >
          Change Address
        </Button>
      </div>

      {/* Payment Method */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-emerald-700 mt-0.5" />
          <div>
            <h3 className="font-semibold text-stone-900 mb-2">Payment Method</h3>
            <p className="text-stone-700">
              {paymentMethodNames[paymentMethod] || paymentMethod}
            </p>
          </div>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="text-emerald-700 border-emerald-700 hover:bg-emerald-50"
        >
          Change Payment Method
        </Button>
      </div>

      {/* Order Items */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-5 h-5 text-emerald-700" />
          <h3 className="font-semibold text-stone-900">Order Items ({cart?.items?.length || 0})</h3>
        </div>
        
        <div className="space-y-4">
          {cart?.items?.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg">
              <img
                src={item.product.image_url || '/placeholder.png'}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-stone-900 mb-1">
                  {item.product.name}
                </p>
                <p className="text-sm text-stone-600">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm font-medium text-emerald-700 mt-2">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6">
        <h3 className="font-semibold text-stone-900 mb-4">Order Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-stone-700">
            <span>Subtotal</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-stone-700">
            <span>Shipping</span>
            <span>{totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-stone-700">
            <span>Tax</span>
            <span>${totals.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-emerald-700 pt-3 border-t-2 border-emerald-300">
            <span>Total</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          By placing this order, you agree to our{' '}
          <a href="/terms" className="underline font-medium">Terms & Conditions</a>
          {' '}and{' '}
          <a href="/privacy" className="underline font-medium">Privacy Policy</a>.
          Your payment information is securely processed by Razorpay.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          disabled={isProcessing}
          className="flex-1 border-stone-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Payment
        </Button>
        <Button
          onClick={onPlaceOrder}
          disabled={isProcessing}
          className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-3 text-lg disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Confirm & Pay ${totals.total.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OrderReview;