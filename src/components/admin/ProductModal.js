import React, { useState, useEffect } from 'react';
import './ProductModal.css';

const ProductModal = ({ isOpen, onClose, onSave, productToEdit, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryName: '',
    supplier: '',
    currentQuantity: 0,
    minStockLevel: 10,
    maxStockLevel: 100,
    price: 0.0,
    autoRestockEnabled: false,
  });

  // Populate form if we are in "Edit" mode
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        sku: productToEdit.sku,
        categoryName: productToEdit.categoryName,
        supplier: productToEdit.supplier || '',
        currentQuantity: productToEdit.currentQuantity,
        minStockLevel: productToEdit.minStockLevel,
        maxStockLevel: productToEdit.maxStockLevel,
        price: productToEdit.price,
        autoRestockEnabled: productToEdit.autoRestockEnabled,
      });
    } else {
      // Reset form for "Add" mode
      setFormData({
        name: '',
        sku: '',
        categoryName: categories.length > 0 ? categories[0].name : '', // Default to first category
        supplier: '',
        currentQuantity: 0,
        minStockLevel: 10,
        maxStockLevel: 100,
        price: 0.0,
        autoRestockEnabled: false,
      });
    }
  }, [productToEdit, categories, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert numbers from strings
    const dataToSave = {
      ...formData,
      currentQuantity: parseInt(formData.currentQuantity, 10),
      minStockLevel: parseInt(formData.minStockLevel, 10),
      maxStockLevel: parseInt(formData.maxStockLevel, 10),
      price: parseFloat(formData.price),
    };
    
    onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{productToEdit ? 'Edit Product' : 'Add New Product'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>SKU (Product ID)</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="categoryName" value={formData.categoryName} onChange={handleChange} required>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {/* Later, we can add a button here to create a new category */}
            </div>
            <div className="form-group">
              <label>Supplier</label>
              <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Current Quantity</label>
              <input type="number" name="currentQuantity" value={formData.currentQuantity} onChange={handleChange} min="0" required />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
            </div>
            <div className="form-group">
              <label>Min Stock Level</label>
              <input type="number" name="minStockLevel" value={formData.minStockLevel} onChange={handleChange} min="0" required />
            </div>
            <div className="form-group">
              <label>Max Stock Level</label>
              <input type="number" name="maxStockLevel" value={formData.maxStockLevel} onChange={handleChange} min="0" required />
            </div>
          </div>
          
          <div className="form-group-checkbox">
            <input type="checkbox" id="autoRestock" name="autoRestockEnabled" checked={formData.autoRestockEnabled} onChange={handleChange} />
            <label htmlFor="autoRestock">Enable Auto-Restock</label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-save">
              {productToEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;