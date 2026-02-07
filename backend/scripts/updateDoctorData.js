import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config({ path: "backend/.env" });

const IMAGE_MAP = {
  "Dr. Richard James": "/assets/doc1.png",
  "Dr. Emily Larson": "/assets/doc2.png",
  "Dr. Sarah Patel": "/assets/doc3.png",
  "Dr. Ava Mitchell": "/assets/doc4.png",
  "Dr. Jennifer Garcia": "/assets/doc5.png",
  "Dr. Amelia Hill": "/assets/doc6.png",
  "Dr. Zoe Kelly": "/assets/doc7.png",
  "Dr. Ryan Martinez": "/assets/doc8.png",
  "Dr. Chloe Evans": "/assets/doc9.png",
  "Dr. Christopher Davis": "/assets/doc10.png",
  "Dr. Timothy White": "/assets/doc11.png",
  "Dr. Christopher Lee": "/assets/doc12.png",
  "Dr. Andrew Williams": "/assets/doc13.png",
  "Dr. Patrick Harris": "/assets/doc14.png",
  "Dr. Jeffrey King": "/assets/doc15.png"
};

// 3–of–each speciality
const SPECIALITY = [
  "General Physician",
  "Dermatologist",
  "Gynecologist",
  "Psychologist",
  "Pediatrician"
];

let counter = 0;

async function run() {
  try {
    console.log("Connecting...");
    await mongoose.connect(process.env.MONGO_URI);

    const doctors = await User.find({ role: "doctor" });

    for (let doctor of doctors) {
      doctor.speciality = SPECIALITY[counter % SPECIALITY.length];
      doctor.image = IMAGE_MAP[doctor.name] || "/assets/default.png";
      doctor.fees = 500;
      doctor.degree = "MBBS, MD";
      doctor.experience = "5 Years";
      doctor.about = "Experienced doctor providing high-quality care.";

      await doctor.save();
      console.log("Updated:", doctor.name);

      counter++;
    }

    console.log("DONE!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
