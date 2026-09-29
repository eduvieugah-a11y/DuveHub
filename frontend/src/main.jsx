import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";

import "./assets/styles/global.css";
import App from "./App.jsx";

// Restore authentication token when the app starts
const token = localStorage.getItem("token");

if (token) {
  axios.defaults.headers.common.Authorization =
    `Bearer ${token}`;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);