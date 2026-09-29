import "./Categories.css";
import {
  FaMusic,
  FaBriefcase,
  FaUtensils,
  FaGamepad,
  FaLaptopCode,
  FaFootballBall,
  FaTheaterMasks,
  FaGlassCheers,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function Categories() {
  const navigate = useNavigate();

  const categories = [
    { icon: <FaMusic />, title: "Music" },
    { icon: <FaBriefcase />, title: "Business" },
    { icon: <FaUtensils />, title: "Food" },
    { icon: <FaGamepad />, title: "Gaming" },
    { icon: <FaLaptopCode />, title: "Technology" },
    { icon: <FaFootballBall />, title: "Sports" },
    { icon: <FaTheaterMasks />, title: "Art" },
    { icon: <FaGlassCheers />, title: "Festival" },
  ];

  return (
    <section className="categories">
      <div className="categories-header">
        <h2>Browse Categories</h2>
        <p>Find events that match your interests.</p>
      </div>

      <div className="categories-grid">
        {categories.map((item, index) => (
          <div
            className="category-card"
            key={index}
            onClick={() =>
              navigate(`/events?category=${item.title}`)
            }
          >
            <div className="category-icon">{item.icon}</div>
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;