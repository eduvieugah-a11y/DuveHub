import "./BecomeOrganiser.css";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../api/config";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function BecomeOrganiser() {
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    category: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get logged-in user
    const currentUser = JSON.parse(
      localStorage.getItem("user")
    );

    // Make sure a user is logged in
    if (!currentUser?._id) {
      alert("Please login before applying to become an organiser.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/organiser/apply`,
        {
          ...formData,
          user: currentUser._id,
        }
      );

      alert("Application submitted successfully!");

      // Clear form
      setFormData({
        businessName: "",
        phone: "",
        category: "",
        reason: "",
      });

    } catch (error) {
      console.error(
        "Organiser application error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Something went wrong."
      );
    }
  };

  return (
    <>
      <Navbar />

      <section className="organiser-hero">

        <div className="hero-left">

          <span className="badge">
            🚀 Start Selling Events
          </span>

          <h1>
            Become an Organiser on DuvieHub
          </h1>

          <p>
            Reach thousands of event lovers across Nigeria,
            sell tickets online, manage attendees and grow
            your business effortlessly.
          </p>

          <div className="hero-features">
            <div>✔ Create Unlimited Events</div>
            <div>✔ Receive Bookings Instantly</div>
            <div>✔ Track Ticket Sales</div>
            <div>✔ Grow Your Brand</div>
          </div>

        </div>

        <div className="hero-right">

          <form onSubmit={handleSubmit}>

            <h2>Apply Now</h2>

            <input
              type="text"
              name="businessName"
              placeholder="Business / Organisation Name"
              value={formData.businessName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Category
              </option>

              <option value="Music">
                Music
              </option>

              <option value="Tech">
                Tech
              </option>

              <option value="Business">
                Business
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Food">
                Food
              </option>

              <option value="Art">
                Art
              </option>
            </select>

            <textarea
              rows="5"
              name="reason"
              placeholder="Tell us about your organisation..."
              value={formData.reason}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">
              Submit Application
            </button>

          </form>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default BecomeOrganiser;