import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Common fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    /* =========================
       Doctor Specific Fields
    ========================== */

    speciality: { type: String, default: "" },
    image: { type: String, default: "" },

    degree: { type: String, default: "" },
    experience: { type: String, default: "" },
    hospitalName: { type: String, default: "" },

    licenseCertificate: { 
      type: String,  // store file path
      default: ""
    },

    fees: { type: Number, default: 500 },
    about: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectReason: { type: String, default: "" },

    approvedAt: { type: Date },   // Track approval time

    /* =========================
      Doctor-Patient Mapping
    ========================== */

    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    patientsAssigned: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
