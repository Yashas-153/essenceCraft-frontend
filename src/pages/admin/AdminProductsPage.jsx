import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductList from '../../components/admin/ProductList';
import ProductForm from '../../components/admin/ProductForm';
import { withAdminAuth } from '../../hooks/useAdminAuth';
import { useAdminProducts } from '../../hooks/useAdminProducts';

const AdminProductsPage = () => {
  const { deleteProduct, refresh } = useAdminProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleViewProduct = (product) => {
    // Could navigate to product detail page or show modal
    window.open(`/products/${product.id}`, '_blank');
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      const result = await deleteProduct(productToDelete.id);
      if (result.success) {
        setShowDeleteModal(false);
        setProductToDelete(null);
        // Refresh the product list after deletion
        await refresh();
      }
    }
  };

  const handleFormSave = async (product) => {
    setShowForm(false);
    setSelectedProduct(null);
    // Refresh the product list to show updated data
    await refresh();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  return (
    <AdminLayout>
      <ProductList
        onAdd={handleAddProduct}
        onEdit={handleEditProduct}
        onView={handleViewProduct}
        onDelete={handleDeleteProduct}
      />

      <ProductForm
        product={selectedProduct}
        isOpen={showForm}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">
                Delete Product
              </h3>
              <p className="text-stone-600 mb-6">
                Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-800 border border-stone-300 rounded-md hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default withAdminAuth(AdminProductsPage);