import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchFromTMDB = async (endpoint, params = {}) => {
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
    throw error;
  }
};