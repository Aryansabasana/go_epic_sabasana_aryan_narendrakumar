const express = require("express");

const router = express.Router();

const {
  generateToken,
  verifyToken,
  refreshToken,
  jwtProfile,
} = require("../controllers/jwt.controller");

const { verifyJWT } = require("../middleware/auth.middleware");

router.post("/generate-token", generateToken);

router.post("/verify-token", verifyToken);

router.post("/refresh-token", refreshToken);

router.get("/profile", verifyJWT, jwtProfile);

module.exports = router;
