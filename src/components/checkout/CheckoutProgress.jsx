import React from 'react';
import { Check, ShoppingBag, MapPin, CreditCard } from 'lucide-react';

const CheckoutProgress = ({ currentStep }) => {
  const steps = [
    {
      id: 'cart',
      label: 'Review Order',
      icon: ShoppingBag,
      description: 'Review items'
    },
    {
      id: 'address',
      label: 'Delivery Address',
      icon: MapPin,
      description: 'Select address'
    },
    {
      id: 'payment',
      label: 'Payment Method',
      icon: CreditCard,
      description: 'Choose payment'
    }
  ];

  // Get step order
  const stepOrder = ['cart', 'address', 'payment'];
  const currentStepIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="bg-white border-b border-stone-200 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = index < currentStepIndex;

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-700 border-emerald-700 text-white'
                        : isCompleted
                        ? 'bg-emerald-100 border-emerald-700 text-emerald-700'
                        : 'bg-stone-100 border-stone-300 text-stone-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <p
                      className={`font-semibold text-sm transition-colors ${
                        isActive || isCompleted ? 'text-stone-900' : 'text-stone-500'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">{step.description}</p>
                  </div>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 h-0.5 bg-stone-200 relative top-0">
                    <div
                      className={`h-full ${
                        isCompleted ? 'bg-emerald-700' : 'bg-stone-200'
                      } transition-all duration-300`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckoutProgress;
