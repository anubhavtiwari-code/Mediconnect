import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who uploaded
  filename: String,
  originalName: String,
  filePath: String, // served URL path like /uploads/xxx.pdf
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Record", recordSchema);

