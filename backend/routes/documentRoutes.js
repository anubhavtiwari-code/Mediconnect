import express from "express";
import { upload } from "../middleware/upload.js";
import { isMedicalDocument } from "../utils/medicalValidator.js";

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const valid = await isMedicalDocument(filePath);

    if (!valid) {
      return res.status(400).json({
        message: "❌ Only medical documents are allowed. Upload a valid medical report."
      });
    }

    // TODO: Save file info in MongoDB
    // await DocumentModel.create({ userId, filePath });

    res.json({ message: "✔ Medical document uploaded successfully!", file: req.file });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;

