// Generates a summary (optionally using OpenAI if configured)
// Saves a Summary document and returns it.
import Summary from "../models/Summary.js";
import Record from "../models/Record.js"; // if you have records
import { callOpenAIForSummary } from "../utils/openaiHelper.js"; // helper (optional)

export const generateSummary = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { patientId, recordId, prompt } = req.body;
    if (!patientId && !recordId) return res.status(400).json({ message: "patientId or recordId required" });

    // load record text if provided
    let recordText = "";
    if (recordId) {
      const record = await Record.findById(recordId);
      if (!record) return res.status(404).json({ message: "Record not found" });
      recordText = record.text || record.content || "";
    }

    // Build input to LLM
    const baseInput = `${prompt || "Summarize the following medical record in a concise, structured way:"}\n\n${recordText}`;

    // If OPENAI_API_KEY exists use it (via helper), otherwise fallback to a naive summarizer
    let summaryText;
    if (process.env.OPENAI_API_KEY) {
      summaryText = await callOpenAIForSummary(baseInput);
    } else {
      // naive fallback: simple extract — take first 300-600 chars + basic headings
      summaryText = recordText.slice(0, 800) || "No detailed record text available. Provide more data.";
      summaryText = `AutoSummary (fallback)\n\n${summaryText}\n\n(Enable OPENAI_API_KEY for better summaries)`;
    }

    // optional extract meta (very simple heuristics)
    const meta = {};
    const medsMatch = summaryText.match(/(?:medications|meds|Rx)[:\-\s]*([^\n]+)/i);
    if (medsMatch) meta.medications = medsMatch[1].trim();

    const summary = await Summary.create({
      patient: patientId || req.user?.id,
      author: userId,
      recordId: recordId || null,
      title: `Summary — ${new Date().toLocaleDateString()}`,
      text: summaryText,
      meta
    });

    return res.status(201).json({ message: "Summary created", summary });
  } catch (err) {
    console.error("generateSummary:", err);
    return res.status(500).json({ message: "Server error generating summary" });
  }
};

export const mySummaries = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // If patient role, show their summaries; if doctor/admin, allow query param ?patientId=...
    const { patientId } = req.query;
    const filter = {};
    if (req.user.role === "patient") filter.patient = userId;
    else if (patientId) filter.patient = patientId;

    const summaries = await Summary.find(filter)
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.json({ summaries });
  } catch (err) {
    console.error("mySummaries:", err);
    return res.status(500).json({ message: "Server error fetching summaries" });
  }
};

export const getSummary = async (req, res) => {
  try {
    const id = req.params.id;
    const summary = await Summary.findById(id).populate("author", "name");
    if (!summary) return res.status(404).json({ message: "Summary not found" });
    // access control: patient only allowed to view their own unless role permits
    if (req.user.role === "patient" && summary.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.json({ summary });
  } catch (err) {
    console.error("getSummary:", err);
    return res.status(500).json({ message: "Server error fetching summary" });
  }
};
