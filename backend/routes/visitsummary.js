import express from "express";
import { authenticate } from "../middleware/auth.js";
import VisitSummary from "../models/VisitSummary.js";
import User from "../models/User.js";
import OpenAI from "openai";

const router = express.Router();

function getClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function runAI(prompt) {
  const client = getClient();
  if (!client) return "⚠️ OpenAI API key missing.";

  try {
    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    });

    return result.choices[0].message.content;
  } catch (err) {
    console.error("AI Error:", err);
    return "⚠️ AI generation failed.";
  }
}

/* =============================
   1. Doctor Generates Summary
============================= */
router.post("/generate", authenticate, async (req, res) => {
  try {
    const { patientId, doctorNotes } = req.body;

    if (!patientId || !doctorNotes)
      return res.status(400).json({ message: "Missing fields" });

    const patient = await User.findById(patientId);
    const doctor = await User.findById(req.user.id);

    const prompt = `
Create a structured medical visit summary:

Patient: ${patient.name}
Doctor Notes:
${doctorNotes}

Sections Needed:
1. Chief Complaint
2. History
3. Diagnosis
4. Treatment
5. Follow-up
`;

    const aiDraft = await runAI(prompt);

    const summary = await VisitSummary.create({
      patient: patientId,
      doctor: req.user.id,
      aiDraft,
      approved: false
    });

    res.json({ message: "Draft created", summary });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =============================
   2. Doctor Finalizes Summary
============================= */
router.post("/finalize/:id", authenticate, async (req, res) => {
  try {
    const { finalSummary } = req.body;

    const summary = await VisitSummary.findById(req.params.id);

    summary.finalSummary = finalSummary;
    summary.approved = true;
    await summary.save();

    res.json({ message: "Summary approved", summary });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =============================
   3. Patient Views Approved Summaries
============================= */
router.get("/my", authenticate, async (req, res) => {
  try {
    const list = await VisitSummary.find({
      patient: req.user.id,
      approved: true
    }).sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =============================
   4. Single Summary
============================= */
router.get("/:id", authenticate, async (req, res) => {
  try {
    const s = await VisitSummary.findById(req.params.id)
      .populate("doctor", "name")
      .populate("patient", "name");

    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
