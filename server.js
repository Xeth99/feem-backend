import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouter from "./routers/userRouter.js";
import movieRouter from "./routers/movieRouter.js";
import categoriesRouter from "./routers/categoriesRouter.js";
import Uploadrouter from "./controllers/uploadFile.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const PORT = process.env.PORT || 5000;

dotenv.config();

connectDB();

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'https://feem.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api is running...");
});

// app.get("/tmdb/now_playing", async (req, res) => {
//   try {
//     const { language, region, page, with_genres } = req.query;
//     const data = await fetchFromTMDB("/movie/now_playing", {
//       language,
//       region,
//       page,
//       with_genres,
//     });

//     let filteredMovies = data.results;
//     if (req.query.year) {
//       filteredMovies = data.results.filter((movie) =>
//         movie.release_date?.startsWith(req.query.year)
//       );
//     }

//     res.json(filteredMovies);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch movies" });
//   }
// });

// app.get("/tmdb/popular", async (req, res) => {
//   try {
//     const data = await fetchFromTMDB("/movie/popular");
//     res.json(data.results);
//   } catch (error) {
//     console.error("TMDB Error:", error.response?.data || error.message);
//     res.status(500).json({
//       error: "Failed to fetch movies",
//       details: error.message,
//     });
//   }
// });

// app.get("/tmdb/:id", async (req, res) => {
//   try {
//     const data = await fetchFromTMDB(`/movie/${req.params.id}`);
//     res.json(data);
//   } catch (error) {
//     console.error("TMDB Error:", error.response?.data || error.message);
//     res.status(500).json({
//       error: "Failed to fetch movie",
//       details: error.message,
//     });
//   }
// });

// // get top rated movies
// app.get("/tmdb/rated/top", async (req, res) => {
//   try {
//     const data = await fetchFromTMDB("/movie/top_rated");
//     res.json(data.results);
//   } catch (error) {
//     console.error("TMDB Error:", error.response?.data || error.message);
//     res.status(500).json({
//       error: "Failed to fetch movies",
//       details: error.message,
//     });
//   }
// });

// other routes
app.use("/users", userRouter);
app.use("/movies", movieRouter);
app.use("/categories", categoriesRouter);
app.use("/upload", Uploadrouter);

// error handling middleware
app.use(errorHandler);

app.listen(PORT, console.log(`Server running in http://localhost/${PORT}`));
