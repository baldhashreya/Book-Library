import React from "react";
import MainLayout from "../../shared/layouts/MainLayout";

const Dashboard: React.FC = () => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : {};

  return (
    <MainLayout>
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome back, {user.name}!</h2>
          <p>Login successful! You are now on the dashboard.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
