import "./UserDashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../api/config";

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/bookings/${user._id}`
        );

        setBookings(res.data);
      } catch (error) {
        console.error("Failed to load bookings:", error);
      }
    };

    if (user?._id) {
      fetchBookings();
    }
  }, []);

  const totalSpent = bookings.reduce(
    (sum, booking) => sum + Number(booking.total || 0),
    0
  );

  const upcomingBookings = bookings.filter((booking) => {
    if (!booking.eventDate) return false;

    return new Date(booking.eventDate) >= new Date();
  });

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>
          👋 Welcome back, {user?.name}
        </h1>

        <p>
          Manage your bookings and events from one place.
        </p>
      </div>

      <div className="dashboard-cards">

        <div className="card">
          <h2>{bookings.length}</h2>
          <p>My Bookings</p>
        </div>

        <div className="card">
          <h2>{upcomingBookings.length}</h2>
          <p>Upcoming Events</p>
        </div>

        <div className="card">
          <h2>0</h2>
          <p>Favourite Events</p>
        </div>

        <div className="card">
          <h2>
            ₦{totalSpent.toLocaleString()}
          </h2>
          <p>Total Spent</p>
        </div>

      </div>

      <div className="recent-bookings">

        <h2>Recent Bookings</h2>

        {bookings.length === 0 ? (
          <p>
            You haven't booked any events yet.
          </p>
        ) : (

          <table>

            <thead>
              <tr>
                <th>Event</th>
                <th>Tickets</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Reference</th>
              </tr>
            </thead>

            <tbody>

              {bookings.map((booking) => (

                <tr key={booking._id}>

                  <td>
                    {booking.eventTitle}
                  </td>

                  <td>
                    {booking.tickets}
                  </td>

                  <td>
                    ₦{Number(
                      booking.total || 0
                    ).toLocaleString()}
                  </td>

                  <td>
                    {new Date(
                      booking.createdAt
                    ).toLocaleDateString("en-GB")}
                  </td>

                  <td>
                    <span className="status confirmed">
                      Confirmed
                    </span>
                  </td>

                  <td>
                    {booking.bookingReference}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default UserDashboard;