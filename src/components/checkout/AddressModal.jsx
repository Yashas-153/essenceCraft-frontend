import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAddress from '@/hooks/useAddress';
import { useToast } from '@/components/ui/use-toast';

const AddressModal = ({ isOpen, onClose, onAddressAdded }) => {
  const address = useAddress();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    address_type: 'shipping'
  });

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.street_address || formData.street_address.length < 5) {
      newErrors.street_address = 'Street address required (min 5 chars)';
    }
    if (!formData.city || formData.city.length < 2) {
      newErrors.city = 'City required';
    }
    if (!formData.state || formData.state.length < 2) {
      newErrors.state = 'State required';
    }
    if (!formData.postal_code) {
      newErrors.postal_code = 'Postal code required';
    } else if (formData.country === 'India' && !/^\d{6}$/.test(formData.postal_code)) {
      newErrors.postal_code = 'Indian postal code must be 6 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await address.createAddress(formData);
      toast({
        title: 'Success',
        description: 'Address added successfully',
        variant: 'success'
      });
      setFormData({
        street_address: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        address_type: 'shipping'
      });
      onAddressAdded();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add address',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md rounded-t-xl sm:rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-stone-900">Add New Address</h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-700"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Street Address *
            </label>
            <Input
              type="text"
              name="street_address"
              placeholder="e.g., 123 Main Street"
              value={formData.street_address}
              onChange={handleChange}
              disabled={isSubmitting}
              className={errors.street_address ? 'border-red-500' : ''}
            />
            {errors.street_address && (
              <p className="text-xs text-red-600 mt-1">{errors.street_address}</p>
            )}
          </div>

          {/* City and State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                City *
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
                <p className="text-xs text-red-600 mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                State *
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
                <p className="text-xs text-red-600 mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          {/* Postal Code and Country */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Postal Code *
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
                <p className="text-xs text-red-600 mt-1">{errors.postal_code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-stone-200">
            <Button
              type="button"
              onClick={onClose}
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
                'Add Address'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
