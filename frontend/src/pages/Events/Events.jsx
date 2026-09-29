import "./Events.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import EventCard from "../../components/EventCard/EventCard";
import { API_URL } from "../../api/config";

function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  const [searchParams] = useSearchParams();

  const categoryFromUrl =
    searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] =
    useState(categoryFromUrl);

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/events`
        );

        setEvents(res.data);
      } catch (error) {
        console.error("Failed to load events:", error);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const categoryMatch =
      selectedCategory === "All" ||
      event.category?.toLowerCase() ===
        selectedCategory.toLowerCase();

    const searchMatch =
      event.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      event.location
        .toLowerCase()
        .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <>
      <Navbar />

      <section className="events-page">
        <div className="events-hero">
          <h1>Discover Amazing Events</h1>

          <p>
            Find concerts, conferences, exhibitions,
            workshops and unforgettable experiences
            across Nigeria.
          </p>

          <input
            type="text"
            placeholder="Search for an event..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="category-filter">
          <button onClick={() => setSelectedCategory("All")}>
            All
          </button>

          <button onClick={() => setSelectedCategory("Music")}>
            Music
          </button>

          <button
            onClick={() =>
              setSelectedCategory("Technology")
            }
          >
            Technology
          </button>

          <button
            onClick={() =>
              setSelectedCategory("Business")
            }
          >
            Business
          </button>

          <button onClick={() => setSelectedCategory("Food")}>
            Food
          </button>

          <button
            onClick={() =>
              setSelectedCategory("Sports")
            }
          >
            Sports
          </button>

          <button onClick={() => setSelectedCategory("Art")}>
            Art
          </button>
        </div>

        <div className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                id={event._id}
                image={event.image}
                title={event.title}
                location={event.location}
                date={new Date(
                  event.date
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                price={`₦${Number(
                  event.price
                ).toLocaleString()}`}
                rating="4.8"
              />
            ))
          ) : (
            <h2
              style={{
                textAlign: "center",
                width: "100%",
                marginTop: "40px",
              }}
            >
              No events found.
            </h2>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Events;