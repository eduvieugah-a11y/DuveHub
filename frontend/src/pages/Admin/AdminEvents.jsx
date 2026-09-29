import "./AdminEvents.css";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { Link } from "react-router-dom";
import { API_URL } from "../../api/config";

function AdminEvents() {
  const [events, setEvents] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch events
  const fetchEvents = async () => {
    try {
      let url = `${API_URL}/api/events`;

      // Organisers should only see their own events
      if (user?.role === "organiser") {
        url = `${API_URL}/api/events/organiser/${user._id}`
      }

      const res = await axios.get(url);

      setEvents(res.data);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Delete event
  const deleteEvent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/api/events/organiser/${user._id}`
      );

      alert("Event deleted successfully!");

      fetchEvents();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete event."
      );
    }
  };

  return (
    <AdminLayout>
      <div className="admin-events">
        <h1>
          {user?.role === "organiser"
            ? "My Events"
            : "Manage Events"}
        </h1>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Date</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>

                  <td>{event.location}</td>

                  <td>
                    {new Date(event.date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </td>

                  <td>
                    ₦{Number(event.price).toLocaleString()}
                  </td>

                  <td>
                    <Link
                      to={`/admin/edit-event/${event._id}`}
                    >
                      <button className="edit-btn">
                        Edit
                      </button>
                    </Link>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteEvent(event._id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center" }}
                >
                  You haven't created any events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminEvents;