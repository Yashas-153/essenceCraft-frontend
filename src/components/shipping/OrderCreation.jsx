import React, { useState } from 'react';
import { useShiprocket } from '../../hooks/useShiprocket';
import { ShipmentForm, CourierSelector } from './ShipmentForm';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, AlertCircle, Package } from 'lucide-react';

const OrderCreation = ({ orderData, onOrderCreated, onCancel }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Courier Selection, 3: Confirmation
  const [serviceabilityData, setServiceabilityData] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [shipmentFormData, setShipmentFormData] = useState(null);
  const [orderResult, setOrderResult] = useState(null);
  const [serviceabilityLoading, setServiceabilityLoading] = useState(false);

  const {
    loading,
    error,
    createOrder,
    createShipment,
    checkServiceability,
  } = useShiprocket();

  const handleServiceabilityCheck = async (serviceabilityParams) => {
    setServiceabilityLoading(true);
    try {
      const result = await checkServiceability(serviceabilityParams);
      setServiceabilityData(result.data);
      setStep(2);
    } catch (err) {
      console.error('Serviceability check failed:', err);
    } finally {
      setServiceabilityLoading(false);
    }
  };

  const handleFormSubmit = (formData) => {
    setShipmentFormData(formData);
    // If we already have serviceability data, go to courier selection
    if (serviceabilityData) {
      setStep(2);
    } else {
      // Check serviceability first
      handleServiceabilityCheck({
        pickup_postcode: "400001", // This should come from your pickup location
        delivery_postcode: formData.billing_pincode,
        weight: parseFloat(formData.weight),
        cod: formData.payment_method === 'COD' ? 1 : 0,
        declared_value: formData.sub_total
      });
    }
  };

  const handleCourierSelect = (courier) => {
    setSelectedCourier(courier);
  };

  const handleCreateOrder = async () => {
    if (!shipmentFormData || !selectedCourier) return;

    try {
      // Create order in Shiprocket
      const orderResult = await createOrder(shipmentFormData);
      setOrderResult(orderResult.data);

      // Create shipment (generate AWB)
      if (orderResult.data.shipment_id) {
        const shipmentResult = await createShipment({
          shipment_id: orderResult.data.shipment_id,
          courier_id: selectedCourier.id
        });

        setStep(3);
        
        // Notify parent component
        if (onOrderCreated) {
          onOrderCreated({
            order: orderResult.data,
            shipment: shipmentResult.data,
            courier: selectedCourier,
            formData: shipmentFormData
          });
        }
      }
    } catch (err) {
      console.error('Order creation failed:', err);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 1 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
        }`}>
          1
        </div>
        <div className={`w-12 h-1 ${step >= 2 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 2 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
        }`}>
          2
        </div>
        <div className={`w-12 h-1 ${step >= 3 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          step >= 3 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
        }`}>
          3
        </div>
      </div>
    </div>
  );

  const renderStepLabels = () => (
    <div className="flex justify-between mb-8 text-sm text-stone-600">
      <span className={step >= 1 ? 'text-emerald-600 font-medium' : ''}>Order Details</span>
      <span className={step >= 2 ? 'text-emerald-600 font-medium' : ''}>Select Courier</span>
      <span className={step >= 3 ? 'text-emerald-600 font-medium' : ''}>Confirmation</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-6 w-6 mr-2" />
            Create Shiprocket Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepIndicator()}
          {renderStepLabels()}

          {error && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <ShipmentForm
              orderData={orderData}
              onSubmit={handleFormSubmit}
              onServiceabilityCheck={handleServiceabilityCheck}
              loading={loading || serviceabilityLoading}
            />
          )}

          {step === 2 && (
            <div className="space-y-6">
              <CourierSelector
                serviceabilityData={serviceabilityData}
                selectedCourier={selectedCourier}
                onCourierSelect={handleCourierSelect}
                loading={serviceabilityLoading}
              />
              
              {selectedCourier && (
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back to Form
                  </Button>
                  <Button
                    onClick={handleCreateOrder}
                    disabled={loading}
                  >
                    {loading ? 'Creating Order...' : 'Create Order & Generate AWB'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 3 && orderResult && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-emerald-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  Order Created Successfully!
                </h3>
                <p className="text-stone-600">
                  Your shipment has been created and is ready for pickup.
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-stone-600">Shiprocket Order ID:</span>
                      <p className="font-medium">{orderResult.order_id}</p>
                    </div>
                    <div>
                      <span className="text-stone-600">Shipment ID:</span>
                      <p className="font-medium">{orderResult.shipment_id}</p>
                    </div>
                    <div>
                      <span className="text-stone-600">AWB Code:</span>
                      <p className="font-medium">{orderResult.awb_code || 'Generating...'}</p>
                    </div>
                    <div>
                      <span className="text-stone-600">Courier Partner:</span>
                      <p className="font-medium">{selectedCourier?.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={onCancel}>
                  Close
                </Button>
                <Button onClick={() => window.open(`/track/${orderResult.shipment_id}`, '_blank')}>
                  Track Shipment
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderCreation;