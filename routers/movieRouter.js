import express from "express";
import * as moviesController from "../controllers/movieController.js";
import { protect, admin } from "../middlewares/auth.js";
import fetchFromTMDB from "../config/tmdbServices.js";

const router = express.Router();

// ************ PUBLIC ROUTES FOR TMBD ************
// get all movies
router.get("/tmdb", async (req, res) => {
  const { language, page, region, with_genres } = req.query;
  try {
    const data = await fetchFromTMDB("/movie/now_playing", {
      language,
      region,
      page,
      with_genres,
    });
    res.json(data.results);
  } catch (error) {
    console.error("TMDB Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch movies",
      details: error.message,
    });
  }
});
// popular movies
router.get("/tmdb/popular", async (req, res) => {
  try {
    const data = await fetchFromTMDB("/movie/popular");
    res.json(data.results);
  } catch (error) {
    console.error("TMDB Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch movies",
      details: error.message,
    });
  }
});

// get movie by id
router.get("/tmdb/:id", async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/movie/${req.params.id}`);
    res.json(data);
  } catch (error) {
    console.error("TMDB Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch movie",
      details: error.message,
    });
  }
});

// get top rated movies
router.get("/tmdb/rated/top", async (req, res) => {
  try {
    const data = await fetchFromTMDB("/movie/top_rated");
    res.json(data.results);
  } catch (error) {
    console.error("TMDB Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch movies",
      details: error.message,
    });
  }
});

// ************ PUBLIC ROUTES ************
router.post("/import", moviesController.importMovies);
router.get("/", moviesController.getMovies);
router.get("/:id", moviesController.getMovieById);
router.get("/rated/top", moviesController.getTopRatedMovies);
router.get("/random/all", moviesController.getRandomMovies);

// PRIVATE ROUTES
router.post("/:id/reviews", protect, moviesController.createMovieReview);

// ******* ADMIN ROUTES *******
router.put("/:id", protect, admin, moviesController.updateMovie);
router.delete("/:id", protect, admin, moviesController.deleteMovie);
router.delete("/", protect, admin, moviesController.deleteAllMovies);
router.post("/", protect, admin, moviesController.createMovie);

export default router;
