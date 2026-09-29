import "./Footer.css";
import { Mail, Phone, MapPin } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-about">
          <h2>DuvieHub</h2>

          <p>
            Discover, book and manage amazing events across Nigeria.
            Your one-stop platform for concerts, conferences,
            exhibitions and unforgettable experiences.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>

          <p><MapPin size={16}/> Lagos, Nigeria</p>
          <p><Phone size={16}/> +234 9026374433</p>
          <p><Mail size={16}/> eduvie@gmail.com</p>
        </div>

        <div className="footer-social">

          <h3>Follow Us</h3>

          <div className="social-icons">

            <a href="#"><FaFacebookF/></a>

            <a href="#"><FaInstagram/></a>

            <a href="#"><FaTwitter/></a>

            <a href="#"><FaLinkedinIn/></a>

          </div>

        </div>

      </div>

      <hr />

      <p className="copyright">
        @ 2026 DuvieHub. All Rights Reserved.
      </p>

    </footer>
  );
}

export default Footer;