import express from "express";
import * as categoriesController from "../controllers/categoriesController.js";
import { protect, admin } from "../middlewares/auth.js";

const router = express.Router();

// ******* PUBLIC ROUTES *******
router.get("/", categoriesController.getCategories);

// ******* ADMIN ROUTES *******
router.post("/", protect, admin, categoriesController.createCategory);
router.put("/:id", protect, admin, categoriesController.updatecategory);
router.post("/:id", protect, admin, categoriesController.deletecategory);

export default router;
