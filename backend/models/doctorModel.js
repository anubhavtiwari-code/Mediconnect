import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  speciality: { type: String, required: true },
  image: { type: String, required: true },   // <-- IMPORTANT
  fee: { type: Number, default: 500 },
  experience: { type: String, default: "5 years" },
});

export default mongoose.model("Doctor", doctorSchema);
