import React, { useState, useEffect } from 'react';
import { Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useAdminProducts } from '../../hooks/useAdminProducts';
import { Button } from '../ui/button';

const ProductForm = ({ product, onSave, onCancel, isOpen }) => {
  const { createProduct, updateProduct, loading } = useAdminProducts();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image_url: '',
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const [imageInputType, setImageInputType] = useState('url'); // 'url' | 'upload'
  const [imageFile, setImageFile] = useState(null);

  // Reset form when product changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          stock: product.stock?.toString() || '',
          category: product.category || '',
          image_url: product.image_url || '',
          is_active: product.is_active !== undefined ? product.is_active : true,
        });
        setImageInputType(product.image_url ? 'url' : 'upload');
        setImageFile(null);
      } else {
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          category: '',
          image_url: '',
          is_active: true,
        });
        setImageInputType('url');
        setImageFile(null);
      }
      setErrors({});
    }
  }, [product, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be 0 or greater';
    }

    // if (!formData.category.trim()) {
    //   newErrors.category = 'Category is required';
    // }

    // Image validation based on input type
    if (imageInputType === 'upload') {
      if (!imageFile && !product) {
        newErrors.image = 'Please upload a product image';
      }
    } else if (imageInputType === 'url') {
      if (formData.image_url && !/^https?:\/\//i.test(formData.image_url)) {
        // newErrors.image_url = 'Please provide a valid URL starting with http or https';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const baseData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category.trim(),
        is_active: formData.is_active,
      };

      let payload;
      if (imageInputType === 'upload') {
        // Build multipart form data; send photo in the form only
        const fd = new FormData();
        Object.entries(baseData).forEach(([key, value]) => fd.append(key, value));
        if (imageFile) {
          fd.append('image', imageFile); // backend should read 'image' file
        }
        payload = fd;
      } else {
        payload = { ...baseData, image_url: formData.image_url.trim() };
      }

      let result;
      if (product) {
        result = await updateProduct(product.id, payload);
      } else {
        result = await createProduct(payload);
      }

      if (result.success) {
        onSave(result.product);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image_url: '',
      is_active: true,
    });
    setImageInputType('url');
    setImageFile(null);
    setErrors({});
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="text-xl font-semibold text-stone-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.name ? 'border-red-300' : 'border-stone-300'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.description ? 'border-red-300' : 'border-stone-300'
              }`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.price ? 'border-red-300' : 'border-stone-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.stock ? 'border-red-300' : 'border-stone-300'
                }`}
                placeholder="0"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.category ? 'border-red-300' : 'border-stone-300'
              }`}
              placeholder="e.g., Essential Oils, Aromatherapy"
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Image input toggle: URL or Upload */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Image</label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="radio"
                  name="image_input_type"
                  checked={imageInputType === 'url'}
                  onChange={() => setImageInputType('url')}
                />
                Use URL
              </label>
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="radio"
                  name="image_input_type"
                  checked={imageInputType === 'upload'}
                  onChange={() => setImageInputType('upload')}
                />
                Upload File
              </label>
            </div>

            {imageInputType === 'url' ? (
              <div>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.image_url ? 'border-red-300' : 'border-stone-300'
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image_url && (
                  <p className="mt-1 text-sm text-red-600">{errors.image_url}</p>
                )}
                {formData.image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.image_url}
                      alt="Product preview"
                      className="h-20 w-20 object-cover rounded-md border border-stone-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImageFile(file);
                      // If uploading, clear image_url
                      if (file) {
                        setFormData(prev => ({ ...prev, image_url: '' }));
                      }
                      if (errors.image) {
                        setErrors(prev => ({ ...prev, image: '' }));
                      }
                    }}
                    className="block w-full text-sm text-stone-700"
                  />
                  <Upload className="h-5 w-5 text-stone-500" />
                </div>
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
                {imageFile && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Product preview"
                      className="h-20 w-20 object-cover rounded-md border border-stone-200"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-stone-300 rounded"
            />
            <label className="ml-2 block text-sm text-stone-700">
              Product is active (visible in store)
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-stone-200">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;