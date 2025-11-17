import React, { useState } from 'react';
import { MapPin, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddressForm from './AddressForm';

const AddressSelector = ({
  addresses = [],
  selectedAddressId = null,
  onSelectAddress = () => {},
  isLoading = false,
  onContinue = () => {},
  onAddressChange = () => {}
}) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const handleAddressCreated = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    // Notify parent component to refresh addresses
    onAddressChange();
  };

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h2 className="text-2xl font-semibold text-stone-900 flex items-center gap-2 mb-2">
          <MapPin className="w-6 h-6 text-emerald-700" />
          Delivery Address
        </h2>
        <p className="text-stone-600">
          Select a delivery address or add a new one
        </p>
      </div>

      {/* Address form - Toggle display */}
      {showAddressForm && (
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-stone-900">
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button
              onClick={() => {
                setShowAddressForm(false);
                setEditingAddressId(null);
              }}
              className="text-stone-500 hover:text-stone-700"
            >
              ✕
            </button>
          </div>
          <AddressForm
            addressId={editingAddressId}
            onSuccess={handleAddressCreated}
            onCancel={() => {
              setShowAddressForm(false);
              setEditingAddressId(null);
            }}
          />
        </div>
      )}

      {/* Addresses list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mr-2" />
          <p className="text-stone-600">Loading addresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-lg p-12 text-center">
          <MapPin className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <p className="text-stone-600 mb-4">No addresses saved yet</p>
          <Button
            onClick={() => setShowAddressForm(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 mb-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => onSelectAddress(address.id)}
              className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                selectedAddressId === address.id
                  ? 'border-emerald-700 bg-emerald-50'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Radio button */}
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 flex items-center justify-center ${
                    selectedAddressId === address.id
                      ? 'border-emerald-700 bg-emerald-700'
                      : 'border-stone-300'
                  }`}
                >
                  {selectedAddressId === address.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>

                {/* Address details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-stone-900">
                        {address.street_address || address.street}
                      </p>
                      <p className="text-sm text-stone-600 mt-1">
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                      <p className="text-sm text-stone-600">
                        {address.country}
                      </p>
                    </div>
                    {address.is_default && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                {selectedAddressId === address.id && (
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAddressId(address.id);
                        setShowAddressForm(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="border-stone-300 text-stone-700 hover:bg-stone-100"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new address button */}
      {!showAddressForm && addresses.length > 0 && (
        <Button
          onClick={() => setShowAddressForm(true)}
          variant="outline"
          className="w-full border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 py-3"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Address
        </Button>
      )}

      {/* Continue button */}
      {!showAddressForm && (
        <Button
          onClick={onContinue}
          disabled={!selectedAddressId}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 text-lg disabled:opacity-50"
        >
          Continue to Payment
        </Button>
      )}
    </div>
  );
};

export default AddressSelector;
