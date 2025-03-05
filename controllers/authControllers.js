const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

/*---------Register User-------*/
exports.register = async (req, res) => {
  try {
  // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) 
    return res.status(400).json({ message: "User already exists" });

    // Create user (bcrypt applied in UserSchema)
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*---------Login User--------*/
exports.login = async (req, res) => {
  try {
    // Validate Request
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) 
    return res.status(401).json({ message: "Invalid email or password" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
    return res.status(401).json({ message: "Invalid email or password" });

    // Generate JWT token & set in HTTP-only cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token",
               token, 
               {httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 3600000});
    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/*-------------Logout User----------*/
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
