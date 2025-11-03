import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import './AdminDashboard.css';

// We'll create this component
import DashboardStatsCard from '../../components/admin/DashboardStatsCard'; 
// We'll also need a list component for "Low Stock Items"
import LowStockList from '../../components/admin/LowStockList';

// 

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all stats concurrently
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
      {/* Top Stats Cards */}
      <div className="stats-grid">
        <DashboardStatsCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon="products" 
        />
        <DashboardStatsCard 
          title="Total Inventory Value" 
          value={`₹${stats.totalValue.toLocaleString('en-IN')}`} 
          icon="value" 
        />
        <DashboardStatsCard 
          title="Low Stock Items" 
          value={stats.lowStockItems} 
          icon="low-stock" 
          alert={stats.lowStockItems > 0}
        />
        <DashboardStatsCard 
          title="Out of Stock Items" 
          value={stats.outOfStockItems} 
          icon="out-of-stock"
          alert={stats.outOfStockItems > 0}
        />
      </div>

      {/* Other components from images */}
      <div className="dashboard-widgets-grid">
        <div className="widget-card large">
          <h3>Low Stock Items</h3>
          {/* This component will fetch and display the actual items */}
          <LowStockList /> 
        </div>
        <div className="widget-card medium">
          <h3>Other Widget</h3>
          <p>(e.g., Sales Overview)</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;