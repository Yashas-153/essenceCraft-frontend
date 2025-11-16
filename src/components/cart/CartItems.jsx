import React from 'react';
import CartItem from './CartItems';

const CartItems = ({ items }) => {
  return (
    <div className="bg-white rounded-sm shadow-md border border-stone-100">
      {/* Header */}
      <div className="border-b border-stone-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-stone-900">Cart Items</h2>
      </div>

      {/* Items list */}
      <div className="divide-y divide-stone-100">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CartItems;