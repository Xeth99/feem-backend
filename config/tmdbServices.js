import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_API_URL;

// const fetchFromTMDB = async (endpoint, params = {}) => {
//   try {
//     const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
//       params: {
//         api_key: TMDB_API_KEY,
//         ...params,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('TMDB API Error:', error.message);
//     console.log(error.response.data);
//     throw error;
//   }
// };

const fetchFromTMDB = async (endpoint, params = {}) => {
  try {
    // ✅ Ensure TMDB_API_KEY is loaded
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY is missing in environment variables");
    }

    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY, // Critical!
        ...params, // Spread user-provided params (language, page, etc.)
      },
      timeout: 10000, // 5s timeout
    });

    return response.data;
  } catch (error) {
    // ✅ Log full error details
    console.error("TMDB API Request Failed:", {
      endpoint,
      params,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data, // TMDB's error response (e.g., rate limits)
    });
    throw error; // Re-throw for the route to handle
  }
};

export default fetchFromTMDB;
