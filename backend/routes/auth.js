import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { authenticate } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 attempts
  message: "Too many login attempts. Try again after 15 minutes.",
});

/* ---------------- PROFILE IMAGE UPLOAD ---------------- */
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "")),
});

const profileUpload = multer({
  storage: profileStorage,
});

/* ---------------- LICENSE UPLOAD (DOCTOR) ---------------- */
const licenseStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "")),
});

const licenseUpload = multer({
  storage: licenseStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"), false);
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});


/* ---------------- Register ---------------- */
router.post(
  "/register",
  licenseUpload.single("licenseCertificate"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        role,
        hospitalName,
        degree,
        speciality,
        experience,
      } = req.body;

      const exists = await User.findOne({ email });
      if (exists)
        return res.status(400).json({ message: "User already exists" });

      // 🔐 Doctor validation
      if (role === "doctor") {
        if (!hospitalName || !degree || !speciality || !experience) {
          return res.status(400).json({
            message: "All doctor fields are required",
          });
        }

        if (!req.file) {
          return res.status(400).json({
            message: "License certificate (PDF) is required",
          });
        }
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        passwordHash,
        role,
        hospitalName: role === "doctor" ? hospitalName : "",
        degree: role === "doctor" ? degree : "",
        speciality: role === "doctor" ? speciality : "",
        experience: role === "doctor" ? experience : "",
        licenseCertificate:
          role === "doctor" ? "/uploads/" + req.file.filename : "",
        status: role === "doctor" ? "pending" : "approved", 
      });

      res.json({
        message:
          role === "doctor"
            ? "Registration successful. Awaiting admin approval."
            : "Registration successful",
        user: newUser,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ---------------- Login ---------------- */
router.post("/login", loginLimiter, async (req, res) => {
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

    /* 🔐 Doctor approval check */
    if (user.role === "doctor" && user.status !== "approved") {
      return res.status(403).json({
        message: "Doctor account not approved by admin",
      });
    }

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
  profileUpload.single("image"),
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