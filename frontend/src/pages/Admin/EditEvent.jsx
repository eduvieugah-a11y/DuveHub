import "./CreateEvent.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { API_URL } from "../../api/config";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/events/${id}`
      );

      setTitle(res.data.title);
      setLocation(res.data.location);
      setDate(res.data.date.split("T")[0]);
      setPrice(res.data.price);
      setDescription(res.data.description);
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API_URL}/api/events/${id}`,
        {
          title,
          location,
          date,
          price,
          description,
        }
      );

      alert("Event updated successfully!");

      navigate("/admin/events");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update event."
      );
    }
  };

  return (
    <AdminLayout>
      <section className="create-event">
        <div className="create-event-container">
          <h1>Edit Event</h1>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <textarea
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <button type="submit">
              Update Event
            </button>

          </form>
        </div>
      </section>
    </AdminLayout>
  );
}

export default EditEvent;