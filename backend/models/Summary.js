import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who generated it (doctor or system)
  recordId: { type: mongoose.Schema.Types.ObjectId, ref: "Record" }, // optional link to a record
  title: { type: String, default: "Health Summary" },
  text: { type: String, required: true },
  meta: { type: Object, default: {} }, // extracted key-values (e.g., findings, meds, diagnosis)
}, { timestamps: true });

export default mongoose.model("Summary", summarySchema);
