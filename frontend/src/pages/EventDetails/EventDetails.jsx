import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../api/config";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import "./EventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/events/${id}`
        );

        setEvent(res.data);
      } catch (error) {
        console.error("Failed to load event:", error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return (
      <>
        <Navbar />
        <h2
          style={{
            textAlign: "center",
            marginTop: "120px",
          }}
        >
          Loading event...
        </h2>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="event-details">

        <div className="event-image">
          <img
            src={
              event.image
                ? `${API_URL}${event.image}`
                : "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200"
            }
            alt={event.title}
          />
        </div>

        <div className="event-info">

          <h1>{event.title}</h1>

          <p className="location">
            📍 {event.location}
          </p>

          <p className="date">
            📅{" "}
            {new Date(event.date).toLocaleDateString(
              "en-GB",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </p>

          <p className="category">
           🏷️<strong>Category:</strong> {event.category}
          </p>

          <p className="organiser">
            👤<strong>Organiser:</strong> {event.organiser?.name}
          </p>

          <p className="tickets">
            🎫 <strong>Tickets Available:</strong> {event.tickets}
          </p>

          <p className="published">
            🕒 <strong>Published:</strong>{" "}
            {new Date(event.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            })}
          </p>

          <p className="price">
            ₦{Number(event.price).toLocaleString()}
          </p>

          <p className="description">
            {event.description}
          </p>

          <button
            className="book-btn"
            onClick={() =>
              navigate("/booking", {
                state: {
                  _id: event._id,
                  title: event.title,
                  image:event.image,
                  category:event.category,
                  organiser:event.organiser,
                  location:event.location,
                  date:event.date,
                  tickets:event.tickets,
                  price:event.price
                },
              })
            }
          >
            Book Ticket
          </button>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default EventDetails;