// src/Dashboard.js
import React from 'react';
import DataForm from './DataForm';
import './Dashboard.css'; // Import the CSS file

const Dashboard = ({ username }) => {
  return (
    <div>
      <h1 className="dashboard-title">
        Welcome to the Dashboard, {username}!
      </h1>
      <DataForm />
    </div>
  );
};

export default Dashboard;
