const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const User = require("../model/userSchema.js");
const allowedRoles = ["user", "admin"];
router.post(
  "/signup",
  [
    body("username").trim().escape().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }).escape(),
    body("role").isIn(allowedRoles).withMessage("Invalid role"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log("hitted");
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      console.log("Signup request body:", req.body); // Log the request body
      const { username, email, password, role } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days persistence
      });

      res.json({
        message: "Login successful",
        user: { username: user.username, role: user.role },
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});
module.exports = router;
