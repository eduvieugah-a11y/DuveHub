import "./CreateEvent.css";
import PremiumModal from "../../components/PremiumModal/PremiumModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { API_URL } from "../../api/config";

function CreateEvent() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [tickets, setTickets] = useState("");
  const [description, setDescription] = useState("");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (!user) {
      alert("Please login first.");
      navigate("/");
      return;
    }

    if (
      user.role !== "organiser" &&
      user.role !== "admin"
    ) {
      alert(
        "You need to become an organiser before creating events."
      );
      navigate("/become-organiser");
    }
  }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Restrict FREE organisers to 10 tickets
    if (
      user.role === "organiser" &&
      user.plan === "free" &&
      Number(tickets) > 10
    ) {
      setShowPremiumModal(true);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("organiser", user._id);
      formData.append("title", title);
      formData.append("category", category)
      formData.append("location", location);
      formData.append("date", date);
      formData.append("price", price);
      formData.append("tickets", tickets);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      const res = await axios.post(
        `${API_URL}/api/events`,
        formData,
       {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);

      setTitle("");
      setCategory("")
      setLocation("");
      setDate("");
      setPrice("");
      setTickets("");
      setDescription("");
      setImage(null);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create event."
      );
    }
  };

  return (
    <AdminLayout>
      <section className="create-event">
        <div className="create-event-container">
          <div className="page-header">
            <h1>Create New Event</h1>
            <p>Create and publish an event for people across Nigeria</p>
          </div>
          
         <form onSubmit={handleSubmit} className="event-form">
           <div className="form-grid">
             <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  placeholder="Enter event title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Music">Music</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Food">Food</option>
                  <option value="Sports">Sports</option>
                  <option value="Art">Art</option>
                </select>

              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ticket Price</label>
                <input
                  type="number"
                  placeholder="₦5000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Available Tickets</label>
                <input
                  type="number"
                  placeholder="100"
                  value={tickets}
                  onChange={(e) => setTickets(e.target.value)}
                  required
                />
              </div>
            </div>
  
            <div className="form-group">
              <label>Upload Event Banner</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="7"
                placeholder="Describe your event..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <button className="create-btn" type="submit">Publish Event</button>

          </form>
        </div>
      </section>

      <PremiumModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </AdminLayout>
  );
}

export default CreateEvent;