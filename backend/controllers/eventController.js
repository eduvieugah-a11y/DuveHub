import Event from "../models/Event.js";
import Booking from "../models/Booking.js";

// ===============================
// CREATE EVENT
// ===============================
export const createEvent = async (req, res) => {
  try {
    const {
      organiser,
      title,
      category,
      description,
      date,
      location,
      price,
      tickets,
    } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const event = await Event.create({
      organiser,
      title,
      category,
      description,
      date,
      location,
      price,
      tickets,
      image,
    });

    res.status(201).json({
      message: "Event created successfully.",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ===============================
// GET ALL EVENTS
// Used on the public Events page
// ===============================
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organiser", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    console.error("Get events error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ===============================
// GET EVENTS CREATED BY ONE ORGANISER
// Used on "My Events"
// ===============================
export const getOrganiserEvents = async (req, res) => {
  try {
    const { organiserId } = req.params;

    if (!organiserId) {
      return res.status(400).json({
        message: "Organiser ID is required.",
      });
    }

    const events = await Event.find({
      organiser: organiserId,
    })
      .populate("organiser", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    console.error("Get organiser events error:", error);

    res.status(500).json({
      message: "Unable to fetch organiser events.",
      error: error.message,
    });
  }
};


// ===============================
// GET ONE EVENT
// ===============================
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organiser", "name email");

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Get event error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ===============================
// DELETE EVENT
// ===============================
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    res.status(200).json({
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ===============================
// UPDATE EVENT
// ===============================
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    res.status(200).json({
      message: "Event updated successfully.",
      event,
    });
  } catch (error) {
    console.error("Update event error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};