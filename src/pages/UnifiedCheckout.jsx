import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import useRazorpayPayment from '@/hooks/useRazorPayment';
import { useToast } from '@/components/ui/use-toast';
import { ToastContainer } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddressModal from '@/components/checkout/AddressModal';
import { 
  ArrowLeft, 
  Loader2, 
  MapPin, 
  Plus, 
  Check, 
  Edit3, 
  ShoppingBag,
  Tag,
  Lock,
  CreditCard,
  Smartphone,
  Wallet,
  Building,
  AlertCircle,
  X,
  Truck,
  Gift
} from 'lucide-react';

const UnifiedCheckout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cart, fetchCart, clearCart, currency } = useCart();
  const { initiateCheckout, retryPayment, isProcessing, error: paymentError } = useRazorpayPayment();
  const { toast, toasts, dismiss } = useToast();

  // State management
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [userDetails, setUserDetails] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Auth redirect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
  }, [isAuthenticated, navigate]);

  // Fetch data
  useEffect(() => {
    if (isAuthenticated) {
      fetchCheckoutData();
    }
  }, [isAuthenticated]);

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      const authTokens = localStorage.getItem('auth_tokens');
      const token = authTokens ? JSON.parse(authTokens).access_token : null;

      if (!token) {
        toast({
          title: 'Authentication required',
          description: 'Please login to continue.',
          variant: 'destructive'
        });
        return;
      }

      // Fetch cart
      await fetchCart();

      // Fetch addresses
      const addressResponse = await fetch(`${API_BASE_URL}/users/me/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (addressResponse.ok) {
        const addressData = await addressResponse.json();
        setAddresses(addressData);
        const defaultAddr = addressData.find(addr => addr.is_default);
        setSelectedAddressId(defaultAddr?.id || addressData[0]?.id);
      }

      // Fetch user details
      const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserDetails(userData);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching checkout data:', err);
      setLoading(false);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!cart?.items?.length) {
      return { subtotal: 0, shipping: 0, tax: 0, total: 0, itemCount: 0 };
    }

    const subtotal = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const discount = promoApplied ? promoDiscount : 0;
    const total = subtotal + shipping + tax - discount;
    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

    return { subtotal, shipping, tax, total, itemCount, discount };
  };

  const totals = calculateTotals();
  const currencySymbol = currency?.symbol || '$';

  // Payment methods
  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, description: 'PhonePe, GPay, Paytm & more' },
    { id: 'credit_card', name: 'Credit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
    { id: 'debit_card', name: 'Debit Card', icon: CreditCard, description: 'All major debit cards' },
    { id: 'wallet', name: 'Wallets', icon: Wallet, description: 'PayTm, PhonePe, Amazon Pay' },
    { id: 'netbanking', name: 'Net Banking', icon: Building, description: 'All major banks' }
  ];

  // Handlers
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setPromoApplied(true);
      setPromoDiscount(totals.subtotal * 0.1);
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

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoCode('');
    toast({
      title: 'Promo code removed',
      description: 'Discount has been removed from your order.',
      variant: 'success'
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast({
        title: 'Address required',
        description: 'Please select a delivery address.',
        variant: 'destructive'
      });
      return;
    }

    await initiateCheckout({
      shippingAddressId: selectedAddressId,
      cartItems: cart.items,
      userDetails: {
        name: `${userDetails.first_name} ${userDetails.last_name || ''}`,
        email: userDetails.email,
        phone: userDetails.phone,
        first_name: userDetails.first_name,
        last_name: userDetails.last_name
      },
      paymentMethod,
      onSuccess: async (verificationResult, order) => {
        toast({
          title: 'Payment successful!',
          description: 'Your order has been placed successfully.',
          variant: 'success'
        });
        await clearCart();
        setTimeout(() => {
          navigate(`/order-success/${order.id}`);
        }, 1500);
      },
      onFailure: (error, order) => {
        console.error('❌ Payment failed:', error);
        
        const errorMessage = error?.description || error?.message || 'Payment could not be processed.';
        const isCancelled = errorMessage.includes('cancelled');
        
        toast({
          title: isCancelled ? 'Payment Cancelled' : 'Payment Failed',
          description: (
            <div className="space-y-2">
              <p>{errorMessage}</p>
              {order && (
                <button
                  onClick={() => handleRetryPayment(order.id)}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  Retry Payment
                </button>
              )}
            </div>
          ),
          variant: 'destructive',
          duration: 10000,
        });
      }
    });
  };

  // Handle payment retry
  const handleRetryPayment = async (orderId) => {
    try {
      console.log('🔄 Retrying payment for order:', orderId);
      
      toast({
        title: 'Retrying payment...',
        description: 'Please wait while we prepare your payment.',
      });

      const paymentData = await retryPayment(orderId, paymentMethod);
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: paymentData.razorpay_key_id,
          amount: paymentData.amount * 100,
          currency: paymentData.currency,
          name: 'EssenceCraft',
          description: `Retry Payment - Order #${orderId}`,
          order_id: paymentData.order_id,
          prefill: {
            name: `${userDetails.first_name} ${userDetails.last_name || ''}`,
            email: userDetails.email,
            contact: userDetails.phone
          },
          theme: {
            color: '#15803d'
          },
          handler: async function (response) {
            try {
              const token = JSON.parse(localStorage.getItem('auth_tokens')).access_token;
              const verifyResponse = await fetch(`${API_BASE_URL}/payments/verify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: orderId
                })
              });

              if (verifyResponse.ok) {
                toast({
                  title: 'Payment successful!',
                  description: 'Your order has been placed successfully.',
                  variant: 'success'
                });

                await clearCart();
                setTimeout(() => {
                  navigate(`/order-success/${orderId}`);
                }, 1500);
              }
            } catch (error) {
              toast({
                title: 'Verification failed',
                description: 'Payment verification failed. Please contact support.',
                variant: 'destructive'
              });
            }
          },
          modal: {
            ondismiss: function () {
              toast({
                title: 'Payment cancelled',
                description: 'You can retry payment anytime from your orders page.',
                variant: 'destructive'
              });
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };

    } catch (error) {
      console.error('❌ Error retrying payment:', error);
      toast({
        title: 'Retry failed',
        description: error.message || 'Could not retry payment. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-700 animate-spin mx-auto mb-4" />
          <p className="text-stone-600 text-lg">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-lg shadow-lg max-w-md">
          <ShoppingBag className="w-16 h-16 text-stone-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-stone-900 mb-2">Your cart is empty</h2>
          <p className="text-stone-600 mb-6">Add some items to your cart to proceed with checkout.</p>
          <Button onClick={() => navigate('/products')} className="bg-emerald-700 hover:bg-emerald-800">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/cart')}
              variant="ghost"
              size="sm"
              className="text-stone-600 hover:text-stone-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
            <div className="flex items-center gap-2 text-stone-400">
              <span>/</span>
              <h1 className="text-xl font-semibold text-stone-900">Checkout</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Cart Items Summary */}
            <div className="bg-white rounded-lg border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Items ({totals.itemCount})
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-stone-50 rounded-lg">
                      <img
                        src={item.product.image_url || '/placeholder.png'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-stone-900 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-stone-600">Qty: {item.quantity}</p>
                        <p className="text-lg font-semibold text-emerald-700 mt-1">
                          {currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </h2>
              </div>
              <div className="p-6">
                {selectedAddress ? (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-stone-900">{selectedAddress.name}</span>
                        {selectedAddress.is_default && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-stone-700">
                        {selectedAddress.street_address}
                      </p>
                      <p className="text-stone-700">
                        {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}
                      </p>
                      <p className="text-stone-700">{selectedAddress.country}</p>
                      {selectedAddress.phone && (
                        <p className="text-stone-600 text-sm mt-1">Phone: {selectedAddress.phone}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => setShowAddressModal(true)}
                      variant="outline"
                      size="sm"
                      className="ml-4"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                    <p className="text-stone-600 mb-4">No delivery address selected</p>
                    <Button
                      onClick={() => setShowAddressModal(true)}
                      className="bg-emerald-700 hover:bg-emerald-800"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>
              </div>
              <div className="p-6">
                <div className="grid gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    
                    return (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-emerald-700 bg-emerald-700'
                                : 'border-stone-300'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <Icon className={`w-5 h-5 ${
                            isSelected ? 'text-emerald-700' : 'text-stone-500'
                          }`} />
                          <div>
                            <p className="font-medium text-stone-900">{method.name}</p>
                            <p className="text-sm text-stone-600">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex gap-2">
                    <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900 text-sm">Secure Payment</p>
                      <p className="text-blue-700 text-sm">
                        Your payment information is encrypted and secure with Razorpay.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-stone-200 sticky top-6">
              <div className="p-6 border-b border-stone-200">
                <h2 className="text-lg font-semibold text-stone-900">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                
                {/* Promo Code */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Promo Code
                  </label>
                  {!promoApplied ? (
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleApplyPromo}
                        disabled={!promoCode}
                        variant="outline"
                        size="sm"
                        className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-900">
                          {promoCode} applied
                        </span>
                      </div>
                      <Button
                        onClick={handleRemovePromo}
                        variant="ghost"
                        size="sm"
                        className="text-emerald-700 hover:text-emerald-900 h-auto p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-stone-200">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-stone-600">
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      <span>Shipping</span>
                      {totals.shipping === 0 && (
                        <span className="text-xs text-emerald-600 font-medium">(Free)</span>
                      )}
                    </div>
                    <span>
                      {totals.shipping === 0 ? 'FREE' : `${currencySymbol}${totals.shipping.toFixed(2)}`}
                    </span>
                  </div>

                  {totals.shipping > 0 && (
                    <p className="text-xs text-stone-500">
                      Add {currencySymbol}{(50 - totals.subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Tax</span>
                    <span>{currencySymbol}{totals.tax.toFixed(2)}</span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-emerald-600">
                      <div className="flex items-center gap-1">
                        <Gift className="w-4 h-4" />
                        <span>Discount</span>
                      </div>
                      <span>-{currencySymbol}{totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-stone-300">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-lg font-semibold text-stone-900">Total</span>
                    <span className="text-2xl font-bold text-emerald-700">
                      {currencySymbol}{totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !selectedAddressId}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white h-12 text-lg disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>

                {/* Security Info */}
                <div className="text-center pt-4 border-t border-stone-200">
                  <p className="text-xs text-stone-500 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    100% secure payments with Razorpay
                  </p>
                </div>

                {/* Policy Links */}
                <div className="text-center space-y-2 text-xs text-stone-500">
                  <div className="flex items-center justify-center gap-4">
                    <span>• Free shipping on orders ₹50+</span>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <span>• 30-day return policy</span>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <span>• 100% satisfaction guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <AddressModal
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
          onClose={() => setShowAddressModal(false)}
          onAddressChange={() => {
            // Refresh addresses
            fetchCheckoutData();
          }}
        />
      )}

      {/* Payment Error */}
      {paymentError && (
        <div className="fixed bottom-4 right-4 max-w-sm">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-red-900 font-medium text-sm">Payment Error</p>
                <p className="text-red-700 text-sm">{paymentError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={dismiss} />
    </div>
  );
};

export default UnifiedCheckout;