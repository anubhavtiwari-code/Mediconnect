import express from "express";
import { authenticate} from "../middleware/auth.js";
import QRShare from "../models/QRShare.js";
import Record from "../models/Record.js";
import crypto from "crypto";
import QRCode from "qrcode";

const router = express.Router();

/* -----------------------------
   Generate QR Token (Patient)
------------------------------ */
router.post("/generate", authenticate, async (req, res) => {
  try {
    const { recordId, expiresInMinutes } = req.body;

    if (!recordId)
      return res.status(400).json({ message: "Record ID required" });

    const record = await Record.findById(recordId);

    if (!record)
      return res.status(404).json({ message: "Record not found" });

    // patient must own this record
    if (record.patient.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const token = crypto.randomBytes(20).toString("hex");

    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);

    const doc = await QRShare.create({
      record: recordId,
      token,
      expiresAt,
      createdBy: req.user.id,
    });

    // generate QR code image
    const qrUrl = `http://localhost:5000/api/qrshare/view/${token}`;
    const qrImage = await QRCode.toDataURL(qrUrl);

    res.json({
      message: "QR Generated",
      token,
      expiresAt,
      qrImage,
      qrUrl,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------------------------
   View Shared Record (via QR token)
-------------------------------------------- */
router.get("/view/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const share = await QRShare.findOne({ token }).populate("record");

    if (!share)
      return res.status(404).json({ message: "Invalid token" });

    // expired?
    if (share.expiresAt < new Date())
      return res.status(410).json({ message: "Token expired" });

    // if single-use and already used
    if (share.singleUse && share.used)
      return res.status(410).json({ message: "Token already used" });

    // mark as used
    share.used = true;
    await share.save();

    res.json({
      message: "Record accessed successfully",
      record: share.record,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
