import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../middlewares/auth.js";

//  @desc Register a new user
// @route POST /api/users/sign_up
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, image } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      image,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      const err = new Error("Invalid email or password");
      err.code = 401;
      throw err;
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ******* Private controller ********
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, email, image } = req.body;
  try {
    // finds user in DB by id
    const user = await User.findById(req.user._id);
    // if user exists, update user data
    if (user) {
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      user.image = image || user.image;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        image: updatedUser.image,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Delete User
// @route DELETE /api/users/delete/:id
// @access Private
const deleteUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      if (user.isAdmin) {
        res.status(400);
        throw new Error("Admin can't be deleted");
      }
      await user.deleteOne();
      // await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Change password
// @route PUT /api/users/password/:id
// @access Private
const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    // Check if the old password is correct
    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.json({ message: "Password changed" });
    } else {
      res.status(401);
      throw new Error("Invalid old password");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Add movie to liked movies
// @route POST /api/users/favorites
// @access private
const addLikedMovies = asyncHandler(async (req, res) => {
  const { movieId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    // if user exists, add movie to liked movies and save it to DB
    if (user) {
      // check if movie already liked
      // if already liked, send error
      if (user.likedMovies.includes(movieId)) {
        res.status(400);
        throw new Error("Movie already liked");
      }
      // else add movie to liked movies and save
      user.likedMovies.push(movieId);
      await user.save();
      res.json(user.likedMovies);
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Get all liked movies
// @route GET /api/users/:id/favorites
// @access Private
const getLikedMovies = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("likedMovies");
    if (user) {
      res.json(user.likedMovies);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Delete one liked movie
// @route DELETE /api/users/:id/favorites/:movieId
// @access Private
const deleteLikedMovie = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      // Check if the movie exists in the likedMovies array
      const movieExists = user.likedMovies.some(
        (m) => m._id.toString() === req.params.movieId
      );

      if (!movieExists) {
        return res.status(400).json({ message: "Movie is not liked" });
      }

      // Filter out the movie from likedMovies
      user.likedMovies = user.likedMovies.filter(
        (m) => m._id.toString() !== req.params.movieId
      );
      await user.save();
      res.json({
        message: "Movie removed from liked movies",
        likedMovies: user.likedMovies,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//  @desc Delete all liked movies
// @route DELETE /api/users/favorites
// @access Private
const deleteAllLikedMovies = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // if users exists, delete all liked movies
    if (user) {
      user.likedMovies = [];
      await user.save();
      res.json({ message: "Your favorite movies deleted successfully!" });
    } else {
      res.status(400);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ******* ADMIN CONTROLLERS *******
// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Delete users
// @route DELETE /api/users/:id
// @acces Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      // if user is an admin
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Can't delete admin user");
      }
      await user.remove();
      res.json({ message: "User deleted successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
export {
  registerUser,
  loginUser,
  updateUserProfile,
  deleteUserProfile,
  changeUserPassword,
  getLikedMovies,
  addLikedMovies,
  deleteLikedMovie,
  deleteAllLikedMovies,
  getUsers,
  deleteUser,
};
