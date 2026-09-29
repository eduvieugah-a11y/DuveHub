import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";


// ==========================================
// CREATE BOOKING RECORD
// Used by normal booking flow + Paystack webhook
// ==========================================
export const createBookingRecord = async ({
  userId,
  eventId,
  name,
  email,
  phone = "",
  eventTitle,
  tickets,
  total,
  bookingReference,
  paymentReference,
}) => {

  // ------------------------------------------
  // Prevent duplicate booking
  // ------------------------------------------
  if (paymentReference) {
    const existingBooking = await Booking.findOne({
      paymentReference,
    });

    if (existingBooking) {

      return existingBooking;
    }
  }


  // ------------------------------------------
  // Find the event
  // ------------------------------------------

  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found.");
  }


  // ------------------------------------------
  // Convert tickets to a number
  // ------------------------------------------
  const ticketCount = Number(tickets);

  if (!ticketCount || ticketCount < 1) {
    throw new Error("Invalid number of tickets.");
  }


  // ------------------------------------------
  // Check available tickets
  // ------------------------------------------
  if (event.tickets < ticketCount) {
    throw new Error(
      `Only ${event.tickets} ticket(s) left.`
    );
  }

  // ------------------------------------------
  // Reduce available tickets atomically
  // ------------------------------------------
  const updatedEvent = await Event.findOneAndUpdate(
    {
      _id: eventId,
      tickets: { $gte: ticketCount },
    },
    {
      $inc: { tickets: -ticketCount },
    },
    {
      new: true,
    }
  );
  
  if (!updatedEvent) {
    throw new Error("Not enough tickets available.");
  }

  // ------------------------------------------
  // Generate booking reference if necessary
  // ------------------------------------------
  const finalBookingReference =
    bookingReference ||
    "DVH-" +
      Math.floor(
        100000 + Math.random() * 900000
      );


  // ------------------------------------------
  // Create booking
  // ------------------------------------------
  const booking = await Booking.create({
    userId,
    eventId,
    name,
    email,
    phone,
    eventTitle,
    tickets: ticketCount,
    total,
    bookingReference: finalBookingReference,
    paymentReference,
  });


  // ------------------------------------------
  // Send confirmation email
  // ------------------------------------------
  try {
    await sendEmail(
      booking.email,
      "🎉 DuvieHub Booking Confirmation",
      `
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <h2 style="color:#2563eb;">
          Booking Confirmed!
        </h2>

        <p>
          Hello <strong>${booking.name}</strong>,
        </p>

        <p>
          Your booking has been confirmed successfully.
        </p>

        <hr>

        <p>
          <strong>Event:</strong>
          ${booking.eventTitle}
        </p>

        <p>
          <strong>Tickets:</strong>
          ${booking.tickets}
        </p>

        <p>
          <strong>Total Paid:</strong>
          ₦${Number(booking.total).toLocaleString()}
        </p>

        <p>
          <strong>Reference:</strong>
          ${booking.bookingReference}
        </p>

        <hr>

        <p>
          Thank you for choosing
          <strong>DuvieHub</strong>.
        </p>

        <p>
          We look forward to seeing you at the event! 🎉
        </p>
      </div>
      `
    );
  } catch (emailError) {
    console.error(
      "⚠️ Booking created but email failed:",
      emailError.message
    );
  }

  return booking;
};


// ==========================================
// CREATE BOOKING
// ==========================================
export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      eventId,
      name,
      email,
      phone,
      eventTitle,
      tickets,
      total,
      bookingReference,
      paymentReference,
    } = req.body;


    const booking =
      await createBookingRecord({
        userId,
        eventId,
        name,
        email,
        phone,
        eventTitle,
        tickets,
        total,
        bookingReference,
        paymentReference,
      });


    res.status(201).json({
      message: "Booking Successful!",
      booking,
    });

  } catch (error) {

    console.error(
      "Booking error:",
      error
    );

    res.status(500).json({
      message: "Booking failed.",
      error: error.message,
    });
  }
};


// ==========================================
// GET USER BOOKINGS
// ==========================================
export const getUserBookings = async (req, res) => {
  try {

    const { userId } = req.params;

    const bookings = await Booking.find({
      userId,
    })
      .populate("eventId")
      .sort({
        createdAt: -1,
      });


    res.status(200).json(bookings);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Unable to fetch bookings.",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL BOOKINGS
// ADMIN ONLY
// ==========================================
export const getAllBookings = async (req, res) => {
  try {

    const bookings = await Booking.find()
      .populate("eventId")
      .sort({
        createdAt: -1,
      });


    res.status(200).json(bookings);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Unable to fetch bookings.",
      error: error.message,
    });
  }
};


// ==========================================
// GET ORGANISER BOOKINGS
// ==========================================
export const getOrganiserBookings = async (req, res) => {
  try {

    const { organiserId } = req.params;


    const events = await Event.find({
      organiser: organiserId,
    });


    const eventIds = events.map(
      (event) => event._id
    );


    const bookings = await Booking.find({
      eventId: {
        $in: eventIds,
      },
    })
      .populate("eventId")
      .sort({
        createdAt: -1,
      });


    res.status(200).json(bookings);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Unable to fetch organiser bookings.",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE BOOKING
// ==========================================
export const deleteBooking = async (req, res) => {
  try {

    const booking =
      await Booking.findByIdAndDelete(
        req.params.id
      );


    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }


    res.status(200).json({
      message:
        "Booking deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};