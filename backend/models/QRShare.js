import mongoose from "mongoose";

const QRShareSchema = new mongoose.Schema(
  {
    record: { type: mongoose.Schema.Types.ObjectId, ref: "Record", required: true },
    token: { type: String, unique: true },
    expiresAt: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    singleUse: { type: Boolean, default: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("QRShare", QRShareSchema);
