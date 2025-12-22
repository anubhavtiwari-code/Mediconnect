import express from "express";
import Chat from "../models/Chat.js";

const router = express.Router();

// get messages
router.get("/:appointmentId", async (req, res) => {
  const messages = await Chat.find({ appointmentId: req.params.appointmentId });
  res.json({ messages });
});

// save message
router.post("/send", async (req, res) => {
  const msg = await Chat.create(req.body);
  res.json({ message: msg });
});

export default router;
