import React, { useState } from 'react';
import { MapPin, Plus, Check, Edit2, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import useAddress from '@/hooks/useAddress';

const AddressSelector = ({ onAddressSelect, selectedAddressId }) => {
  const {
    shippingAddresses,
    isLoading,
    error,
    selectAddress,
    setAsDefault,
    deleteAddress
  } = useAddress();

  const [showAddForm, setShowAddForm] = useState(false);

  const handleSelectAddress = (addressId) => {
    selectAddress(addressId);
    onAddressSelect && onAddressSelect(addressId);
  };

  const handleSetDefault = async (addressId, e) => {
    e.stopPropagation();
    try {
      await setAsDefault(addressId);
    } catch (error) {
      console.error('Error setting default:', error);
    }
  };

  const handleDelete = async (addressId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  if (shippingAddresses.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-stone-900 mb-2">
          No addresses found
        </h3>
        <p className="text-stone-600 mb-4">
          Add a delivery address to continue
        </p>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-stone-900">
          Select Delivery Address
        </h3>
        <Button
          onClick={() => setShowAddForm(true)}
          variant="outline"
          size="sm"
          className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="grid gap-4">
        {shippingAddresses.map((address) => (
          <Card
            key={address.id}
            onClick={() => handleSelectAddress(address.id)}
            className={`p-4 cursor-pointer transition-all duration-200 ${
              selectedAddressId === address.id
                ? 'border-2 border-emerald-700 bg-emerald-50'
                : 'border border-stone-200 hover:border-emerald-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Radio/Checkbox indicator */}
              <div className="flex-shrink-0 mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAddressId === address.id
                      ? 'border-emerald-700 bg-emerald-700'
                      : 'border-stone-300'
                  }`}
                >
                  {selectedAddressId === address.id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>

              {/* Address details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span className="font-semibold text-stone-900">
                    {address.address_type === 'shipping' ? 'Shipping' : 'Billing'} Address
                  </span>
                  {address.is_default && (
                    <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                      Default
                    </span>
                  )}
                </div>

                <p className="text-stone-700 font-medium">
                  {address.street_address}
                  {address.apartment && `, ${address.apartment}`}
                </p>
                <p className="text-stone-600">
                  {address.city}, {address.state} - {address.postal_code}
                </p>
                <p className="text-stone-500 text-sm">{address.country}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!address.is_default && (
                  <button
                    onClick={(e) => handleSetDefault(address.id, e)}
                    className="p-2 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                    title="Set as default"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => handleDelete(address.id, e)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Address Form Modal - You can implement this */}
      {showAddForm && (
        <AddAddressForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
};

// Simple Add Address Form Component
const AddAddressForm = ({ onClose, onSuccess }) => {
  const { createAddress, isLoading } = useAddress();
  const [formData, setFormData] = useState({
    street_address: '',
    apartment: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    address_type: 'shipping',
    is_default: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`📝 Input changed - ${name}: ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    console.log('🔍 validate() called');
    const newErrors = {};
    
    console.log('🔍 Checking street_address:', formData.street_address);
    if (!formData.street_address || formData.street_address.length < 5) {
      newErrors.street_address = 'Street address must be at least 5 characters';
    }
    
    console.log('🔍 Checking city:', formData.city);
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    
    console.log('🔍 Checking state:', formData.state);
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    
    console.log('🔍 Checking postal_code:', formData.postal_code);
    if (!formData.postal_code) {
      newErrors.postal_code = 'Postal code is required';
    } else if (formData.country === 'India' && !/^\d{6}$/.test(formData.postal_code)) {
      newErrors.postal_code = 'Indian postal code must be 6 digits';
    }

    console.log('🔍 Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('🔍 Is valid:', isValid);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔍 handleSubmit called');
    console.log('📋 Current form data:', formData);

    try {
      console.log('📤 Attempting to submit form data:', formData);
      
      // Check if token exists
      const token = localStorage.getItem('accessToken');
      console.log('🔐 Token check - accessToken exists:', !!token);
      if (!token) {
        console.error('❌ No token found in localStorage');
        throw new Error('Authentication token not found. Please login again.');
      }

      console.log('🚀 Calling createAddress with data:', formData);
      const result = await createAddress(formData);
      console.log('✨ Address created successfully:', result);
      onSuccess && onSuccess();
    } catch (error) {
      console.error('💥 Error creating address:', error);
      const errorMessage = error.message || 'Failed to create address. Please try again.';
      console.log('⚠️ Setting error message:', errorMessage);
      setErrors({ submit: errorMessage });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-stone-900">Add New Address</h2>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Street Address */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="123 Main Street"
              />
            </div>

            {/* Apartment */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Apartment, Suite, etc. (Optional)
              </label>
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Apt 4B"
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Mumbai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Maharashtra"
                />
              </div>
            </div>

            {/* Postal Code and Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="400001"
                  maxLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="India"
                />
              </div>
            </div>

            {/* Address Type */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Address Type
              </label>
              <select
                name="address_type"
                value={formData.address_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="shipping">Shipping Address</option>
                <option value="billing">Billing Address</option>
              </select>
            </div>

            {/* Set as Default */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_default"
                id="is_default"
                checked={formData.is_default}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-700 border-stone-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="is_default" className="ml-2 text-sm text-stone-700">
                Set as default shipping address
              </label>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {errors.submit}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-700 hover:bg-emerald-800"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Address'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressSelector;