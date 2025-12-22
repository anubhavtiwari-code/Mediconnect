// backend/routes/doctor.js
import express from "express";
import { authenticate } from "../middleware/auth.js";
import Appointment from "../models/Appointment.js"; // <- make sure this exists
import User from "../models/User.js";

const router = express.Router();

/* GET ALL DOCTORS */
router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", status: "approved" })
      .select("_id name email speciality image fees degree experience about")
      .lean();
    return res.json({ doctors });
  } catch (err) {
    console.error("Doctor list error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* GET DOCTOR'S PATIENTS (for logged-in doctor) - place BEFORE :id */
router.get("/mypatients", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "doctor") return res.status(403).json({ error: "Unauthorized" });

    const appointments = await Appointment.find({ doctorId: req.user.id }).populate("patientId", "name email").lean();

    // Unique patients
    const map = new Map();
    (appointments || []).forEach(a => {
      if (a.patientId && a.patientId._id) map.set(String(a.patientId._id), a.patientId);
    });
    const uniquePatients = Array.from(map.values());

    return res.json({ patients: uniquePatients });
  } catch (err) {
    console.error("mypatients error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* GET CURRENT LOGGED-IN DOCTOR PROFILE */
router.get("/me", authenticate, async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id)
      .select("_id name email speciality image fees degree experience about phone address")
      .lean();

    if (!doctor) return res.status(404).json({ error: "User not found" });

    // Return as { user: doctor } so frontend code that expects res.data.user keeps working
    return res.json({ user: doctor });
  } catch (err) {
    console.error("GET /api/doctors/me error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* GET DOCTOR BY ID (specific profile) */
router.get("/:id", async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: "doctor",
      status: "approved",
    })
      .select("_id name email speciality image fees degree experience about hospital qualifications")
      .lean();

    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    return res.json({ doctor });
  } catch (err) {
    console.error("Doctor by ID error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
