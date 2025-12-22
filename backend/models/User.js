import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Common fields for all users
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    // User type: patient / doctor / admin
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    // Doctor-specific fields
    speciality: { type: String, default: "" },
    image: { type: String, default: "" }, // frontend will use default-doctor.png if empty

    degree: { type: String, default: "" },
    experience: { type: String, default: "" },
    fees: { type: Number, default: 500 },          // doctor fees
    about: { type: String, default: "" },          // intro / bio

    // Doctor approval status (used by admin)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectReason: { type: String, default: "" },

    // Patient assigned to doctor OR doctor’s patient list
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    patientsAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },

  { timestamps: true }
);

export default mongoose.model("User", userSchema);
