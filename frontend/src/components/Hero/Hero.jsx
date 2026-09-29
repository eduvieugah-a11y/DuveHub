import "./Hero.css";
import heroImage from "../../assets/images/event.jpeg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate()
  return (
    <section className="hero">
      <div className="hero-content">

        <motion.span
          className="hero-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          ✨ Trusted by 15,000+ Event Lovers
        </motion.span>

        <h1>
          Discover and <br />
          Manage <br />
          <span>Amazing Events</span>
        </h1>

        <p>
          DuvieHub helps you discover amazing events,
          book tickets and create unforgettable experiences.
        </p>

        <div className="hero-buttons">
          <button className="explore-btn" onClick={() => navigate("/events")}>
            Explore Events
          </button>

          <button className="create-btn" onClick={() => navigate("/admin/create-event")}>
            Create Event
          </button>
        </div>

      </div>
    </section>
  );
}

export default Hero;