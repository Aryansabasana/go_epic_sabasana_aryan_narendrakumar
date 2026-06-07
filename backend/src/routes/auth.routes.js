const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  logoutUser,
} = require("../controllers/auth.controller.js");

const validateUser = require("../middleware/validateUser.middleware.js");

const { verifyJWT } = require("../middleware/auth.middleware");

router.post("/register", validateUser, registerUser);

router.post("/login", loginUser);

router.get("/profile", verifyJWT, getProfile);

router.patch("/profile", verifyJWT, updateProfile);

router.post("/logout", verifyJWT, logoutUser);

module.exports = router;
