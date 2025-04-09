import express from "express";
import * as moviesController from "../controllers/movieController.js";
import { protect, admin } from "../middlewares/auth.js";
import fetchFromTMDB from "../config/tmdbServices.js";

const router = express.Router();

// ************ PUBLIC ROUTES FOR TMBD ************
// popular movies
router.get('/tmdb/popular', async (req, res) => {
    try {
      const data = await fetchFromTMDB('/movie/popular');
      res.json(data.results);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch from TMDB' });
    }
  });

  router.get('/tmdb/:id', async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/movie/${req.params.id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Movie not found' });
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
router.delete("/:id", protect, admin, moviesController.deleteMovie)
router.delete("/", protect, admin, moviesController.deleteAllMovies)
router.post("/", protect, admin, moviesController.createMovie)

export default router;
