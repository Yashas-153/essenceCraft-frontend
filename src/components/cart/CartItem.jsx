import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onItemUpdate }) => {
  const { updateItem, removeItem, currency } = useCart();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Defensive logging and guards
  console.log('CartItem received item:', item);
  console.log('💱 Currency context:', currency);

  if (!item) {
    return (
      <div className="p-4">
        <p className="text-stone-600">Item data missing</p>
      </div>
    );
  }

  const { id, product = {}, quantity = 0, product_id } = item;
  
  // Handle both old and new API response formats
  const name = product?.name || product?.title || 'Unknown product';
  const price = product?.price || 0;
  const imageUrl = product?.image_url || (product?.images && product.images.length > 0 ? product.images[0] : '');
  const productId = product?.id || product_id;
  const currencySymbol = currency?.symbol || '$';

  console.log('🛒 Cart Item Details:', { name, price, imageUrl, productId, currencySymbol });

  const handleIncreaseQuantity = async () => {
    setIsUpdating(true);
    await updateItem(id, quantity + 1);
    if (onItemUpdate) onItemUpdate();
    setIsUpdating(false);
  };

  const handleDecreaseQuantity = async () => {
    if (quantity > 1) {
      setIsUpdating(true);
      await updateItem(id, quantity - 1);
      if (onItemUpdate) onItemUpdate();
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async () => {
    if (window.confirm(`Remove ${name} from cart?`)) {
      setIsRemoving(true);
      await removeItem(id);
      if (onItemUpdate) onItemUpdate();
      setIsRemoving(false);
    }
  };

  const handleProductClick = () => {
    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-colors cursor-pointer group">
      {/* Product Image */}
      <div 
        onClick={handleProductClick}
        className="w-20 h-20 bg-stone-100 rounded-sm flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:shadow-md transition-shadow"
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="text-sm text-stone-500">No image</div>
        )}
      </div>

      {/* Product Info - Clickable */}
      <div 
        onClick={handleProductClick}
        className="flex-1"
      >
        <h3 className="text-sm font-medium text-stone-900 hover:text-emerald-700 transition-colors group-hover:underline">
          {name}
        </h3>
        <p className="text-sm text-stone-600 mt-1">
          {currencySymbol}{price.toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 bg-stone-100 rounded-sm p-1">
        <button
          onClick={handleDecreaseQuantity}
          disabled={isUpdating || quantity <= 1}
          className="p-1 hover:bg-stone-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4 text-stone-600" />
        </button>
        <span className="w-6 text-center text-sm font-medium text-stone-900">
          {quantity}
        </span>
        <button
          onClick={handleIncreaseQuantity}
          disabled={isUpdating}
          className="p-1 hover:bg-stone-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4 text-stone-600" />
        </button>
      </div>

      {/* Price */}
      <div className="text-right min-w-24">
        <div className="text-sm font-semibold text-stone-900">
          {currencySymbol}{(price * quantity).toFixed(2)}
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemoveItem}
        disabled={isRemoving}
        className="p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Remove item from cart"
      >
        <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
      </button>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    product_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    quantity: PropTypes.number,
    product: PropTypes.object,
  }),
  onItemUpdate: PropTypes.func,
};

export default CartItem;