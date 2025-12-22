// backend/routes/appointmentRoutes.js
import express from "express";
import Appointment from "../models/Appointment.js";
import { authenticate } from "../middleware/auth.js";
import crypto from "crypto";

const router = express.Router();

/* =======================================================
   PATIENT: CREATE APPOINTMENT
======================================================= */
router.post("/", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ error: "Only patients can book" });
    }

    const { doctorId, date, time, fees } = req.body;
    if (!doctorId || !date || !time)
      return res.status(400).json({ error: "Missing required fields" });

    const appt = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      fees,
    });

    res.json({ message: "Appointment booked", appointment: appt });
  } catch (err) {
    console.error("Create appointment error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =======================================================
   GET APPOINTMENTS (PATIENT or DOCTOR)
======================================================= */
router.get("/my", authenticate, async (req, res) => {
  try {
    const filter =
      req.user.role === "patient"
        ? { patientId: req.user.id }
        : { doctorId: req.user.id };

    const appointments = await Appointment.find(filter)
      .populate("patientId", "name email")
      .populate("doctorId", "name email speciality image")
      .lean();

    res.json({ appointments });
  } catch (err) {
    console.error("Fetch appointments error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =======================================================
   DOCTOR: MARK APPOINTMENT COMPLETE
======================================================= */
router.put("/complete/:id", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "doctor")
      return res.status(403).json({ error: "Only doctors allowed" });

    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    if (String(appt.doctorId) !== String(req.user.id))
      return res.status(403).json({ error: "Not authorized" });

    appt.status = "done";
    await appt.save();

    res.json({ message: "Appointment marked done" });
  } catch (err) {
    console.error("Complete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =======================================================
   DOCTOR: CANCEL APPOINTMENT
======================================================= */
router.put("/cancel/:id", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "doctor")
      return res.status(403).json({ error: "Only doctors allowed" });

    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: "Not found" });

    if (String(appt.doctorId) !== String(req.user.id))
      return res.status(403).json({ error: "Not authorized" });

    appt.status = "cancelled";
    await appt.save();

    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =======================================================
   DOCTOR: ADD SUMMARY
======================================================= */
router.put("/summary/:id", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "doctor")
      return res.status(403).json({ error: "Only doctors allowed" });

    const { summary } = req.body;
    if (!summary || summary.trim() === "")
      return res.status(400).json({ error: "Summary required" });

    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: "Not found" });

    if (String(appt.doctorId) !== String(req.user.id))
      return res.status(403).json({ error: "Not authorized" });

    appt.summary = summary;
    await appt.save();

    res.json({ message: "Summary saved" });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =======================================================
   DOCTOR: GENERATE QR TOKEN FOR CHECK-IN
======================================================= */
router.post("/generate-qr/:id", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "doctor")
      return res.status(403).json({ error: "Only doctors allowed" });

    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: "Not found" });

    if (String(appt.doctorId) !== String(req.user.id))
      return res.status(403).json({ error: "Not authorized" });

    const token = crypto.randomBytes(10).toString("hex");

    appt.qrToken = token;
    appt.qrGeneratedAt = new Date();
    await appt.save();

    res.json({
      token,
      qrUrl: `http://localhost:5173/checkin/${token}`,
    });
  } catch (err) {
    console.error("Generate QR error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =======================================================
   CHECK-IN (Via QR Scan)
======================================================= */
router.post("/checkin/:token", async (req, res) => {
  try {
    const appt = await Appointment.findOne({ qrToken: req.params.token });

    if (!appt) return res.status(404).json({ error: "Invalid token" });

    appt.checkedIn = true;
    appt.checkedInAt = new Date();
    await appt.save();

    res.json({ message: "Checked in successfully" });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
