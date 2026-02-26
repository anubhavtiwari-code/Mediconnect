// backend/routes/admin.js
import express from "express";
import path from "path";
import { authenticate } from "../middleware/auth.js";
import Activity from "../models/Activity.js";
import Record from "../models/Record.js";
import User from "../models/User.js";

const router = express.Router();

/* ================= ADMIN GUARD ================= */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

/* ======================================================
   DASHBOARD STATS
====================================================== */
router.get("/stats", authenticate, adminOnly, async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({
      role: "doctor",
      status: "approved",
    });
    const pendingDoctors = await User.countDocuments({
      role: "doctor",
      status: "pending",
    });
    const totalRecords = await Record.countDocuments();

    res.json({ totalPatients, totalDoctors, pendingDoctors, totalRecords });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   GET ALL DOCTORS (FILTERABLE)
====================================================== */
router.get("/doctors", authenticate, adminOnly, async (req, res) => {
  try {
    const status = req.query.status || "all";

    const query = { role: "doctor" };
    if (status === "pending") query.status = "pending";
    if (status === "approved") query.status = "approved";

    const doctors = await User.find(query)
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   GET SINGLE DOCTOR FULL PROFILE (IMPORTANT NEW ROUTE)
====================================================== */
router.get("/doctors/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select("-passwordHash");

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json({ doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   APPROVE DOCTOR
====================================================== */
router.post("/doctors/approve", authenticate, adminOnly, async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId)
      return res.status(400).json({ error: "doctorId required" });

    const doc = await User.findById(doctorId);

    if (!doc || doc.role !== "doctor") {
      return res.status(404).json({ error: "Doctor not found" });
    }

    doc.status = "approved";
    doc.approvedAt = new Date();
    doc.rejectReason = "";

    await doc.save();

    await Activity.create({
      actorId: req.user.id,
      type: "doctor.approve",
      message: `Approved doctor ${doc.email}`,
      meta: { doctorId },
    });

    res.json({ message: "Doctor approved", doctor: doc });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   REJECT DOCTOR
====================================================== */
router.post("/doctors/reject", authenticate, adminOnly, async (req, res) => {
  try {
    const { doctorId, reason } = req.body;

    if (!doctorId)
      return res.status(400).json({ error: "doctorId required" });

    const doc = await User.findById(doctorId);

    if (!doc || doc.role !== "doctor") {
      return res.status(404).json({ error: "Doctor not found" });
    }

    doc.status = "rejected";
    doc.rejectReason = reason || "Not specified";

    await doc.save();

    await Activity.create({
      actorId: req.user.id,
      type: "doctor.reject",
      message: `Rejected doctor ${doc.email}`,
      meta: { doctorId, reason },
    });

    res.json({ message: "Doctor rejected", doctor: doc });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   VIEW DOCTOR LICENSE (FIXED)
====================================================== */
router.get(
  "/doctors/license/:id",
  authenticate,
  adminOnly,
  async (req, res) => {
    try {
      const doctor = await User.findById(req.params.id);

      if (!doctor || !doctor.licenseCertificate) {
        return res.status(404).json({ error: "License not found" });
      }
      
const filePath = path.join(process.cwd(), doctor.licenseCertificate);

      res.sendFile(filePath);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* ======================================================
   DELETE DOCTOR
====================================================== */
router.delete("/doctors/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const id = req.params.id;

    await User.findByIdAndDelete(id);

    await Activity.create({
      actorId: req.user.id,
      type: "doctor.delete",
      message: `Deleted doctor ${id}`,
      meta: { doctorId: id },
    });

    res.json({ message: "Doctor removed" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   PATIENT MANAGEMENT
====================================================== */
router.get("/patients", authenticate, adminOnly, async (req, res) => {
  try {
    const q = { role: "patient" };
    if (req.query.doctorId) q.assignedDoctor = req.query.doctorId;

    const patients = await User.find(q)
      .select("_id name email assignedDoctor");

    res.json({ patients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/patients/assign", authenticate, adminOnly, async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;

    if (!patientId || !doctorId)
      return res.status(400).json({ error: "patientId and doctorId required" });

    await User.findByIdAndUpdate(patientId, {
      assignedDoctor: doctorId,
    });

    res.json({ message: "Assigned successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   RECORD MANAGEMENT
====================================================== */
router.get("/records", authenticate, adminOnly, async (req, res) => {
  try {
    const records = await Record.find().sort({ createdAt: -1 });

    res.json({ records });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/records/:id", authenticate, adminOnly, async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: "Record removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   ACTIVITY LOG
====================================================== */
router.get("/activity", authenticate, adminOnly, async (req, res) => {
  try {
    const items = await Activity.find().sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;