// This file is a COPY of AdminDashboard.js
import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import '../../pages/admin/AdminDashboard.css'; // We can reuse the CSS
import DashboardStatsCard from '../../components/admin/DashboardStatsCard';
import LowStockList from '../../components/admin/LowStockList';

// Just change the component name
const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // These same service calls will automatically be
    // filtered by the backend for the store manager
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          totalProductsRes,
          lowStockRes,
          outOfStockRes,
          totalValueRes,
        ] = await Promise.all([
          productService.getTotalProductsCount(),
          productService.getLowStockItemsCount(),
          productService.getOutOfStockItemsCount(),
          productService.getTotalInventoryValue(),
        ]);

        setStats({
          totalProducts: totalProductsRes.data,
          lowStockItems: lowStockRes.data,
          outOfStockItems: outOfStockRes.data,
          totalValue: totalValueRes.data,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        {/* All these components are reused */}
        <DashboardStatsCard 
          title="My Store: Total Products" 
          value={stats.totalProducts} 
        />
        <DashboardStatsCard 
          title="My Store: Total Value" 
          value={`₹${stats.totalValue.toLocaleString('en-IN')}`} 
        />
        <DashboardStatsCard 
          title="My Store: Low Stock" 
          value={stats.lowStockItems} 
          alert={stats.lowStockItems > 0}
        />
        <DashboardStatsCard 
          title="My Store: Out of Stock" 
          value={stats.outOfStockItems}
          alert={stats.outOfStockItems > 0}
        />
      </div>

      <div className="dashboard-widgets-grid">
        <div className="widget-card large">
          <h3>Low Stock Items (My Store)</h3>
          <LowStockList /> 
        </div>
        <div className="widget-card medium">
          <h3>Store Widget</h3>
          <p>(e.g., Purchase History - coming soon)</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard; // Make sure to export