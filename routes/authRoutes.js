const express = require("express");
const { check } = require("express-validator");
const { register, login, logout } = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    check("name", "Name is mandatory").not().isEmpty(),
    check("email", "Valid email is mandatory").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  register
);

router.post(
  "/login",
  [
    check("email", "Valid email is mandatory").isEmail(),
    check("password", "Password is mandatory").not().isEmpty(),
  ],
  login
);

router.post("/logout", authMiddleware, logout);

module.exports = router;
