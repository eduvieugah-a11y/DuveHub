import "./Dashboard.css";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name} 👋</h1>
      <p>This is your Event Dashboard.</p>

      <div className="dashboard-cards">
        <div className="card">
          <h2>0</h2>
          <p>Bookings</p>
        </div>

        <div className="card">
          <h2>0</h2>
          <p>Upcoming Events</p>
        </div>

        <div className="card">
          <h2>0</h2>
          <p>Favourite Events</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;