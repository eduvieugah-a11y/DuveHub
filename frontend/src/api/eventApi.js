import axios from "axios";
import { API_URL as BASE_URL } from "./config";

const API_URL = `${BASE_URL}/api/events`;
export const getEvents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};