import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Record from "../models/Record.js";
import { authenticate } from "../middleware/auth.js";
import Tesseract from "tesseract.js";

const router = express.Router();


// ------------------------------------------------------------
// Ensure /uploads exists
// ------------------------------------------------------------
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);


// ------------------------------------------------------------
// Multer storage engine
// ------------------------------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || "";
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage });


// ------------------------------------------------------------
// Comprehensive Medical Keyword List
// ------------------------------------------------------------
const MEDICAL_KEYWORDS = [
  // General medical terms
  "prescription","diagnosis","patient","doctor","dr.","medical","report",
  "scan","hospital","clinic","treatment","results","test","lab","pathology",
  "radiology","clinical", "health", "medicine",

  // Hemogram / CBC-specific (important for your report)
  "haemogram","hemogram","haemoglobin","hemoglobin","cbc",
  "complete haemogram","complete hemogram","complete blood count",
  "tlc","total leucocyte count","dlc","differential","leucocyte",
  "neutrophil","lymphocyte","monocyte","eosinophil","basophil",
  "rbc","r.b.c","hematocrit","haematocrit","mcv","mch","mchc",
  "platelet","platelets","pcv",

  // Common pathology report terms
  "g/dl","millions","cu.mm","cumm","lakh","lakhs","fl","pg","g/ml"
];


// =================================================================================
// 📌 UPLOAD ROUTE (MAIN FEATURE)
// =================================================================================
router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "File missing" });

    const { notes, patientId } = req.body;
    if (!patientId) return res.status(400).json({ error: "patientId is required" });

    const fullPath = file.path;
    let extractedText = "";

    // ------------------------------------------------------------
    // 📄 PDF Handling (pdf-parse, dynamic import)
    // ------------------------------------------------------------
    if (file.mimetype === "application/pdf") {
      try {
        const pdfParse = (await import("pdf-parse")).default;
        const buffer = fs.readFileSync(fullPath);
        const pdfData = await pdfParse(buffer);
        extractedText = (pdfData.text || "").toLowerCase();

        console.log("📄 PDF Extracted Text:", extractedText.slice(0, 200));
      } catch (err) {
        console.error("❌ PDF parse error:", err.message);
        extractedText = "";
      }
    }

    // ------------------------------------------------------------
    // 🖼️ IMAGE OCR Handling (Tesseract.js)
    // ------------------------------------------------------------
    else {
      try {
        const result = await Tesseract.recognize(fullPath, "eng", {
          logger: () => {}
        });

        extractedText = (result.data.text || "").toLowerCase();
        console.log("🖼️ OCR Extracted Text:", extractedText.slice(0, 200));

      } catch (err) {
        console.error("❌ OCR error:", err.message);
        extractedText = "";
      }
    }

    // ------------------------------------------------------------
    // 🧠 MEDICAL DETECTION (Garbage OCR Fix)
    // ------------------------------------------------------------

    const isImage = file.mimetype.startsWith("image/");

    // Extract meaningful alphabetic words
    const cleanWords = extractedText.match(/[a-zA-Z]{3,}/g) || [];
    const wordCount = cleanWords.length;

    console.log("Valid OCR Words:", cleanWords);
    console.log("Word Count:", wordCount);

    let isMedical = false;

    // ✔ RULE 1: If IMAGE & OCR is garbage or less than 10 real words → ACCEPT
    if (isImage && wordCount < 10) {
      console.log("✔ Garbage OCR detected but image file → accepting as medical image");
      isMedical = true;
    }

    // ✔ RULE 2: If PDF → must match keywords
    else if (!isImage) {
      isMedical = MEDICAL_KEYWORDS.some(word =>
        extractedText.includes(word)
      );
    }

    // ✔ RULE 3: If readable text exists → keyword match
    else {
      isMedical = MEDICAL_KEYWORDS.some(word =>
        extractedText.includes(word)
      );
    }

    if (!isMedical) {
      fs.unlinkSync(fullPath);
      return res.status(400).json({
        error: "❌ Only medical documents can be uploaded."
      });
    }

    // ------------------------------------------------------------
    // 💾 SAVE RECORD IN DATABASE
    // ------------------------------------------------------------
    const record = await Record.create({
      patientId,
      uploaderId: req.user.id,
      filename: file.filename,
      originalName: file.originalname,
      filePath: `uploads/${file.filename}`,
      notes: notes || "",
    });

    return res.json({
      message: "✔ Medical Document Uploaded Successfully",
      record,
    });

  } catch (err) {
    console.error("❌ Upload error:", err);
    return res.status(500).json({ error: err.message });
  }
});


// =================================================================================
// 📌 GET RECORDS BY USER ID
// =================================================================================
router.get("/user/:id", authenticate, async (req, res) => {
  try {
    const uid = req.params.id;

    if (req.user.role === "patient" && req.user.id !== uid) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const records = await Record.find({ patientId: uid })
      .sort({ createdAt: -1 })
      .lean();

    const recordsWithUrl = records.map(r => ({
      ...r,
      fileUrl: `${req.protocol}://${req.get("host")}/${r.filePath}`,
    }));

    res.json({ records: recordsWithUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// =================================================================================
// 📌 GET MY RECORDS
// =================================================================================
router.get("/mine", authenticate, async (req, res) => {
  try {
    const records = await Record.find({ patientId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const recordsWithUrl = records.map(r => ({
      ...r,
      fileUrl: `${req.protocol}://${req.get("host")}/${r.filePath}`,
    }));

    res.json({ records: recordsWithUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
