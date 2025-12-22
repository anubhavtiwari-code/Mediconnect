import mongoose from "mongoose";

const visitSummarySchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    aiDraft: { type: String, required: true },
    finalSummary: { type: String },   // doctor edits final report
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("VisitSummary", visitSummarySchema);
