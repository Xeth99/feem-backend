import express from "express";
import * as moviesController from "../controllers/movieController.js";
import { protect, admin } from "../middlewares/auth.js";
import fetchFromTMDB from "../config/tmdbServices.js";

const router = express.Router();

// ************ PUBLIC ROUTES FOR TMBD ************
// get all movies
router.get("/tmdb/now_playing", async (req, res) => {
  try {
    // const { language, region, page, with_genres } = req.query;
    const data = await fetchFromTMDB("/movie/now_playing");

    // let filteredMovies = data.results;
    // if (req.query.year) {
    //   filteredMovies = data.results.filter((movie) =>
    //     movie.release_date?.startsWith(req.query.year)
    //   );
    // }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all movies" });
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
      error: "Failed to fetch popular movies",
      details: error.message,
    });
  }
});

// get movie by id
router.get("/tmdb/movie/:id/with-video", async (req, res) => {
  const { id } = req.params;
  try {
    const [movieData, videoData] = await Promise.all([
      fetchFromTMDB(`/movie/${id}`),
      fetchFromTMDB(`/movie/${id}/videos`),
    ]);

    const trailer = videoData.results.find(
      (vid) => vid.site === "YouTube" && vid.type === "Trailer"
    );

    res.json({
      ...movieData,
      trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
    });
  } catch (error) {
    res.status(500).json({ error: "Could not fetch movie with trailer" });
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
      error: "Failed to fetch top-rated movies",
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
