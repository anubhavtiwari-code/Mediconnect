import express from "express";
import ContactMessage from "../models/ContactMessage.js";

const router = express.Router();

// GET ALL MESSAGES (admin only)
router.get("/messages", async (req, res) => {
  try {
    const msgs = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages: msgs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

export default router;
