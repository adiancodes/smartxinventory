import React from 'react';
import './DashboardStatsCard.css';

const DashboardStatsCard = ({ title, value, icon, alert = false }) => {
  return (
    <div className={`stats-card ${alert ? 'alert' : ''}`}>
      <div className="stats-card-icon">
        {/* Add icons here */}
      </div>
      <div className="stats-card-info">
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default DashboardStatsCard;