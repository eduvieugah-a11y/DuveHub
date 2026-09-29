import "./AdminBookings.css";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { API_URL } from "../../api/config";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchBookings = async () => {
    try {
      setLoading(true);

      let url = `${API_URL}/api/bookings`;

      if (user?.role === "organiser") {
        url = `${API_URL}/api/bookings/organiser/${user._id}`
      }

      const res = await axios.get(url);

      setBookings(res.data);
    } catch (error) {
      console.error("Unable to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const deleteBooking = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/api/bookings/organiser/${user._id}`
      );

      alert("Booking deleted successfully.");

      fetchBookings();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete booking."
      );
    }
  };

  const totalTickets = bookings.reduce(
    (sum, booking) =>
      sum + Number(booking.tickets || 0),
    0
  );

  const totalRevenue = bookings.reduce(
    (sum, booking) =>
      sum + Number(booking.total || 0),
    0
  );

  return (
    <AdminLayout>
      <div className="admin-bookings">

        <h1>
          {user?.role === "organiser"
            ? "Ticket Sales"
            : "Manage Bookings"}
        </h1>

        <p style={{ color: "#666", marginTop: "8px" }}>
          {user?.role === "organiser"
            ? "View bookings and ticket sales for your events."
            : "View and manage all event bookings."}
        </p>

        {/* SUMMARY */}
        <div className="booking-summary">

          <div className="booking-summary-card">
            <h2>{bookings.length}</h2>
            <p>Total Bookings</p>
          </div>

          <div className="booking-summary-card">
            <h2>{totalTickets}</h2>
            <p>Tickets Sold</p>
          </div>

          <div className="booking-summary-card">
            <h2>
              ₦{totalRevenue.toLocaleString()}
            </h2>
            <p>Total Revenue</p>
          </div>

        </div>

        {/* LOADING */}
        {loading ? (
          <div className="no-bookings">
            <h2>Loading bookings...</h2>
          </div>
        ) : bookings.length > 0 ? (

          <table>

            <thead>
              <tr>
                <th>Reference</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Event</th>
                <th>Tickets</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {bookings.map((booking) => (

                <tr key={booking._id}>

                  <td>
                    {booking.bookingReference}
                  </td>

                  <td>
                    {booking.name}
                  </td>

                  <td>
                    {booking.email}
                  </td>

                  <td>
                    {booking.eventTitle}
                  </td>

                  <td>
                    {booking.tickets}
                  </td>

                  <td>
                    ₦
                    {Number(
                      booking.total || 0
                    ).toLocaleString()}
                  </td>

                  <td>
                    {new Date(
                      booking.createdAt
                    ).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteBooking(
                          booking._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        ) : (

          <div className="no-bookings">

            <h2>No ticket sales yet</h2>

            <p>
              Bookings for your events will
              appear here.
            </p>

          </div>

        )}

      </div>
    </AdminLayout>
  );
}

export default AdminBookings;