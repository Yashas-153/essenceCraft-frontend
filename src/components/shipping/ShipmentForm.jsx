import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Package, Truck, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CourierSelector = ({ 
  serviceabilityData, 
  selectedCourier, 
  onCourierSelect, 
  loading 
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Checking courier serviceability...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!serviceabilityData?.available_courier_companies?.length) {
    return (
      <Alert>
        <AlertDescription>
          No courier services available for this delivery location. Please check the pincode.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="h-5 w-5 mr-2" />
          Select Courier Partner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {serviceabilityData.available_courier_companies.map((courier) => (
            <div
              key={courier.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedCourier?.id === courier.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
              onClick={() => onCourierSelect(courier)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-stone-900">{courier.name}</h4>
                  <p className="text-sm text-stone-600">
                    Delivery: {courier.estimated_delivery_days || 'N/A'}
                  </p>
                  {courier.rating && (
                    <p className="text-sm text-stone-600">
                      Rating: {courier.rating}/5
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-stone-900">
                    ₹{courier.freight_charge || 0}
                  </p>
                  {courier.cod_charges > 0 && (
                    <p className="text-xs text-stone-600">
                      COD: ₹{courier.cod_charges}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ShipmentForm = ({ 
  onSubmit, 
  loading, 
  orderData = {}, 
  onServiceabilityCheck 
}) => {
  const [formData, setFormData] = useState({
    // Order details
    order_id: orderData.order_id || '',
    order_date: new Date().toISOString().slice(0, 16),
    pickup_location: 'Primary',
    
    // Billing details
    billing_customer_name: orderData.billing_customer_name || '',
    billing_last_name: orderData.billing_last_name || '',
    billing_address: orderData.billing_address || '',
    billing_city: orderData.billing_city || '',
    billing_pincode: orderData.billing_pincode || '',
    billing_state: orderData.billing_state || '',
    billing_country: 'India',
    billing_email: orderData.billing_email || '',
    billing_phone: orderData.billing_phone || '',
    
    // Shipping details
    shipping_is_billing: true,
    shipping_customer_name: '',
    shipping_last_name: '',
    shipping_address: '',
    shipping_city: '',
    shipping_pincode: '',
    shipping_state: '',
    shipping_country: 'India',
    shipping_email: '',
    shipping_phone: '',
    
    // Order items
    order_items: orderData.order_items || [],
    
    // Payment and totals
    payment_method: 'Prepaid',
    sub_total: orderData.sub_total || 0,
    
    // Package dimensions
    length: orderData.length || 10,
    breadth: orderData.breadth || 10,
    height: orderData.height || 10,
    weight: orderData.weight || 0.5,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If shipping is same as billing, copy billing details
    if (formData.shipping_is_billing) {
      setFormData(prev => ({
        ...prev,
        shipping_customer_name: prev.billing_customer_name,
        shipping_last_name: prev.billing_last_name,
        shipping_address: prev.billing_address,
        shipping_city: prev.billing_city,
        shipping_pincode: prev.billing_pincode,
        shipping_state: prev.billing_state,
        shipping_email: prev.billing_email,
        shipping_phone: prev.billing_phone,
      }));
    }
  }, [formData.shipping_is_billing, formData.billing_customer_name, formData.billing_last_name, formData.billing_address, formData.billing_city, formData.billing_pincode, formData.billing_state, formData.billing_email, formData.billing_phone]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = [
      'billing_customer_name',
      'billing_address',
      'billing_city',
      'billing_pincode',
      'billing_state',
      'billing_email',
      'billing_phone'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.billing_email && !/\S+@\S+\.\S+/.test(formData.billing_email)) {
      newErrors.billing_email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.billing_phone && !/^\d{10}$/.test(formData.billing_phone)) {
      newErrors.billing_phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Pincode validation
    if (formData.billing_pincode && !/^\d{6}$/.test(formData.billing_pincode)) {
      newErrors.billing_pincode = 'Please enter a valid 6-digit pincode';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleServiceabilityCheck = () => {
    if (formData.billing_pincode && formData.weight) {
      onServiceabilityCheck({
        pickup_postcode: "400001", // This should come from your pickup location
        delivery_postcode: formData.billing_pincode,
        weight: parseFloat(formData.weight),
        cod: formData.payment_method === 'COD' ? 1 : 0,
        declared_value: formData.sub_total
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Order Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order_id">Order ID *</Label>
              <Input
                id="order_id"
                value={formData.order_id}
                onChange={(e) => handleInputChange('order_id', e.target.value)}
                placeholder="ORD-12345"
                required
              />
            </div>
            <div>
              <Label htmlFor="payment_method">Payment Method *</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => handleInputChange('payment_method', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prepaid">Prepaid</SelectItem>
                  <SelectItem value="COD">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="length">Length (cm)</Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                value={formData.length}
                onChange={(e) => handleInputChange('length', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="breadth">Breadth (cm)</Label>
              <Input
                id="breadth"
                type="number"
                step="0.1"
                value={formData.breadth}
                onChange={(e) => handleInputChange('breadth', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Billing Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billing_customer_name">First Name *</Label>
              <Input
                id="billing_customer_name"
                value={formData.billing_customer_name}
                onChange={(e) => handleInputChange('billing_customer_name', e.target.value)}
                className={errors.billing_customer_name ? 'border-red-500' : ''}
                required
              />
              {errors.billing_customer_name && (
                <p className="text-sm text-red-600 mt-1">{errors.billing_customer_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="billing_last_name">Last Name *</Label>
              <Input
                id="billing_last_name"
                value={formData.billing_last_name}
                onChange={(e) => handleInputChange('billing_last_name', e.target.value)}
                className={errors.billing_last_name ? 'border-red-500' : ''}
                required
              />
              {errors.billing_last_name && (
                <p className="text-sm text-red-600 mt-1">{errors.billing_last_name}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="billing_address">Address *</Label>
            <Input
              id="billing_address"
              value={formData.billing_address}
              onChange={(e) => handleInputChange('billing_address', e.target.value)}
              className={errors.billing_address ? 'border-red-500' : ''}
              placeholder="Street address, apartment, suite, etc."
              required
            />
            {errors.billing_address && (
              <p className="text-sm text-red-600 mt-1">{errors.billing_address}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="billing_city">City *</Label>
              <Input
                id="billing_city"
                value={formData.billing_city}
                onChange={(e) => handleInputChange('billing_city', e.target.value)}
                className={errors.billing_city ? 'border-red-500' : ''}
                required
              />
              {errors.billing_city && (
                <p className="text-sm text-red-600 mt-1">{errors.billing_city}</p>
              )}
            </div>
            <div>
              <Label htmlFor="billing_state">State *</Label>
              <Input
                id="billing_state"
                value={formData.billing_state}
                onChange={(e) => handleInputChange('billing_state', e.target.value)}
                className={errors.billing_state ? 'border-red-500' : ''}
                required
              />
              {errors.billing_state && (
                <p className="text-sm text-red-600 mt-1">{errors.billing_state}</p>
              )}
            </div>
            <div>
              <Label htmlFor="billing_pincode">Pincode *</Label>
              <Input
                id="billing_pincode"
                value={formData.billing_pincode}
                onChange={(e) => handleInputChange('billing_pincode', e.target.value)}
                className={errors.billing_pincode ? 'border-red-500' : ''}
                placeholder="123456"
                required
              />
              {errors.billing_pincode && (
                <p className="text-sm text-red-600 mt-1">{errors.billing_pincode}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billing_email">Email *</Label>
              <Input
                id="billing_email"
                type="email"
                value={formData.billing_email}
                onChange={(e) => handleInputChange('billing_email', e.target.value)}
                className={errors.billing_email ? 'border-red-500' : ''}
                required
              />
              {errors.billing_email && (
                <p className="text-sm text-red-600 mt-1">{errors.billing_email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="billing_phone">Phone *</Label>
              <Input
                id="billing_phone"
                value={formData.billing_phone}
                onChange={(e) => handleInputChange('billing_phone', e.target.value)}
                className={errors.billing_phone ? 'border-red-500' : ''}
                placeholder="9876543210"
                required
              />
              {errors.billing_phone && (
                <p className="text-sm text-red-600 mt-1">{errors.billing_phone}</p>
              )}
            </div>
          </div>

          {/* Check Serviceability Button */}
          <div className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleServiceabilityCheck}
              disabled={!formData.billing_pincode || !formData.weight}
            >
              Check Courier Serviceability
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address Toggle */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="shipping_is_billing"
              checked={formData.shipping_is_billing}
              onCheckedChange={(checked) => handleInputChange('shipping_is_billing', checked)}
            />
            <Label htmlFor="shipping_is_billing">
              Shipping address is same as billing address
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="min-w-[120px]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Creating...
            </>
          ) : (
            'Create Shipment'
          )}
        </Button>
      </div>
    </form>
  );
};

export { ShipmentForm, CourierSelector };