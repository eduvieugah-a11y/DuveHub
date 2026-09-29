import "./AdminDashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { API_URL } from "../../api/config";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/dashboard`  
        );
        setStats(res.data);
      }catch (error) {
        console.error("Failed to load dashboard:", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <AdminLayout>
    <div className="admin-dashboard">
      <h1>Dashboard</h1>

      <div className="admin-cards">

        <div className="admin-card">
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>

        <div className="admin-card">
          <h2>{stats.totalEvents}</h2>
          <p>Total Events</p>
        </div>

        <div className="admin-card">
          <h2>{stats.totalBookings}</h2>
          <p>Total Bookings</p>
        </div>

        <div className="admin-card">
          <h2>₦{stats.totalRevenue.toLocaleString()}</h2>
          <p>Total Revenue</p>
        </div>

      </div>
    </div>
    </AdminLayout>
  );
}

export default AdminDashboard;