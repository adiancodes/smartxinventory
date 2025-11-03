import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import './LowStockList.css';

const LowStockList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getLowStockProducts()
      .then(response => {
        setItems(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch low stock items:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading items...</p>;
  if (items.length === 0) return <p>No low stock items. Well done!</p>;

  return (
    <div className="low-stock-list">
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>SKU</th>
            <th>Qty Left</th>
            <th>Min Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td className="qty-alert">{item.currentQuantity}</td>
              <td>{item.minStockLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LowStockList;