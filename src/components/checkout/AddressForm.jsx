import React, { useState, useEffect } from 'react';
import useAddress from '@/hooks/useAddress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AddressForm = ({
  addressId = null,
  onSuccess = () => {},
  onCancel = () => {}
}) => {
  const address = useAddress();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: false,
    address_type: 'shipping'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load address if editing
  useEffect(() => {
    if (addressId) {
      const existingAddress = address.addresses.find(a => a.id === addressId);
      if (existingAddress) {
        setFormData({
          street_address: existingAddress.street_address || existingAddress.street || '',
          city: existingAddress.city || '',
          state: existingAddress.state || '',
          postal_code: existingAddress.postal_code || '',
          country: existingAddress.country || 'India',
          is_default: existingAddress.is_default || false,
          address_type: existingAddress.address_type || 'shipping'
        });
      }
    }
  }, [addressId, address.addresses]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.street_address || formData.street_address.length < 5) {
      newErrors.street_address = 'Street address must be at least 5 characters';
    }

    if (!formData.city || formData.city.length < 2) {
      newErrors.city = 'City is required';
    }

    if (!formData.state || formData.state.length < 2) {
      newErrors.state = 'State is required';
    }

    if (!formData.postal_code) {
      newErrors.postal_code = 'Postal code is required';
    } else if (formData.country === 'India' && !/^\d{6}$/.test(formData.postal_code)) {
      newErrors.postal_code = 'Indian postal code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (addressId) {
        // Update existing address
        await address.updateAddress(addressId, formData);
        toast({
          title: 'Success',
          description: 'Address updated successfully.',
          variant: 'success'
        });
      } else {
        // Create new address
        await address.createAddress(formData);
        toast({
          title: 'Success',
          description: 'Address added successfully.',
          variant: 'success'
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save address.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Street Address */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Street Address
        </label>
        <Input
          type="text"
          name="street_address"
          placeholder="e.g., 123 Main Street, Apt 4B"
          value={formData.street_address}
          onChange={handleChange}
          disabled={isSubmitting}
          className={errors.street_address ? 'border-red-500' : ''}
        />
        {errors.street_address && (
          <p className="text-sm text-red-600 mt-1">{errors.street_address}</p>
        )}
      </div>

      {/* City and State */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            City
          </label>
          <Input
            type="text"
            name="city"
            placeholder="e.g., New York"
            value={formData.city}
            onChange={handleChange}
            disabled={isSubmitting}
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && (
            <p className="text-sm text-red-600 mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            State/Province
          </label>
          <Input
            type="text"
            name="state"
            placeholder="e.g., NY"
            value={formData.state}
            onChange={handleChange}
            disabled={isSubmitting}
            className={errors.state ? 'border-red-500' : ''}
          />
          {errors.state && (
            <p className="text-sm text-red-600 mt-1">{errors.state}</p>
          )}
        </div>
      </div>

      {/* Postal Code and Country */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Postal Code
          </label>
          <Input
            type="text"
            name="postal_code"
            placeholder="e.g., 10001"
            value={formData.postal_code}
            onChange={handleChange}
            disabled={isSubmitting}
            className={errors.postal_code ? 'border-red-500' : ''}
          />
          {errors.postal_code && (
            <p className="text-sm text-red-600 mt-1">{errors.postal_code}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Country
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="UK">UK</option>
            <option value="Australia">Australia</option>
          </select>
        </div>
      </div>

      {/* Address Type */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Address Type
        </label>
        <select
          name="address_type"
          value={formData.address_type}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="shipping">Shipping Address</option>
          <option value="billing">Billing Address</option>
        </select>
      </div>

      {/* Set as default */}
      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="is_default"
          name="is_default"
          checked={formData.is_default}
          onChange={handleChange}
          disabled={isSubmitting}
          className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
        />
        <label htmlFor="is_default" className="text-sm text-stone-700">
          Set as default address
        </label>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            addressId ? 'Update Address' : 'Add Address'
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
