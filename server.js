// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { connectDB } from "./config/db.js";
// import userRouter from "./routers/userRouter.js";
// import movieRouter from "./routers/movieRouter.js";
// import categoriesRouter from "./routers/categoriesRouter.js";
// import Uploadrouter from "./controllers/uploadFile.js";
// import { errorHandler } from "./middlewares/errorMiddleware.js";

// dotenv.config();

// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Api is running...");
// });

// // other routes
// app.use("/api/users", userRouter);
// app.use("/api/movies", movieRouter);
// app.use("/api/categories", categoriesRouter);
// app.use("/api/upload", Uploadrouter);

// // error handling middleware
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, console.log(`Server running in http://localhost/${PORT}/api`));
