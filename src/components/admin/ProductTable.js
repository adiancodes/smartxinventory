import React from 'react';
import './ProductTable.css';

const ProductTable = ({ products, onEdit, onDelete }) => {
  
  const getStatusClass = (status) => {
    if (status === 'Out of Stock') return 'status-out-of-stock';
    if (status === 'Low Stock') return 'status-low-stock';
    return 'status-in-stock';
  };

  return (
    <div className="product-table-container">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Price (₹)</th>
            <th>Auto-Restock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.categoryName}</td>
              <td>{product.currentQuantity}</td>
              <td>
                <span className={`status-badge ${getStatusClass(product.status)}`}>
                  {product.status}
                </span>
              </td>
              <td>{product.price.toLocaleString('en-IN')}</td>
              <td>{product.autoRestockEnabled ? 'Enabled' : 'Disabled'}</td>
              <td>
                <button onClick={() => onEdit(product)} className="action-btn edit-btn">
                  Edit
                </button>
                <button onClick={() => onDelete(product.id)} className="action-btn delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && <p className="no-products">No products found.</p>}
    </div>
  );
};

export default ProductTable;