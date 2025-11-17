import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import useRazorpayPayment from '@/hooks/useRazorPayment';
import AddressSelector from '@/components/checkout/AddressSelector';
import PaymentMethod from '@/components/checkout/PaymentMethod';
import CheckoutShipping from '@/components/checkout/CheckoutShipping';
import OrderReview from '@/components/checkout/OrderReview';
import { useToast } from '@/components/ui/use-toast';
import { ToastContainer } from '@/components/ui/toast';
import { Loader2, CheckCircle2 } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cart, fetchCart, clearCart, currency } = useCart();
  const { initiateCheckout, isProcessing, error: paymentError } = useRazorpayPayment();
  const { toast, toasts, dismiss } = useToast();

  // State management
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Shipping, 4: Review
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [shippingDetails, setShippingDetails] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please login to continue with checkout.',
        variant: 'destructive'
      });
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate, toast]);

  // Fetch initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchCheckoutData();
    }
  }, [isAuthenticated]);

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      // Fetch cart
      await fetchCart();

      // Fetch addresses
      const addressResponse = await fetch('http://localhost:8000/api/v1/users/me/addresses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (addressResponse.ok) {
        const addressData = await addressResponse.json();
        setAddresses(addressData);
        
        // Select default address or first address
        const defaultAddr = addressData.find(addr => addr.is_default);
        setSelectedAddressId(defaultAddr?.id || addressData[0]?.id);
      }

      // Fetch user details
      const userResponse = await fetch('http://localhost:8000/api/v1/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserDetails(userData);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching checkout data:', err);
      toast({
        title: 'Error loading checkout',
        description: 'Failed to load checkout data. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return { subtotal: 0, shipping: 0, tax: 0, total: 0, itemCount: 0 };
    }

    const subtotal = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

    return { subtotal, shipping, tax, total, itemCount };
  };

  const totals = calculateTotals();

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast({
        title: 'Address required',
        description: 'Please select a delivery address.',
        variant: 'destructive'
      });
      return;
    }

    if (!userDetails) {
      toast({
        title: 'User details missing',
        description: 'Failed to load user details. Please refresh the page.',
        variant: 'destructive'
      });
      return;
    }

    // Initiate Razorpay payment
    await initiateCheckout({
      shippingAddressId: selectedAddressId,
      userDetails: {
        name: `${userDetails.first_name} ${userDetails.last_name || ''}`,
        email: userDetails.email,
        phone: userDetails.phone,
        first_name: userDetails.first_name,
        last_name: userDetails.last_name
      },
      paymentMethod: paymentMethod,
      onSuccess: async (verificationResult, order) => {
        console.log('Payment successful!', verificationResult);
        
        toast({
          title: 'Payment successful!',
          description: 'Your order has been placed successfully.',
          variant: 'success'
        });

        // Clear cart after successful payment
        await clearCart();

        // Navigate to order success page
        setTimeout(() => {
          navigate(`/orders/${order.id}/success`);
        }, 1500);
      },
      onFailure: (error) => {
        console.error('Payment failed:', error);
        
        toast({
          title: 'Payment failed',
          description: error.description || error.message || 'Payment could not be processed. Please try again.',
          variant: 'destructive'
        });
      }
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-700 animate-spin mx-auto mb-4" />
          <p className="text-stone-600 text-lg">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-lg shadow-lg max-w-md">
          <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🛒</span>
          </div>
          <h2 className="text-2xl font-semibold text-stone-900 mb-2">Your cart is empty</h2>
          <p className="text-stone-600 mb-6">Add some items to your cart to proceed with checkout.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Checkout</h1>
          <p className="text-stone-600">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* Step 1: Address */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 1 ? 'bg-emerald-700 text-white' : 'bg-stone-300 text-stone-600'
              }`}>
                {step > 1 ? <CheckCircle2 className="w-6 h-6" /> : '1'}
              </div>
              <span className={`text-sm ${step >= 1 ? 'text-emerald-700 font-medium' : 'text-stone-500'}`}>
                Address
              </span>
            </div>

            {/* Connector */}
            <div className={`h-1 flex-1 mx-2 ${step >= 2 ? 'bg-emerald-700' : 'bg-stone-300'}`} />

            {/* Step 2: Payment */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 2 ? 'bg-emerald-700 text-white' : 'bg-stone-300 text-stone-600'
              }`}>
                {step > 2 ? <CheckCircle2 className="w-6 h-6" /> : '2'}
              </div>
              <span className={`text-sm ${step >= 2 ? 'text-emerald-700 font-medium' : 'text-stone-500'}`}>
                Payment
              </span>
            </div>

            {/* Connector */}
            <div className={`h-1 flex-1 mx-2 ${step >= 3 ? 'bg-emerald-700' : 'bg-stone-300'}`} />

            {/* Step 3: Shipping */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 3 ? 'bg-emerald-700 text-white' : 'bg-stone-300 text-stone-600'
              }`}>
                {step > 3 ? <CheckCircle2 className="w-6 h-6" /> : '3'}
              </div>
              <span className={`text-sm ${step >= 3 ? 'text-emerald-700 font-medium' : 'text-stone-500'}`}>
                Shipping
              </span>
            </div>

            {/* Connector */}
            <div className={`h-1 flex-1 mx-2 ${step >= 4 ? 'bg-emerald-700' : 'bg-stone-300'}`} />

            {/* Step 4: Review */}
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step >= 4 ? 'bg-emerald-700 text-white' : 'bg-stone-300 text-stone-600'
              }`}>
                4
              </div>
              <span className={`text-sm ${step >= 4 ? 'text-emerald-700 font-medium' : 'text-stone-500'}`}>
                Review
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Step 1: Address Selection */}
              {step === 1 && (
                <AddressSelector
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={setSelectedAddressId}
                  isLoading={false}
                  onContinue={() => setStep(2)}
                />
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <PaymentMethod
                  selectedMethod={paymentMethod}
                  onSelectMethod={setPaymentMethod}
                  onBack={() => setStep(1)}
                  onContinue={() => setStep(3)}
                  isProcessing={isProcessing}
                />
              )}

              {/* Step 3: Shipping Options */}
              {step === 3 && (
                <CheckoutShipping
                  orderData={{
                    total: totals?.total,
                    totalWeight: cart?.items?.reduce((sum, item) => sum + (item.product?.weight || 0.5) * item.quantity, 0) || 0.5,
                    paymentMethod: paymentMethod,
                    items: cart?.items || []
                  }}
                  selectedAddress={addresses.find(addr => addr.id === selectedAddressId)}
                  onShippingSelect={setShippingDetails}
                  onBack={() => setStep(2)}
                  onContinue={() => setStep(4)}
                />
              )}

              {/* Step 4: Order Review */}
              {step === 4 && (
                <OrderReview
                  cart={cart}
                  selectedAddress={addresses.find(addr => addr.id === selectedAddressId)}
                  paymentMethod={paymentMethod}
                  shippingDetails={shippingDetails}
                  totals={totals}
                  onBack={() => setStep(3)}
                  onPlaceOrder={handlePlaceOrder}
                  isProcessing={isProcessing}
                />
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-stone-900 mb-6">Order Summary</h2>
              
              {/* Cart Items Preview */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.image_url || '/placeholder.png'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stone-900 line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-stone-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-stone-900">
                      {currency?.symbol || '$'}{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>{currency?.symbol || '$'}{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>{totals.shipping === 0 ? 'FREE' : `${currency?.symbol || '$'}${totals.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Tax</span>
                  <span>{currency?.symbol || '$'}{totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-stone-900 pt-3 border-t-2 border-stone-300">
                  <span>Total</span>
                  <span className="text-emerald-700">{currency?.symbol || '$'}{totals.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Error */}
              {paymentError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{paymentError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={dismiss} />
    </div>
  );
};

export default CheckoutPage;