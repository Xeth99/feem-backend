import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const fetchFromTMDB = async (endpoint, params = {}) => {
  try {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY is missing in environment variables");
    }

    const response = await axios.get(`${process.env.TMDB_API_URL}${endpoint}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        ...params,
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error("TMDB API Request Failed:", {
      endpoint,
      params,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export default fetchFromTMDB;
