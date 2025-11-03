// This file is a COPY of AdminInventory.js
import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import '../../pages/admin/AdminInventory.css'; // Reuse the CSS
import ProductModal from '../../components/admin/ProductModal';
import ProductTable from '../../components/admin/ProductTable';

// Just change the component name
const ManagerInventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // All these service calls are IDENTICAL to the admin page
  // The backend will handle filtering by store automatically
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAllProducts(searchTerm),
        productService.getAllCategories(), // Assumes managers can see all categories
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const openAddModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (productToEdit) {
        await productService.updateProduct(productToEdit.id, productData);
      } else {
        await productService.createProduct(productData);
      }
      closeModal();
      fetchData();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product. Check console for details.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        fetchData();
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product.');
      }
    }
  };

  return (
    <div className="admin-inventory">
      <div className="inventory-header">
        <h2>My Store Inventory</h2>
        <button onClick={openAddModal} className="add-product-btn">
          + Add New Product
        </button>
      </div>
      
      <div className="inventory-controls">
        <input 
          type="text"
          placeholder="Search my store by name, SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!loading && !error && (
        <ProductTable 
          products={products} 
          onEdit={openEditModal} 
          onDelete={handleDeleteProduct}
        />
      )}

      {isModalOpen && (
        <ProductModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveProduct}
          productToEdit={productToEdit}
          categories={categories}
        />
      )}
    </div>
  );
};

export default ManagerInventory; // Make sure to export