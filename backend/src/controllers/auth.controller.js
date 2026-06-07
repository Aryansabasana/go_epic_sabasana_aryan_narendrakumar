const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model.js");

const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/apiError.js");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new ApiError(
      400,
      "User already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      400,
      "Email and password are required"
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      401,
      "Invalid credentials"
    );
  }

  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordValid) {
    throw new ApiError(
      401,
      "Invalid credentials"
    );
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN,
    }
  );

  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser =
    await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Logout successful. Remove token from client storage.",
  });
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  logoutUser,
};