import React, { useState, useEffect } from 'react';
import { useShiprocket } from '@/hooks/useShiprocket';
import { CourierSelector } from '@/components/shipping/ShipmentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const CheckoutShipping = ({ 
  orderData, 
  selectedAddress, 
  onShippingSelect, 
  onContinue, 
  onBack 
}) => {
  const [serviceabilityData, setServiceabilityData] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [serviceabilityLoading, setServiceabilityLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  const { checkServiceability, error } = useShiprocket();

  useEffect(() => {
    if (selectedAddress && orderData) {
      checkCourierServiceability();
    }
  }, [selectedAddress, orderData]);

  const checkCourierServiceability = async () => {
    if (!selectedAddress?.postal_code || !orderData?.totalWeight) return;

    setServiceabilityLoading(true);
    try {
      const serviceabilityParams = {
        pickup_postcode: "400001", // Your pickup location pincode
        delivery_postcode: selectedAddress.postal_code,
        weight: orderData.totalWeight || 0.5,
        cod: orderData.paymentMethod === 'COD' ? 1 : 0,
        declared_value: orderData.total || 0
      };

      const result = await checkServiceability(serviceabilityParams);
      setServiceabilityData(result.data);
      
      // Auto-select the first available courier if only one option
      if (result.data?.available_courier_companies?.length === 1) {
        const courier = result.data.available_courier_companies[0];
        setSelectedCourier(courier);
        setShippingCost(courier.freight_charge || 0);
        if (onShippingSelect) {
          onShippingSelect({
            courier,
            shippingCost: courier.freight_charge || 0,
            serviceabilityData: result.data
          });
        }
      }
    } catch (err) {
      console.error('Serviceability check failed:', err);
    } finally {
      setServiceabilityLoading(false);
    }
  };

  const handleCourierSelect = (courier) => {
    setSelectedCourier(courier);
    setShippingCost(courier.freight_charge || 0);
    
    if (onShippingSelect) {
      onShippingSelect({
        courier,
        shippingCost: courier.freight_charge || 0,
        serviceabilityData
      });
    }
  };

  const handleContinue = () => {
    if (selectedCourier && onContinue) {
      onContinue({
        courier: selectedCourier,
        shippingCost,
        serviceabilityData
      });
    }
  };

  if (!selectedAddress) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please select a delivery address first to check shipping options.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-stone-900 flex items-center gap-2 mb-2">
          <Truck className="w-6 h-6 text-emerald-700" />
          Shipping Options
        </h2>
        <p className="text-stone-600">
          Select your preferred courier partner for delivery
        </p>
      </div>

      {/* Delivery Address Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-900">Delivering to:</p>
              <p className="text-sm text-stone-600">
                {selectedAddress.street_address}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}
              </p>
            </div>
            <Badge variant="outline">
              {selectedAddress.postal_code}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please try again or contact support.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {serviceabilityLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-stone-600">Checking courier availability...</p>
          </CardContent>
        </Card>
      )}

      {/* No Service Available */}
      {!serviceabilityLoading && serviceabilityData && !serviceabilityData.available_courier_companies?.length && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Sorry, we don't have courier service available for this pincode ({selectedAddress.postal_code}). 
            Please contact our support team for assistance.
          </AlertDescription>
        </Alert>
      )}

      {/* Courier Selection */}
      {!serviceabilityLoading && serviceabilityData?.available_courier_companies?.length > 0 && (
        <div className="space-y-4">
          <CourierSelector
            serviceabilityData={serviceabilityData}
            selectedCourier={selectedCourier}
            onCourierSelect={handleCourierSelect}
            loading={false}
          />

          {/* Selected Courier Summary */}
          {selectedCourier && (
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-emerald-900">
                        {selectedCourier.name} selected
                      </p>
                      <p className="text-sm text-emerald-700">
                        Estimated delivery: {selectedCourier.estimated_delivery_days || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-900">
                      ₹{selectedCourier.freight_charge || 0}
                    </p>
                    {selectedCourier.cod_charges > 0 && orderData.paymentMethod === 'COD' && (
                      <p className="text-xs text-emerald-700">
                        + ₹{selectedCourier.cod_charges} COD
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={serviceabilityLoading}
        >
          Back to Payment
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={!selectedCourier || serviceabilityLoading}
        >
          Continue to Review
          {selectedCourier && (
            <span className="ml-2 text-sm">
              (+₹{shippingCost})
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutShipping;