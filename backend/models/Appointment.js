import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  date: String,
  time: String,
  fees: Number,

  status: {
    type: String,
    default: "booked",
    enum: ["booked", "cancelled", "done"],
  },

  summary: String,

  qrToken: String,
  qrGeneratedAt: Date,
  checkedIn: { type: Boolean, default: false },
  checkedInAt: Date,

}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);

