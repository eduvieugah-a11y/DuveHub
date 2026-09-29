import "./Contact.css";

function Contact() {
  return (
    <section className="contact">
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p className="contact-text">
          Have a question, suggestion, or need help? We'd love to hear from you.
        </p>
        <form className="contact-form">
          <input
            type="text"
            placeholder="Your Name"
          />
          <input
            type="email"
            placeholder="Your Email"
          />
          <input
            type="text"
            placeholder="Subject"
          />
          <textarea
            rows="6"
            placeholder="Write your message..."
          ></textarea>
          <button type="submit">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;