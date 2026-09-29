import "./Testimonials.css";
import { Star } from "lucide-react";

function Testimonials() {
  return (
    <section className="testimonials">

      <h2>What Our Users Say</h2>
      <p>Hearbfrom people who have use DuvieHub to display and book amazing events</p>

      <div className="testimonial-grid">

        <div className="testimonial-card">

          <div className="profile">S</div>

          <div className="stars">
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <Star size={18} fill="#FFD700" color="#FFD700" />
          </div>

          <p>
            DuvieHub made booking events so easy.
            Everything was smooth and fast.
          </p>

          <h4>Sarah Johnson</h4>

        </div>

        <div className="testimonial-card">

          <div className="profile">D</div>

          <div className="stars">
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <Star size={18} fill="#FFD700" color="#FFD700" />
          </div>

          <p>
            The best event platform I've ever used.
            Highly recommended.
          </p>

          <h4>David Wilson</h4>

        </div>

        <div className="testimonial-card">

          <div className="profile">C</div>

          <div className="stars">
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <Star size={18} fill="#FFD700" color="#FFD700" />
          </div>

          <p>
            I found amazing concerts and exhibitions through DuvieHub.
          </p>

          <h4>Cynthia Adams</h4>

        </div>

      </div>

    </section>
  );
}

export default Testimonials;