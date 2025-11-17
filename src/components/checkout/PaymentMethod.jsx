import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Lock, Smartphone, CreditCard, Wallet, Building } from 'lucide-react';

const PaymentMethod = ({
  selectedMethod = 'upi',
  onSelectMethod = () => {},
  onBack = () => {},
  onContinue = () => {},
  onPlaceOrder = () => {},
  isProcessing = false
}) => {
  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay using your UPI app',
      icon: Smartphone,
      info: 'Fast and secure'
    },
    {
      id: 'credit_card',
      name: 'Credit Card',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard,
      info: 'Earn reward points'
    },
    {
      id: 'debit_card',
      name: 'Debit Card',
      description: 'Visa, Mastercard Debit',
      icon: CreditCard,
      info: 'Direct from your account'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      description: 'Google Pay, Apple Pay, PayTM',
      icon: Wallet,
      info: 'Faster checkout'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major Indian banks',
      icon: Building,
      info: 'Direct bank transfer'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h2 className="text-2xl font-semibold text-stone-900 flex items-center gap-2 mb-2">
          <Lock className="w-6 h-6 text-emerald-700" />
          Payment Method
        </h2>
        <p className="text-stone-600">
          Choose how you'd like to pay for your order
        </p>
      </div>

      {/* Payment methods grid */}
      <div className="grid gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-700 bg-emerald-50'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Radio button */}
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 flex items-center justify-center ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-700'
                      : 'border-stone-300'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>

                {/* Payment method details */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      isSelected ? 'text-emerald-700' : 'text-stone-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-semibold text-stone-900">
                        {method.name}
                      </p>
                      <p className="text-sm text-stone-600 mt-1">
                        {method.description}
                      </p>
                      {isSelected && (
                        <p className="text-xs text-emerald-600 font-medium mt-2">
                          ✓ {method.info}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-900 text-sm">
              Your payment is secure
            </p>
            <p className="text-blue-700 text-sm mt-1">
              We use industry-leading encryption and Razorpay's secure payment gateway to protect your information.
            </p>
          </div>
        </div>
      </div>

      {/* Terms agreement */}
      <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
        <p className="text-sm text-stone-600">
          By proceeding, you agree to our{' '}
          <a href="#" className="text-emerald-700 hover:underline font-medium">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#" className="text-emerald-700 hover:underline font-medium">
            Privacy Policy
          </a>
          . Your payment will be processed by Razorpay.
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
          Back
        </Button>
        <Button
          onClick={onContinue || onPlaceOrder}
          disabled={isProcessing || !selectedMethod}
          className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-3 text-lg disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            onContinue ? 'Continue to Shipping' : 'Place Order'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethod;
