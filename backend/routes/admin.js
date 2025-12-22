// backend/routes/admin.js
import express from "express";
import User from "../models/User.js";
import Record from "../models/Record.js";
import Activity from "../models/Activity.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// admin-only guard
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

/**
 * GET /api/admin/stats
 * returns simple counts for dashboard
 */
router.get("/stats", authenticate, adminOnly, async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor", status: "approved" });
    const pendingDoctors = await User.countDocuments({ role: "doctor", status: "pending" });
    const totalRecords = await Record.countDocuments();
    res.json({ totalPatients, totalDoctors, pendingDoctors, totalRecords });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/admin/doctors
 * Query param status=all|pending|approved
 */
router.get("/doctors", authenticate, adminOnly, async (req, res) => {
  try {
    const status = req.query.status || "all";
    const q = { role: "doctor" };
    if (status === "pending") q.status = "pending";
    if (status === "approved") q.status = "approved";
    const doctors = await User.find(q).select("_id name email status bio").lean();
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/doctors/approve
 * body: { doctorId }
 */
router.post("/doctors/approve", authenticate, adminOnly, async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId) return res.status(400).json({ error: "doctorId required" });

    const doc = await User.findByIdAndUpdate(doctorId, { status: "approved" }, { new: true }).lean();

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

/**
 * POST /api/admin/doctors/reject
 * body: { doctorId, reason }
 */
router.post("/doctors/reject", authenticate, adminOnly, async (req, res) => {
  try {
    const { doctorId, reason } = req.body;
    if (!doctorId) return res.status(400).json({ error: "doctorId required" });

    const doc = await User.findByIdAndUpdate(doctorId, { status: "rejected", rejectReason: reason || "" }, { new: true }).lean();

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

/**
 * DELETE /api/admin/doctors/:id
 * Delete doctor user (admin action)
 */
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

/**
 * GET /api/admin/patients
 * List patients with optional doctor filter
 */
router.get("/patients", authenticate, adminOnly, async (req, res) => {
  try {
    const q = { role: "patient" };
    if (req.query.doctorId) q.assignedDoctor = req.query.doctorId;
    const patients = await User.find(q).select("_id name email assignedDoctor").lean();
    res.json({ patients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/patients/assign
 * body: { patientId, doctorId }
 */
router.post("/patients/assign", authenticate, adminOnly, async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;
    if (!patientId || !doctorId) return res.status(400).json({ error: "patientId and doctorId required" });

    await User.findByIdAndUpdate(patientId, { assignedDoctor: doctorId });
    await Activity.create({
      actorId: req.user.id,
      type: "patient.assign",
      message: `Assigned patient ${patientId} to doctor ${doctorId}`,
      meta: { patientId, doctorId },
    });

    res.json({ message: "Assigned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/patients/:id", authenticate,  async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * GET /api/admin/records
 * View all records with pagination
 */
router.get("/records", authenticate, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 25, 200);
    const skip = (page - 1) * limit;
    const records = await Record.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await Record.countDocuments();
    res.json({ records, total, page, limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/admin/records/:id
 */
router.delete("/records/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const id = req.params.id;
    await Record.findByIdAndDelete(id);
    await Activity.create({
      actorId: req.user.id,
      type: "record.delete",
      message: `Admin deleted record ${id}`,
      meta: { recordId: id },
    });
    res.json({ message: "Record removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/admin/activity
 * List activity log (most recent first)
 */
router.get("/activity", authenticate, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const skip = (page - 1) * limit;
    const items = await Activity.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    res.json({ items, page, limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

