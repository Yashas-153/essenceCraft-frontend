import React from 'react';
import { Button } from '../ui/button';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATIC_API_URL = 'http://localhost:8000';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stock === 0) {
      return; // Don't allow adding to cart if out of stock
    }
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product.id);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    console.log('Toggle wishlist:', product.id);
  };

  return (
    <div 
      className="bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={handleViewProduct}
    >
      {/* Product image */}
      <div className="relative aspect-square bg-gradient-to-br from-stone-100 to-emerald-50 overflow-hidden">
        {/* Stock badge */}
        {product.stock <= 10 && product.stock > 0 && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-medium px-3 py-1 rounded-sm z-10">
            Only {product.stock} left
          </div>
        )}
        
        {/* Out of stock badge */}
        {product.stock === 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-sm z-10">
            Out of Stock
          </div>
        )}

        {/* Wishlist button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-emerald-50"
        >
          <Heart className="w-5 h-5 text-stone-600" />
        </button>

        {/* Product image */}
        {product.image_url ? (
          <img
            src={`${STATIC_API_URL}${product.image_url}`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback placeholder */}
        <div 
          className="w-full h-full flex items-center justify-center p-8"
          style={{ display: product.image_url ? 'none' : 'flex' }}
        >
          <div className="w-20 h-40 bg-amber-800 bg-opacity-70 rounded-sm shadow-lg"></div>
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-emerald-900 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-end justify-center pb-6">
          <Button 
            onClick={handleViewProduct}
            className="bg-white text-emerald-700 hover:bg-emerald-700 hover:text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 rounded-sm"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </Button>
        </div>
      </div>

      {/* Product details */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="font-semibold text-stone-900 text-lg mb-1 leading-tight line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-sm text-emerald-600">{product.category}</p>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-stone-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div>
            <span className="text-2xl font-semibold text-stone-900">
              {product.currency_symbol || '$'}{product.price.toFixed(2)}
            </span>
            <span className="text-sm text-stone-500 ml-1">/ 15ml</span>
            {/* Stock indicator */}
            {product.stock === 0 && (
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  ⚠️ Out of Stock
                </span>
              </div>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`${
              product.stock === 0 
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed hover:bg-stone-300' 
                : 'bg-emerald-700 hover:bg-emerald-800'
            } text-white rounded-sm`}
            size="sm"
            title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          >
            {product.stock === 0 ? (
              <span className="text-xs">Out of Stock</span>
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;