import "./EventCard.css";
import { MapPin, CalendarDays, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import { API_URL } from "../../api/config";

function EventCard({
  id,
  image,
  title,
  location,
  date,
  rating,
  price,
}) {
  return (
    <div className="event-card">
      <img src={image
        ? `${API_URL}${image}`
        : "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800"
      }alt={title} className="event-image"/>

      <div className="event-content">
        <h3>{title}</h3>

        <p>
          <MapPin size={16} />
          {location}
        </p>

        <p>
          <CalendarDays size={16} />
          {date}
        </p>

        <div className="event-footer">
          <span>
            <Star size={16} fill="#FFD700" color="#FFD700" />
            {rating}
          </span>

          <h4>{price}</h4>
        </div>

        <Link to={`/event/${id}`}>
          <Button text="View Details"/>
        </Link>
      </div>
    </div>
  );
}

export default EventCard;