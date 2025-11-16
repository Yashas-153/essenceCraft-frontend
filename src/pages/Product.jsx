import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, ArrowLeft, Loader2, Share2, CheckCircle } from 'lucide-react';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductDetails from '@/components/product/ProductDetails';
import RelatedProducts from '@/components/product/RelatedProducts';
import { useCart } from '@/hooks/useCart';

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(productId);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    // TODO: Implement add to cart
    console.log('Add to cart:', product.id, 'Quantity:', quantity);
    addItem(product.id, quantity);
  };

  const handleToggleWishlist = () => {
    // TODO: Implement wishlist
    console.log('Toggle wishlist:', product.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-stone-900 mb-4">Product Not Found</h2>
          <p className="text-stone-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/products')} className="bg-emerald-700 hover:bg-emerald-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-stone-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </button>
        </div>
      </div>

      {/* Product section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product images */}
            <ProductImageGallery 
              images={product.image_url ? [product.image_url] : []} 
              productName={product.name}
            />

            {/* Product info */}
            <div>
              {/* Stock status */}
              <div className="mb-4">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">In Stock ({product.stock} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Product name */}
              <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Category */}
              {product.category && (
                <p className="text-lg text-emerald-700 mb-6">{product.category}</p>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold text-stone-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-lg text-stone-500">/ 15ml</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-lg text-stone-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-stone-300 rounded-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-stone-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-6 py-2 font-medium border-x-2 border-stone-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 hover:bg-stone-100 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-stone-600">
                    Maximum: {product.stock}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white h-14 text-lg rounded-sm disabled:bg-stone-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className="border-2 border-stone-300 hover:bg-stone-50 h-14 px-6 rounded-sm"
                >
                  <Heart className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-stone-300 hover:bg-stone-50 h-14 px-6 rounded-sm"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Product features */}
              <ProductInfo product={product} />
            </div>
          </div>

          {/* Product details tabs */}
          <ProductDetails product={product} />

          {/* Related products */}
          <RelatedProducts currentProductId={product.id} />
        </div>
      </section>
    </div>
  );
};

export default Product;