import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_API_URL;

const fetchFromTMDB = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error:', error.message);
    console.log(error.response.data);
    throw error;
  }
};

export default fetchFromTMDB;