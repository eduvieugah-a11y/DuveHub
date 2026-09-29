import "./Booking.css";
import { useState } from "react";
import axios from "axios";
import Paystack from "@paystack/inline-js";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { API_URL } from "../../api/config";

function Booking() {
  const [tickets, setTickets] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const event = location.state;
  const eventTitle = event?.title || "Unknown Event";
  const eventImage = event?.image
    ? `${API_URL}${event.image}`
    : "";

  const eventCategory = event?.category || "";

  const organiser =
    typeof event?.organiser === "object"
      ? event.organiser.name
      : event?.organiser || "Unknown";

  const eventLocation = event?.location || "";
  const eventDate = event?.date || "";
  const ticketsLeft = Number(event?.tickets) || 0;
  const eventPrice = Number(event?.price) || 0;

  const total = eventPrice * tickets;

  const bookingReference =
    "DVH-" + Math.floor(100000 + Math.random() * 900000);

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      // Make sure the event exists
      if (!event?._id) {
        alert("Event information is missing.");
        return;
      }

      // Make sure the selected ticket quantity is valid
      if (tickets < 1) {
        alert("Please select at least 1 ticket.");
        return;
      }

      if (tickets > ticketsLeft) {
        alert(`Only ${ticketsLeft} ticket(s) are available.`);
        return;
      }

      // Get logged-in user
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?._id) {
        alert("Please login before booking an event.");
        navigate("/login");
        return;
      }

      /*
       * STEP 1
       * Initialize the Paystack transaction
       * through our backend.
       */
      const response = await axios.post(
        `${API_URL}/api/payment/initialize`,
        {
          email,
          amount: total,
          userId: user._id,
          paymentType: "booking",
          eventId: event._id,
          tickets,

          // Send these so the webhook can create
          // the booking if necessary.
          name,
          phone,
        }
      );

      /*
       * Paystack already initialized the transaction
       * on the backend.
       *
       * We MUST NOT use:
       *
       * reference: response.data.reference
       *
       * with newTransaction(), because that would
       * attempt to initialize the same transaction again.
       *
       * Instead, resume the transaction using the
       * access_code returned by Paystack.
       */
      const accessCode = response.data.access_code;

      if (!accessCode) {
        console.error("Paystack response:", response.data);

        alert("Unable to open Paystack checkout.");
        return;
      }

      const popup = new Paystack();
      

      popup.resumeTransaction(accessCode, {
        onSuccess: async function (transaction) {
          try {

            /*
             * STEP 2
             * Verify the payment on our backend.
             */
            const verify = await axios.get(
              `${API_URL}/api/payment/verify/${transaction.reference}`
            );

            if (
              verify.data.status === "success" &&
              verify.data.paymentType === "booking"
            ) {

              /*
               * STEP 3
               * Create the booking in MongoDB.
               *
               * The backend also protects against duplicate
               * bookings using the Paystack reference.
               */
              await axios.post(
                `${API_URL}/api/bookings`,
                {
                  userId: user._id,
                  eventId: event._id,
                  name,
                  email,
                  phone,
                  eventTitle,
                  tickets,
                  total,
                  bookingReference,
                  paymentReference: transaction.reference,
                }
              );

              alert("Booking Successful!");

              navigate("/dashboard");
            } else {
              alert("Payment verification failed.");
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            alert(
              error.response?.data?.error ||
                error.response?.data?.message ||
                "Unable to verify payment."
            );
          }
        },

        onCancel: function () {
          alert("Payment Cancelled.");
        },

        onError: function (error) {
          console.error("Paystack error:", error);

          alert(
            error?.message ||
              "There was a problem opening Paystack."
          );
        },
      });
    } catch (error) {
      console.error(
        "Payment initialization error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to initialize payment."
      );
    }
  };

  return (
    <>
      <Navbar />

      <section className="booking">
        <div className="booking-container">

          <h1>Book Your Ticket</h1>

          <div className="booking-event-card">

            {eventImage && (
              <img
                src={eventImage}
                alt={eventTitle}
                className="booking-event-image"
              />
            )}

            <div className="booking-event-info">

              <span className="category">
                {eventCategory}
              </span>

              <h2>{eventTitle}</h2>

              <p>📍 {eventLocation}</p>

              <p>
                📅{" "}
                {eventDate
                  ? new Date(eventDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : ""}
              </p>

              <p>👤 Organiser: {organiser}</p>

              <p>🎟 Tickets Left: {ticketsLeft}</p>

            </div>
          </div>

          <p className="booking-subtitle">
            Fill in your details to continue securely with Paystack.
          </p>

          <form onSubmit={handleBooking}>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <input
              type="number"
              min="1"
              max={ticketsLeft}
              value={tickets}
              onChange={(e) =>
                setTickets(Number(e.target.value))
              }
              required
            />

            <div className="price-box">
              <span>Price Per Ticket</span>

              <h3>
                ₦{eventPrice.toLocaleString()}
              </h3>
            </div>

            <div className="price-box total-box">
              <span>Total Amount</span>

              <h2>
                ₦{total.toLocaleString()}
              </h2>
            </div>

            <div className="price-box">
              <span>Booking Reference</span>

              <strong>{bookingReference}</strong>
            </div>

            <div className="payment-note">
              🔒 Secure payment powered by Paystack.
              <br />
              💳 Pay with Card or Bank Transfer.
            </div>

            <button type="submit">
              Pay ₦{total.toLocaleString()} with Paystack
            </button>

          </form>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default Booking;