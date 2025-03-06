import express from "express";
import {
  loginUser,
  registerUser,
  updateUserProfile,
  deleteUserProfile,
  changeUserPassword,
  getLikedMovies,
  addLikedMovies,
  deleteLikedMovie,
  deleteAllLikedMovies,
  getUsers,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middlewares/auth.js";

const router = express.Router();

// ************ PUBLIC ROUTES ************
router.post("/sign_up", registerUser);

router.post("/login", loginUser);

// ************ PRIVATE ROUTES ************
router.put("/profile", protect, updateUserProfile);

router.delete("/profile", protect, deleteUserProfile);

router.put("/password", protect, changeUserPassword);

router.get("/favorites", protect, getLikedMovies);

router.post("/favorites", protect, addLikedMovies);

router.delete("/favorites/:movieId", protect, deleteLikedMovie);

router.delete("/favorites", protect, deleteAllLikedMovies);

// ******* ADMIN ROUTES *******
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

export default router;
