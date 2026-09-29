import User from "../models/User.js";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalEvents = await Event.countDocuments();

    const totalBookings = await Booking.countDocuments();

    // Calculate total revenue
    const revenue = await Booking.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    res.json({
      totalUsers,
      totalEvents,
      totalBookings,
      totalRevenue: revenue.length ? revenue[0].total : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};