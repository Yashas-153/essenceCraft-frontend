import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductImageGallery = ({ images, productName }) => {
  const [currentImage, setCurrentImage] = useState(0);

  // If no images, show placeholder
  const displayImages = images && images.length > 0 
    ? images 
    : [null]; // null will trigger placeholder

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square bg-gradient-to-br from-stone-100 to-emerald-50 rounded-sm shadow-lg overflow-hidden group">
        {displayImages[currentImage] ? (
          <img
            src={displayImages[currentImage]}
            alt={`${productName} - Image ${currentImage + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Placeholder */}
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{ display: displayImages[currentImage] ? 'none' : 'flex' }}
        >
          <div className="text-center">
            <div className="w-32 h-64 bg-amber-800 bg-opacity-70 rounded-sm shadow-2xl mx-auto mb-4"></div>
            <p className="text-stone-500 text-sm">15ml Amber Bottle</p>
          </div>
        </div>

        {/* Navigation arrows - only show if multiple images */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-stone-50"
            >
              <ChevronLeft className="w-6 h-6 text-stone-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-stone-50"
            >
              <ChevronRight className="w-6 h-6 text-stone-700" />
            </button>
          </>
        )}

        {/* Image counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
            {currentImage + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail navigation - only show if multiple images */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`aspect-square rounded-sm overflow-hidden border-2 transition-all ${
                currentImage === index
                  ? 'border-emerald-600 shadow-md'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {image ? (
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-stone-100 to-emerald-50 flex items-center justify-center">
                  <div className="w-8 h-16 bg-amber-800 bg-opacity-70 rounded-sm"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;