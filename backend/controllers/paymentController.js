import crypto from "crypto";

import {
  initializePayment,
  verifyPayment,
} from "../services/paystackService.js";

import User from "../models/User.js";
import Event from "../models/Event.js";
import { createBookingRecord } from "./bookingController.js";


/**
 * Initialize a Paystack payment
 *
 * paymentType can be:
 * - "booking"
 * - "premium"
 */
export const initializePaystackPayment = async (req, res) => {
  try {
    const {
      email,
      amount,
      userId,
      paymentType,
      eventId,
      tickets,
      name,
      phone,
    } = req.body;


    // ============================
    // BASIC VALIDATION
    // ============================

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!paymentType) {
      return res.status(400).json({
        message: "Payment type is required",
      });
    }

    if (!["booking", "premium"].includes(paymentType)) {
      return res.status(400).json({
        message: "Invalid payment type",
      });
    }


    // ============================
    // PREMIUM PAYMENT
    // ============================

    if (paymentType === "premium") {
      if (!userId) {
        return res.status(400).json({
          message:
            "User ID is required for Premium payment",
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }


      // Premium price is controlled by backend
      const premiumAmount = 10000;


      const metadata = {
        userId: user._id.toString(),
        paymentType: "premium",
        plan: "premium",
      };


      const payment = await initializePayment(
        user.email,
        premiumAmount,
        metadata,
        ["card", "bank_transfer"]
      );


      return res.status(200).json({
        message: "Premium payment initialized",
        authorization_url:
          payment.authorization_url,
        access_code: payment.access_code,
        reference: payment.reference,
      });
    }


    // ============================
    // EVENT BOOKING PAYMENT
    // ============================

    if (paymentType === "booking") {

      if (!userId) {
        return res.status(400).json({
          message:
            "User ID is required for booking",
        });
      }


      if (!eventId) {
        return res.status(400).json({
          message:
            "Event ID is required for booking",
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }


      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({
          message: "Event not found",
        });
      }

      const ticketCount = Number(tickets);

      if (!Number.isInteger(ticketCount) || ticketCount < 1) {
        return res.status(400).json({
          message: "A valid number of tickets is required",
        });
      }
      
      if (event.tickets < ticketCount) {
        return res.status(400).json({
          message: `Only ${event.tickets} ticket(s) are available.`,
        });
      }

      // Calculate the price on the server.
      // Never trust the amount sent by the frontend.
      const bookingAmount = Number(event.price) * ticketCount;

      if (!Number.isFinite(bookingAmount) || bookingAmount <= 0) {
        return res.status(400).json({
          message: "Invalid event price.",
        });
      }


      /*
       * Store the information needed by the webhook.
       */
      const metadata = {
        userId: user._id.toString(),

        paymentType: "booking",

        eventId: event._id.toString(),

        tickets: Number(tickets),

        name: name || user.name,

        email: email || user.email,

        phone: phone || "",

        eventTitle: event.title,
      };


      const payment = await initializePayment(
        user.email,
        bookingAmount,
        metadata,
        ["card", "bank_transfer"]
      );


      return res.status(200).json({
        message:
          "Booking payment initialized",

        authorization_url:
          payment.authorization_url,

        access_code:
          payment.access_code,

        reference:
          payment.reference,
      });
    }

  } catch (error) {

    console.error(
      "❌ Paystack initialization error:",
      error.response?.data ||
        error.message
    );


    return res.status(500).json({
      message:
        "Unable to initialize payment",

      error:
        error.response?.data?.message ||
        error.message,
    });
  }
};


/**
 * Verify a Paystack payment
 */
export const verifyPaystackPayment = async (
  req,
  res
) => {
  try {

    const { reference } = req.params;


    if (!reference) {
      return res.status(400).json({
        message:
          "Payment reference is required",
      });
    }


    const payment =
      await verifyPayment(reference);


    if (
      !payment ||
      payment.status !== "success"
    ) {
      return res.status(400).json({
        message:
          "Payment was not successful",

        status:
          payment?.status ||
          "unknown",
      });
    }


    const paidAmount =
      Number(payment.amount) / 100;


    const metadata =
      payment.metadata || {};


    // ============================
    // PREMIUM PAYMENT
    // ============================

    if (
      metadata.paymentType === "premium"
    ) {

      if (!metadata.userId) {
        return res.status(400).json({
          message:
            "User ID was not found in Premium payment metadata",
        });
      }


      if (paidAmount !== 10000) {
        return res.status(400).json({
          message:
            "Invalid Premium payment amount",
        });
      }


      const user =
        await User.findById(
          metadata.userId
        );


      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }


      const premiumExpires =
        new Date();


      premiumExpires.setDate(
        premiumExpires.getDate() + 30
      );


      user.plan = "premium";

      user.premiumExpires =
        premiumExpires;


      await user.save();


      return res.status(200).json({
        message:
          "Premium payment verified successfully",

        paymentType:
          "premium",

        plan:
          user.plan,

        premiumExpires:
          user.premiumExpires,

        reference:
          payment.reference,

        status:
          payment.status,
      });
    }


    // ============================
    // BOOKING PAYMENT
    // ============================

    if (metadata.paymentType === "booking") {

      if (!metadata.eventId || !metadata.tickets) {
        return res.status(400).json({
          message: "Invalid booking payment metadata",
        });
      }

      const event = await Event.findById(metadata.eventId);

      if (!event) {
        return res.status(404).json({
          message: "Event not found.",
        });
      }

      const expectedAmount =
        Number(event.price) * Number(metadata.tickets);

      if (paidAmount !== expectedAmount) {
        return res.status(400).json({
          message: "Payment amount does not match the booking.",
          expectedAmount,
          paidAmount,
        });
      }
    
      return res.status(200).json({
        message: "Booking payment verified successfully",
    
        paymentType: "booking",
    
        reference: payment.reference,
    
        status: payment.status,

        amount: paidAmount,

        eventId: metadata.eventId,

        userId: metadata.userId || null,

        tickets: metadata.tickets,
      });
    }


    return res.status(400).json({
      message:
        "Unknown payment type",
    });

  } catch (error) {

    console.error(
      "❌ Paystack verification error:",
      error.response?.data ||
        error.message
    );


    return res.status(500).json({
      message:
        "Unable to verify payment",

      error:
        error.response?.data?.message ||
        error.message,
    });
  }
};


/**
 * Paystack webhook
 *
 * Paystack sends successful payment
 * notifications here.
 */
export const handlePaystackWebhook = async (
  req,
  res
) => {
  try {

    const secret =
      process.env.PAYSTACK_SECRET_KEY;


    if (!secret) {
      console.error(
        "❌ PAYSTACK_SECRET_KEY is missing"
      );

      return res.sendStatus(500);
    }


    // ============================
    // VERIFY PAYSTACK SIGNATURE
    // ============================

    const signature =
      req.headers[
        "x-paystack-signature"
      ];


    const hash = crypto
      .createHmac(
        "sha512",
        secret
      )
      .update(req.rawBody)
      .digest("hex");


    if (hash !== signature) {
      console.error(
        "❌ Invalid Paystack webhook signature"
      );

      return res.sendStatus(401);
    }


    const event = req.body;


    // We only process successful charges
    if (
      event.event !==
      "charge.success"
    ) {
      return res.sendStatus(200);
    }


    const payment =
      event.data;


    if (
      !payment ||
      payment.status !== "success"
    ) {
      return res.sendStatus(200);
    }


    const metadata =
      payment.metadata || {};


    console.log(
      `✅ Paystack payment received: ${payment.reference}`
    );


    // ============================
    // PREMIUM PAYMENT
    // ============================

    if (
      metadata.paymentType === "premium"
    ) {

      if (!metadata.userId) {
        console.error(
          "❌ Premium payment has no userId"
        );

        return res.sendStatus(200);
      }


      const paidAmount =
        Number(payment.amount) / 100;


      if (paidAmount !== 10000) {
        console.error(
          `❌ Invalid Premium amount: ₦${paidAmount}`
        );

        return res.sendStatus(200);
      }


      const user =
        await User.findById(
          metadata.userId
        );


      if (!user) {
        console.error(
          `❌ User not found: ${metadata.userId}`
        );

        return res.sendStatus(200);
      }


      if (
        user.plan === "premium" &&
        user.premiumExpires &&
        new Date(
          user.premiumExpires
        ) > new Date()
      ) {

        console.log(
          "ℹ️ Premium already active. Skipping duplicate webhook."
        );

        return res.sendStatus(200);
      }


      const premiumExpires =
        new Date();


      premiumExpires.setDate(
        premiumExpires.getDate() + 30
      );


      user.plan = "premium";

      user.premiumExpires =
        premiumExpires;


      await user.save();


      console.log(
        `✅ Premium activated for ${user.email}`
      );


      return res.sendStatus(200);
    }


    // ============================
    // BOOKING PAYMENT
    // ============================

    if (
      metadata.paymentType === "booking"
    ) {

      if (
        !metadata.userId ||
        !metadata.eventId ||
        !metadata.tickets
      ) {

        console.error(
          "❌ Booking payment is missing required metadata"
        );

        return res.sendStatus(200);
      }


      const paidAmount =
        Number(payment.amount) / 100;


      if (paidAmount <= 0) {
        console.error(
          "❌ Invalid booking payment amount"
        );

        return res.sendStatus(200);
      }


      try {

        const booking =
          await createBookingRecord({

            userId:
              metadata.userId,

            eventId:
              metadata.eventId,

            name:
              metadata.name ||
              "DuvieHub Customer",

            email:
              metadata.email ||
              payment.customer?.email ||
              "",

            phone:
              metadata.phone ||
              "",

            eventTitle:
              metadata.eventTitle ||
              "DuvieHub Event",

            tickets:
              Number(metadata.tickets),

            total:
              paidAmount,

            paymentReference:
              payment.reference,
          });


        console.log(
          `✅ Booking created from Paystack payment: ${booking._id}`
        );

      } catch (bookingError) {

        console.error(
          "❌ Failed to create booking from webhook:",
          bookingError.message
        );

        return res.sendStatus(200);
      }


      return res.sendStatus(200);
    }


    console.log(
      "ℹ️ Paystack payment received with unknown payment type."
    );


    return res.sendStatus(200);

  } catch (error) {

    console.error(
      "❌ Paystack webhook error:",
      error.message
    );


    return res.sendStatus(200);
  }
};