import "./FeaturedEvents.css";
import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../EventCard/EventCard";
import { API_URL } from "../../api/config";

function FeaturedEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/events`
        );

        // Show only the first 3 events
        setEvents(res.data.slice(0, 3));
        const latestEvents = [...res.data]
        .sort(
          (a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 3);
        setEvents(latestEvents)
      } catch (error) {
        console.error("Failed to load featured events:", error);
      }
    };

    fetchFeaturedEvents();
  }, []);

  return (
    <section className="featured-events">

      <h2>Featured Events</h2>

      <p>
        Discover the hottest events happening in Nigeria
      </p>

      <div className="events-grid">

        {events.map((event) => (
          <EventCard
            key={event._id}
            id={event._id}
            image={event.image}
            title={event.title}
            location={event.location}
            date={new Date(event.date).toLocaleDateString(
              "en-GB",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            )}
            price={`₦${Number(event.price).toLocaleString()}`}
            rating="4.8"
          />
        ))}

      </div>

    </section>
  );
}

export default FeaturedEvents;