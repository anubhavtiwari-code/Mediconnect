import Tesseract from "tesseract.js";

export async function isMedicalDocument(filePath) {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(filePath, "eng");

    const extracted = text.toLowerCase();

    const medicalWords = [
      "prescription",
      "diagnosis",
      "patient",
      "doctor",
      "dr.",
      "medical",
      "report",
      "scan",
      "x-ray",
      "mri",
      "ct",
      "blood",
      "test",
      "lab",
      "hospital",
      "clinic",
      "treatment",
      "results",
      "discharge",
    ];

    const matched = medicalWords.some((word) =>
      extracted.includes(word)
    );

    return matched;

  } catch (err) {
    console.error("OCR failed:", err);
    return false; // fail safely
  }
}

