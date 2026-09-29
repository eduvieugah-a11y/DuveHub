import { useEffect, useState } from "react";
import axios from "axios";
import OrganiserLayout from "../../layouts/OrganiserLayout";
import { API_URL } from "../../api/config";

function OrganiserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user?._id) {
          setLoading(false);
          return;
        }

        const [eventsResponse, bookingsResponse] = await Promise.all([
          axios.get(
            `${API_URL}/api/events/organiser/${user._id}`
          ),

          axios.get(
            `${API_URL}/api/bookings/organiser/${user._id}`
          ),
        ]);

        setEvents(eventsResponse.data);
        setBookings(bookingsResponse.data);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?._id]);

  const ticketsSold = bookings.reduce(
    (total, booking) => total + Number(booking.tickets || 0),
    0
  );

  const totalRevenue = bookings.reduce(
    (total, booking) => total + Number(booking.total || 0),
    0
  );

  const recentBookings = bookings.slice(0, 5);

  return (
    <OrganiserLayout>
      <div style={{ padding: "30px" }}>

        <h1>
          Welcome back, {user?.name || "Organiser"} 👋
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "#666",
          }}
        >
          Manage your events, ticket sales and premium subscription.
        </p>

        {/* STATISTICS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginTop: "40px",
          }}
        >

          <div className="card">
            <h2>{loading ? "..." : events.length}</h2>
            <p>My Events</p>
          </div>

          <div className="card">
            <h2>{loading ? "..." : ticketsSold}</h2>
            <p>Tickets Sold</p>
          </div>

          <div className="card">
            <h2>
              {loading
                ? "..."
                : `₦${totalRevenue.toLocaleString()}`}
            </h2>

            <p>Total Revenue</p>
          </div>

          <div className="card">
            <h2>{user?.plan || "Free"}</h2>
            <p>Current Plan</p>
          </div>

        </div>

        {/* RECENT BOOKINGS */}

        <div
          style={{
            marginTop: "40px",
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >

          <h2 style={{ marginBottom: "20px" }}>
            Recent Bookings
          </h2>

          {loading ? (
            <p>Loading bookings...</p>
          ) : recentBookings.length === 0 ? (
            <p style={{ color: "#777" }}>
              No bookings yet.
            </p>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >

                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Customer
                    </th>

                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Event
                    </th>

                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Tickets
                    </th>

                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Amount
                    </th>

                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      Reference
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {recentBookings.map((booking) => (
                    <tr key={booking._id}>

                      <td
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #f1f1f1",
                        }}
                      >
                        {booking.name}
                      </td>

                      <td
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #f1f1f1",
                        }}
                      >
                        {booking.eventTitle}
                      </td>

                      <td
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #f1f1f1",
                        }}
                      >
                        {booking.tickets}
                      </td>

                      <td
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #f1f1f1",
                        }}
                      >
                        ₦{Number(booking.total).toLocaleString()}
                      </td>

                      <td
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #f1f1f1",
                        }}
                      >
                        {booking.bookingReference}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* MY EVENTS */}

        <div
          style={{
            marginTop: "40px",
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >

          <h2 style={{ marginBottom: "20px" }}>
            My Events
          </h2>

          {loading ? (
            <p>Loading events...</p>
          ) : events.length === 0 ? (
            <p style={{ color: "#777" }}>
              You haven't created any events yet.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "15px",
              }}
            >

              {events.map((event) => {

                const eventBookings = bookings.filter(
                  (booking) =>
                    String(booking.eventId?._id || booking.eventId) ===
                    String(event._id)
                );

                const sold = eventBookings.reduce(
                  (total, booking) =>
                    total + Number(booking.tickets || 0),
                  0
                );

                const ticketsLeft = Math.max(
                  Number(event.tickets) - sold,
                  0
                );

                return (
                  <div
                    key={event._id}
                    style={{
                      border: "1px solid #eee",
                      borderRadius: "10px",
                      padding: "18px",
                    }}
                  >

                    <h3>{event.title}</h3>

                    <p
                      style={{
                        marginTop: "8px",
                        color: "#666",
                      }}
                    >
                      📍 {event.location}
                    </p>

                    <p
                      style={{
                        marginTop: "8px",
                      }}
                    >
                      🎟 Total Tickets: {event.tickets}
                    </p>

                    <p
                      style={{
                        marginTop: "5px",
                      }}
                    >
                      🎫 Tickets Sold: {sold}
                    </p>

                    <p
                      style={{
                        marginTop: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      🟢 Tickets Left: {ticketsLeft}
                    </p>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </OrganiserLayout>
  );
}

export default OrganiserDashboard;