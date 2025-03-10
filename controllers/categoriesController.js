import asyncHandler from "express-async-handler";
import Categories from "../models/categoriesModel.js";

// ******* PUBLIC CONTROLLERS
// @desc Get all categories
// @route GET /api/categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
  try {
    // find all categories in DB
    const categories = await Categories.find({});
    //  send all categories to the client
    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//  ******* ADMIN CONTROLLERS *******
// @desc Create new category
// @route POST /api/categories
// @access Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  try {
    // get title from request
    const { title } = req.body;
    //  create new category
    const category = new Categories({ title });
    //   save the category to the DB
    const createdCategory = await category.save();
    //  send new category to the client
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Update category
// @route PUT /api/categories/:id
// @access Private/Admin
const updatecategory = asyncHandler(async (req, res) => {
  try {
    // get category id request params
    const category = await Categories.findById(req.params.id);

    if (category) {
      // update category title
      category.title = req.body.title || category.title;
      // save the updated category in DB
      const updatedCategory = await category.save();
      // send the updated category to the client
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Delete category
// @route DELETE /api/categories/:id
// @access Private/Admin
const deletecategory = asyncHandler(async (req, res) => {
  try {
    // get category id from requestparams
    const category = await Categories.findById(req.params.id);

    if (category) {
      // delete the category from DB
      await category.deleteOne();
      // send success message to the client
      res.json({ message: "Category deleted successfully!" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { getCategories, createCategory, updatecategory, deletecategory };
