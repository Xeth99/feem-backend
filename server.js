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
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api is running...");
});

// other routes
app.use("/users", userRouter);
app.use("/movies", movieRouter);
app.use("/categories", categoriesRouter);
app.use("/upload", Uploadrouter);

// error handling middleware
app.use(errorHandler);

app.listen(PORT, console.log(`Server running in http://localhost/${PORT}`));
