import axios from "axios";

// ----------------- TYPES -----------------
export interface SignResponse {
  signature?: string;
  error?: string;
  status?: string;
}

export interface VerifyResponse {
  valid?: boolean;
  message?: string;
  error?: string;
  status?: string;
}

// ----------------- BASE URL -----------------
// Detect Codespace preview automatically
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname.endsWith(".app.github.dev")
    ? `https://${window.location.hostname.split("-")[0]}-3000.app.github.dev`
    : "http://localhost:3000");

console.log("API BASE_URL:", BASE_URL);

// ----------------- API OBJECT -----------------
export const api = {
  // ----------------- PRICES -----------------
  getPrices: async (vs: string = "usd") => {
    try {
      const res = await axios.get(`${BASE_URL}/prices`, { params: { vs } });
      return res.data;
    } catch (err: any) {
      console.error("Error fetching prices:", err.message);
      return { error: err.message };
    }
  },

  // ----------------- WEATHER -----------------
  getWeather: async (city: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/weather`, { params: { city } });
      return res.data;
    } catch (err: any) {
      console.error("Error fetching weather:", err.message);
      return { error: err.message };
    }
  },

  // ----------------- RANDOMNESS -----------------
  getRandom: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/random`);
      return res.data;
    } catch (err: any) {
      console.error("Error fetching randomness:", err.message);
      return { error: err.message };
    }
  },

  // ----------------- SIGN -----------------
  signMessage: async (message: string, secret: string): Promise<SignResponse> => {
    if (!message || !secret) return { error: "Message and secret required", status: "ok" };
    try {
      const res = await axios.post(`${BASE_URL}/sign`, { message, secret });
      return res.data as SignResponse;
    } catch (err: any) {
      console.error("Error signing message:", err.message);
      return { error: err.message, status: "ok" };
    }
  },

  // ----------------- VERIFY -----------------
  verifySignature: async (message: string, signature: string, secret: string): Promise<VerifyResponse> => {
    if (!message || !signature || !secret) return { error: "All fields required", status: "ok" };
    try {
      const res = await axios.post(`${BASE_URL}/verify`, { message, signature, secret });
      return res.data as VerifyResponse;
    } catch (err: any) {
      console.error("Error verifying signature:", err.message);
      return { error: err.message, status: "ok" };
    }
  },
};
