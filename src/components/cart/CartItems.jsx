import React from 'react';
import CartItem from './CartItem';

const CartItems = ({ items, onItemUpdate }) => {

  console.log('CartItems received items:', items);
  // Safety check for items
  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <div className="bg-white rounded-sm shadow-md border border-stone-100 p-12 text-center">
        <p className="text-stone-600">No items in cart</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm shadow-md border border-stone-100">
      {/* Header */}
      <div className="border-b border-stone-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-stone-900">Cart Items</h2>
      </div>

      {/* Items list */}
      <div className="divide-y divide-stone-100">
        {items.map((item) => (
          <CartItem 
            key={item.id} 
            item={item} 
            onItemUpdate={onItemUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default CartItems;