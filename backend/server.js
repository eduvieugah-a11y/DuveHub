
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";
import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import organiserRoutes from "./routes/organiserRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
// import notificationRoutes from "./routes/notificationRoutes.js";

// // Load environment variables
// dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());

app.use(
  express.json({
    verify: (req, res, buf) =>{
      req.rawBody = buf;
    },
  })
);

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/organiser", organiserRoutes);
app.use("/api/payment",  paymentRoutes);
// app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("DuvieHub API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});