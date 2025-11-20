import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import useRazorpayPayment from '@/hooks/useRazorPayment';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';
import CartItems from '@/components/cart/CartItems';
import AddressSelector from '@/components/checkout/AddressSelector';
import PaymentMethod from '@/components/checkout/PaymentMethod';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useToast } from '@/components/ui/use-toast';
import { ToastContainer } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ShoppingBag } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cart, fetchCart, clearCart, currency, cartTotals } = useCart();
  const { initiateCheckout, retryPayment, isProcessing, error: paymentError } = useRazorpayPayment();
  const { toast, toasts, dismiss } = useToast();

  // State management - 3 steps: cart, address, payment
  const [currentStep, setCurrentStep] = useState('cart');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

      // Fetch addresses using addressAPI
      try {
        const { addressAPI } = await import('@/services/api');
        const addressData = await addressAPI.getAddresses();
        setAddresses(addressData);
        
        // Select default address or first address
        const defaultAddr = addressData.find(addr => addr.is_default);
        setSelectedAddressId(defaultAddr?.id || addressData[0]?.id);
      } catch (addressError) {
        console.error('Error fetching addresses:', addressError);
        // Continue even if addresses fail to load
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
      toast({
        title: 'Error loading checkout',
        description: 'Failed to load checkout data. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Address refresh callback
  const handleAddressChange = async () => {
    try {
      const { addressAPI } = await import('@/services/api');
      const addressData = await addressAPI.getAddresses();
      setAddresses(addressData);
      
      // If no address selected, select default or first
      if (!selectedAddressId) {
        const defaultAddr = addressData.find(addr => addr.is_default);
        setSelectedAddressId(defaultAddr?.id || addressData[0]?.id);
      }
    } catch (err) {
      console.error('Error refreshing addresses:', err);
      toast({
        title: 'Error',
        description: 'Failed to refresh addresses.',
        variant: 'destructive'
      });
    }
  };

  // Use cart totals from hook
  const safeCartTotals = {
    itemCount: cartTotals?.itemCount || 0,
    subtotal: cartTotals?.subtotal || 0,
    items: cart?.items || []
  };

  // Handle item updates
  const handleItemUpdate = async () => {
    setIsUpdating(true);
    await fetchCart();
    setIsUpdating(false);
  };

  // Step navigation
  const goToNextStep = () => {
    if (currentStep === 'cart') {
      setCurrentStep('address');
    } else if (currentStep === 'address' && selectedAddressId) {
      setCurrentStep('payment');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('address');
    } else if (currentStep === 'address') {
      setCurrentStep('cart');
    }
  };

  // Handle place order (payment)
  const handlePlaceOrder = async () => {
    // Debug: Log cart data
    console.log('🛒 Cart data in checkout:', cart);
    console.log('🛒 Cart items:', cart?.items);
    console.log('🛒 Cart items length:', cart?.items?.length);

    // Check if cart has items
    if (!cart?.items || cart.items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add some items to your cart before checkout.',
        variant: 'destructive'
      });
      return;
    }

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
      cartItems: cart.items,
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
          navigate(`/order-success/${order.id}`);
        }, 1500);
      },
      onFailure: (error, order) => {
        console.error('❌ Payment failed:', error);
        
        // Show toast with retry option
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
          duration: 10000, // Show for 10 seconds
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

      // Get new payment order for retry
      const paymentData = await retryPayment(orderId, paymentMethod);
      
      // Load Razorpay script if not loaded
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
              console.log('✅ Retry payment successful:', response);
              
              // Verify payment
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
              console.error('❌ Retry verification error:', error);
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
    <div className="min-h-screen bg-stone-50">
      {/* Progress Indicator */}
      <CheckoutProgress currentStep={currentStep} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Step 1: Cart Review */}
            {currentStep === 'cart' && (
              <div className="bg-white rounded-lg border border-stone-200">
                <div className="p-6 border-b border-stone-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-6 h-6 text-emerald-700" />
                      <h2 className="text-xl font-semibold text-stone-900">Review Your Order</h2>
                    </div>
                    <Button
                      onClick={() => navigate('/cart')}
                      variant="outline"
                      size="sm"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Edit Cart
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  {cart?.items && (
                    <CartItems 
                      items={cart.items} 
                      onItemUpdate={handleItemUpdate}
                    />
                  )}
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={goToNextStep}
                      disabled={!cart?.items?.length || isUpdating}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Continue to Address'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address Selection */}
            {currentStep === 'address' && (
              <div className="bg-white rounded-lg border border-stone-200 p-6">
                <AddressSelector
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={setSelectedAddressId}
                  isLoading={false}
                  onContinue={goToNextStep}
                  onAddressChange={handleAddressChange}
                />
                <div className="mt-6 flex justify-between">
                  <Button
                    onClick={goToPreviousStep}
                    variant="outline"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Cart
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 'payment' && (
              <div className="bg-white rounded-lg border border-stone-200 p-6">
                <PaymentMethod
                  selectedMethod={paymentMethod}
                  onSelectMethod={setPaymentMethod}
                  onBack={goToPreviousStep}
                  onPlaceOrder={handlePlaceOrder}
                  isProcessing={isProcessing}
                />
              </div>
            )}
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartTotals={safeCartTotals}
              currencySymbol={currency?.symbol || '$'}
              selectedAddressId={selectedAddressId}
              selectedAddress={addresses.find(addr => addr.id === selectedAddressId)}
            />
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={dismiss} />
    </div>
  );
};

export default CheckoutPage;