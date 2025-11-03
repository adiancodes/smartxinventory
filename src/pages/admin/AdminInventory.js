import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import './AdminInventory.css';
import ProductModal from '../../components/admin/ProductModal'; // The Add/Edit form
import ProductTable from '../../components/admin/ProductTable'; // The main table

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null); // If null, it's "Add" mode
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAllProducts(searchTerm),
        productService.getAllCategories(),
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
  }, [searchTerm]); // Refetch when searchTerm changes

  // Modal handlers
  const openAddModal = () => {
    setProductToEdit(null); // Clear any edit data
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

  // CRUD handlers (these trigger API calls and refetch data)
  const handleSaveProduct = async (productData) => {
    try {
      if (productToEdit) {
        // Update
        await productService.updateProduct(productToEdit.id, productData);
      } else {
        // Create
        await productService.createProduct(productData);
      }
      closeModal();
      fetchData(); // Refresh the table
    } catch (err) {
      console.error('Failed to save product:', err);
      // You should show an error message on the modal
      alert('Failed to save product. Check console for details.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        fetchData(); // Refresh the table
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product.');
      }
    }
  };

  return (
    <div className="admin-inventory">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <button onClick={openAddModal} className="add-product-btn">
          + Add New Product
        </button>
      </div>
      
      <div className="inventory-controls">
        <input 
          type="text"
          placeholder="Search by name, SKU, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        {/* We can add category filters here later */}
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
          categories={categories} // Pass categories for the dropdown
        />
      )}
    </div>
  );
};

// --- THIS IS THE CRITICAL LINE YOU ARE LIKELY MISSING ---
export default AdminInventory;