// scripts/updateDoctors.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js"; // adjust path if different

dotenv.config();

const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mediconnect";

const STATIC = [
  { name: "Dr. Richard James", speciality: "General physician", image: "/uploads/doc1.png", degree: "MBBS", experience: "4 Years", fees: 50 },
  { name: "Dr. Emily Larson", speciality: "Gynecologist", image: "/uploads/doc2.png", degree: "MBBS", experience: "3 Years", fees: 60 },
  { name: "Dr. Sarah Patel", speciality: "Dermatologist", image: "/uploads/doc3.png", degree: "MBBS", experience: "1 Years", fees: 30 },
  { name: "Dr. Christopher Lee", speciality: "Pediatricians", image: "/uploads/doc4.png", degree: "MBBS", experience: "2 Years", fees: 40 },
  { name: "Dr. Jennifer Garcia", speciality: "Neurologist", image: "/uploads/doc5.png", degree: "MBBS", experience: "4 Years", fees: 50 },
  { name: "Dr. Andrew Williams", speciality: "Neurologist", image: "/uploads/doc6.png", degree: "MBBS", experience: "4 Years", fees: 50 },
  { name: "Dr. Christopher Davis", speciality: "General physician", image: "/uploads/doc7.png", degree: "MBBS", experience: "4 Years", fees: 50 },
  { name: "Dr. Timothy White", speciality: "Gynecologist", image: "/uploads/doc8.png", degree: "MBBS", experience: "3 Years", fees: 60 },
  { name: "Dr. Ava Mitchell", speciality: "Dermatologist", image: "/uploads/doc9.png", degree: "MBBS", experience: "1 Years", fees: 30 },
  { name: "Dr. Jeffrey King", speciality: "Pediatricians", image: "/uploads/doc10.png", degree: "MBBS", experience: "2 Years", fees: 40 },
  { name: "Dr. Zoe Kelly", speciality: "Gastroenterologist", image: "/uploads/doc11.png", degree: "MBBS", experience: "4 Years", fees: 50 },
  { name: "Dr. Patrick Harris", speciality: "Neurologist", image: "/uploads/doc12.png", degree: "MBBS", experience: "4 Years", fees: 50 },
  { name: "Dr. Chloe Evans", speciality: "General physician", image: "/uploads/doc13.png", degree: "MBBS", experience: "4 Years", fees: 50 },
  { name: "Dr. Ryan Martinez", speciality: "Gynecologist", image: "/uploads/doc14.png", degree: "MBBS", experience: "3 Years", fees: 60 },
  { name: "Dr. Amelia Hill", speciality: "Dermatologist", image: "/uploads/doc15.png", degree: "MBBS", experience: "1 Years", fees: 30 }
];

async function main() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to MongoDB");

  const notFound = [];
  for (const s of STATIC) {
    // try find by exact name first
    const filter = { name: s.name, role: "doctor" };
    const update = {
      $set: {
        speciality: s.speciality,
        image: s.image,     // stored as /uploads/xxx — frontend should prefix with server base if needed
        degree: s.degree || "",
        experience: s.experience || "",
        fees: s.fees || 0,
        about: s.about || "",
        status: "approved",
      },
    };

    const result = await User.findOneAndUpdate(filter, update, { new: true });
    if (result) {
      console.log(`Updated: ${s.name} -> _id=${result._id}`);
    } else {
      // try fallback by email pattern (if your static list had emails)
      // push not found for later manual follow up
      notFound.push(s.name);
    }
  }

  if (notFound.length) {
    console.warn("These names were not matched in DB (please verify spelling or use email-based matching):");
    console.warn(notFound);
  } else {
    console.log("All static doctors updated successfully.");
  }

  await mongoose.disconnect();
  console.log("Disconnected. Done.");
}

main().catch((err) => {
  console.error("Script error:", err);
  process.exit(1);
});
