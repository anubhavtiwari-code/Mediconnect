// backend/scripts/updateDoctorsFinal.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config({ path: "backend/.env" });

const DOCTOR_DATA = [
  { name: "Dr. Richard James", speciality: "General Physician", image: "/assets/doc1.png" },
  { name: "Dr. Emily Larson", speciality: "General Physician", image: "/assets/doc2.png" },
  { name: "Dr. Sarah Patel", speciality: "General Physician", image: "/assets/doc3.png" },

  { name: "Dr. Ava Mitchell", speciality: "Gynecologist", image: "/assets/doc4.png" },
  { name: "Dr. Jennifer Garcia", speciality: "Gynecologist", image: "/assets/doc5.png" },
  { name: "Dr. Amelia Hill", speciality: "Gynecologist", image: "/assets/doc6.png" },

  { name: "Dr. Zoe Kelly", speciality: "Dermatologist", image: "/assets/doc7.png" },
  { name: "Dr. Ryan Martinez", speciality: "Dermatologist", image: "/assets/doc8.png" },
  { name: "Dr. Chloe Evans", speciality: "Dermatologist", image: "/assets/doc9.png" },

  { name: "Dr. Christopher Davis", speciality: "Pediatrician", image: "/assets/doc10.png" },
  { name: "Dr. Timothy White", speciality: "Pediatrician", image: "/assets/doc11.png" },
  { name: "Dr. Christopher Lee", speciality: "Pediatrician", image: "/assets/doc12.png" },

  { name: "Dr. Andrew Williams", speciality: "Neurologist", image: "/assets/doc13.png" },
  { name: "Dr. Patrick Harris", speciality: "Neurologist", image: "/assets/doc14.png" },
  { name: "Dr. Jeffrey King", speciality: "Neurologist", image: "/assets/doc15.png" },
];

const update = async () => {
  try {
    console.log("🟦 Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);

    for (const doc of DOCTOR_DATA) {
      const updated = await User.findOneAndUpdate(
        { name: doc.name },
        {
          speciality: doc.speciality,
          image: doc.image,
          fees: 500, // default
          status: "approved",
          role: "doctor",
        },
        { new: true }
      );

      if (updated) console.log(`✔ Updated ${doc.name}`);
      else console.log(`⚠ Doctor NOT found: ${doc.name}`);
    }

    console.log("\n🎉 DONE — Doctors updated successfully!");
    process.exit();
  } catch (e) {
    console.error("❌ ERROR:", e);
    process.exit(1);
  }
};

update();
