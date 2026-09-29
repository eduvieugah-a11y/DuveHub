import "dotenv/config";
import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  console.error("❌ PAYSTACK_SECRET_KEY is missing from .env");
}

const paystackHeaders = {
  Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
  "Content-Type": "application/json",
};

export const initializePayment = async (
  email,
  amount,
  metadata = {},
  channels = ["card", "bank_transfer"]
) => {
  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email,
      amount: Math.round(Number(amount) * 100),
      currency: "NGN",

      // Paystack expects metadata as a JSON string
      metadata: JSON.stringify(metadata),

      // Card + Bank Transfer
      channels,

      callback_url: "http://localhost:5173/payment-success",
    },
    {
      headers: paystackHeaders,
    }
  );

  return response.data.data;
};

export const verifyPayment = async (reference) => {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: paystackHeaders,
    }
  );

  return response.data.data;
};