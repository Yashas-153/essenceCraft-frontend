import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for handling Razorpay payments
 * @param {string} apiBaseUrl - Base URL for the API (default: http://localhost:8000/api/v1)
 * @returns {Object} Payment methods and state
 */
const useRazorpayPayment = (apiBaseUrl = 'http://localhost:8000/api/v1') => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  /**
   * Load Razorpay script dynamically
   */
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      // Check if script already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  /**
   * Get access token from localStorage
   */
  const getAccessToken = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token found. Please login first.');
    }
    return token;
  }, []);

  /**
   * Create an order on the backend
   */
  const createOrder = useCallback(async (shippingAddressId) => {
    try {
      const token = getAccessToken();

      const response = await fetch(`${apiBaseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shipping_address_id: shippingAddressId,
          items: [] // Items taken from cart
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create order');
      }

      const order = await response.json();
      setCurrentOrder(order);
      return order;
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  }, [apiBaseUrl, getAccessToken]);

  /**
   * Create Razorpay payment order
   */
  const createPaymentOrder = useCallback(async (orderId, paymentMethod = 'upi') => {
    try {
      const token = getAccessToken();

      const response = await fetch(`${apiBaseUrl}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          order_id: orderId,
          payment_method: paymentMethod
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create payment order');
      }

      return await response.json();
    } catch (err) {
      console.error('Error creating payment order:', err);
      throw err;
    }
  }, [apiBaseUrl, getAccessToken]);

  /**
   * Verify payment after successful payment
   */
  const verifyPayment = useCallback(async (paymentData, orderId) => {
    try {
      const token = getAccessToken();

      const response = await fetch(`${apiBaseUrl}/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
          order_id: orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Payment verification failed');
      }

      return await response.json();
    } catch (err) {
      console.error('Error verifying payment:', err);
      throw err;
    }
  }, [apiBaseUrl, getAccessToken]);

  /**
   * Open Razorpay checkout modal
   */
  const openRazorpayCheckout = useCallback((paymentData, userDetails, order, onSuccess, onFailure) => {
    const options = {
      key: paymentData.razorpay_key_id,
      amount: paymentData.amount * 100, // Convert to paise
      currency: paymentData.currency,
      name: 'EssenceCraft',
      description: `Order #${order.order_number}`,
      image: '/logo.png', // Your logo URL
      order_id: paymentData.order_id,

      // Prefill customer details
      prefill: {
        name: userDetails.name || `${userDetails.first_name} ${userDetails.last_name || ''}`,
        email: userDetails.email,
        contact: userDetails.phone || '9999999999'
      },

      // Custom notes
      notes: {
        order_id: order.id,
        order_number: order.order_number
      },

      // Theme customization
      theme: {
        color: '#15803d' // Emerald-700 color
      },

      // Payment success handler
      handler: async function (response) {
        try {
          console.log('Payment successful:', response);
          const verificationResult = await verifyPayment(response, order.id);
          onSuccess && onSuccess(verificationResult, order);
        } catch (error) {
          console.error('Verification error:', error);
          onFailure && onFailure(error);
        }
      },

      // Modal options
      modal: {
        ondismiss: function () {
          console.log('Payment cancelled by user');
          onFailure && onFailure(new Error('Payment cancelled'));
        },
        escape: true,
        backdropclose: false
      },

      // Additional options
      retry: {
        enabled: true,
        max_count: 3
      },

      timeout: 300, // 5 minutes timeout
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

    // Handle payment failures
    razorpay.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      onFailure && onFailure(response.error);
    });
  }, [verifyPayment]);

  /**
   * Main checkout function - handles the entire payment flow
   */
  const initiateCheckout = useCallback(async ({
    shippingAddressId,
    userDetails,
    paymentMethod = 'upi',
    onSuccess,
    onFailure
  }) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay. Please refresh the page.');
      }

      // Step 2: Create order on backend
      console.log('Creating order...');
      const order = await createOrder(shippingAddressId);
      console.log('Order created:', order);

      // Step 3: Create Razorpay payment order
      console.log('Creating payment order...');
      const paymentData = await createPaymentOrder(order.id, paymentMethod);
      console.log('Payment order created:', paymentData);

      // Step 4: Open Razorpay checkout
      console.log('Opening Razorpay checkout...');
      openRazorpayCheckout(
        paymentData,
        userDetails,
        order,
        (verificationResult, orderData) => {
          setIsProcessing(false);
          console.log('Payment verified successfully:', verificationResult);
          onSuccess && onSuccess(verificationResult, orderData);
        },
        (error) => {
          setIsProcessing(false);
          const errorMessage = error.description || error.message || 'Payment failed';
          setError(errorMessage);
          console.error('Payment error:', error);
          onFailure && onFailure(error);
        }
      );

    } catch (err) {
      setIsProcessing(false);
      const errorMessage = err.message || 'Checkout failed';
      setError(errorMessage);
      console.error('Checkout error:', err);
      onFailure && onFailure(err);
    }
  }, [loadRazorpayScript, createOrder, createPaymentOrder, openRazorpayCheckout]);

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setIsProcessing(false);
    setError(null);
    setCurrentOrder(null);
  }, []);

  return {
    // State
    isProcessing,
    error,
    currentOrder,

    // Methods
    initiateCheckout,
    createOrder,
    createPaymentOrder,
    verifyPayment,
    reset,

    // Utilities
    loadRazorpayScript,
  };
};

export default useRazorpayPayment;