import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import { authenticate } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

/* ---------------- File Upload Setup ---------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "")),
});
const upload = multer({ storage });


/* ---------------- REGISTER ---------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role,
    });

    res.json({ message: "Registration successful", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ---------------- LOGIN ---------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ---------------- UPDATE PROFILE ---------------- */
router.put(
  "/update-profile",
  authenticate,
  upload.single("image"),
  async (req, res) => {
    try {
      const updates = {
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        phone: req.body.phone,
        address: req.body.address,
      };

      if (req.file) {
        updates.image = "/uploads/" + req.file.filename;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updates,
        { new: true }
      );

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (err) {
      console.error("Profile update failed:", err);
      res.status(500).json({ error: "Profile update failed" });
    }
  }
);
/* ---------------- GET LOGGED-IN USER ---------------- */
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("GET /auth/me error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



export default router;
