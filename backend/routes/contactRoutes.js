import express from "express";
import ContactMessage from "../models/ContactMessage.js";
import { deleteMessage } from "../controllers/contactController.js";  
import { sendMail } from "../utils/sendMail.js";

const router = express.Router();
router.delete("/delete/:id", deleteMessage);
router.post("/send-message", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    // 1️⃣ SAVE TO MONGODB
    const newMsg = await ContactMessage.create({ name, email, message });

    // 2️⃣ SEND EMAIL TO ADMIN
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Message - MediConnect",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    return res.status(200).json({
      success: true,
      msg: "Thank you! Your message has been sent.",
      data: newMsg
    });

  } catch (error) {
    console.error("CONTACT FORM ERROR:", error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

export default router;

