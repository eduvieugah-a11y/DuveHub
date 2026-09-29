import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import "./About.css";

function About() {
  return (
    <>
    <Navbar/>
    <section className="about">

      <div className="about-container">

        <div className="about-text">
          <h1>About DuvieHub</h1>

          <p>
            DuvieHub is a modern event management platform designed to help
            people discover, organize, and book amazing events with ease.
          </p>

          <p>
            Whether it's music festivals, business conferences, sports events,
            exhibitions, or workshops, DuvieHub brings every event together in
            one place.
          </p>

          <p>
            Our goal is to make event planning simple, fast, and enjoyable for
            both organizers and attendees.
          </p>
        </div>

        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800"
            alt="People enjoying an event"
          />
        </div>

      </div>

    </section>
    <Footer/>
    </>
  );
}

export default About;