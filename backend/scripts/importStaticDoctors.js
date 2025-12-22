import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config({ path: "./backend/.env" });

// -------------------------------
// 15 DOCTORS – 5 SPECIALITIES
// -------------------------------
const doctors = [
  // 1️⃣ GENERAL PHYSICIAN (3)
  {
    name: "Dr. Richard James",
    email: "dr.richardjames@mediconnect.com",
    speciality: "General Physician",
    image: "/assets/doc1.png",
    fees: 500
  },
  {
    name: "Dr. Emily Larson",
    email: "dr.emilylarson@mediconnect.com",
    speciality: "General Physician",
    image: "/assets/doc2.png",
    fees: 450
  },
  {
    name: "Dr. Sarah Patel",
    email: "dr.sarahpatel@mediconnect.com",
    speciality: "General Physician",
    image: "/assets/doc3.png",
    fees: 400
  },

  // 2️⃣ GYNAECOLOGIST (3)
  {
    name: "Dr. Ava Mitchell",
    email: "dr.avamitchell@mediconnect.com",
    speciality: "Gynaecologist",
    image: "/assets/doc4.png",
    fees: 600
  },
  {
    name: "Dr. Jennifer Garcia",
    email: "dr.jennifergarcia@mediconnect.com",
    speciality: "Gynaecologist",
    image: "/assets/doc5.png",
    fees: 650
  },
  {
    name: "Dr. Amelia Hill",
    email: "dr.ameliahill@mediconnect.com",
    speciality: "Gynaecologist",
    image: "/assets/doc6.png",
    fees: 700
  },

  // 3️⃣ DERMATOLOGIST (3)
  {
    name: "Dr. Zoe Kelly",
    email: "dr.zoekelly@mediconnect.com",
    speciality: "Dermatologist",
    image: "/assets/doc7.png",
    fees: 550
  },
  {
    name: "Dr. Ryan Martinez",
    email: "dr.ryanmartinez@mediconnect.com",
    speciality: "Dermatologist",
    image: "/assets/doc8.png",
    fees: 590
  },
  {
    name: "Dr. Chloe Evans",
    email: "dr.chloeevans@mediconnect.com",
    speciality: "Dermatologist",
    image: "/assets/doc9.png",
    fees: 620
  },

  // 4️⃣ PSYCHOLOGIST (3)
  {
    name: "Dr. Christopher Davis",
    email: "dr.christopherdavis@mediconnect.com",
    speciality: "Psychologist",
    image: "/assets/doc10.png",
    fees: 500
  },
  {
    name: "Dr. Timothy White",
    email: "dr.timothywhite@mediconnect.com",
    speciality: "Psychologist",
    image: "/assets/doc11.png",
    fees: 550
  },
  {
    name: "Dr. Christopher Lee",
    email: "dr.christopherlee@mediconnect.com",
    speciality: "Psychologist",
    image: "/assets/doc12.png",
    fees: 530
  },

  // 5️⃣ ORTHOPEDIC (3)
  {
    name: "Dr. Andrew Williams",
    email: "dr.andrewwilliams@mediconnect.com",
    speciality: "Orthopedic",
    image: "/assets/doc13.png",
    fees: 700
  },
  {
    name: "Dr. Patrick Harris",
    email: "dr.patrickharris@mediconnect.com",
    speciality: "Orthopedic",
    image: "/assets/doc14.png",
    fees: 750
  },
  {
    name: "Dr. Jeffrey King",
    email: "dr.jeffreyking@mediconnect.com",
    speciality: "Orthopedic",
    image: "/assets/doc15.png",
    fees: 720
  }
];

const run = async () => {
  try {
    console.log("⏳ Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("⚠️  Clearing existing static doctors...");
    await User.deleteMany({ role: "doctor" });

    console.log("📥 Inserting doctors...");
    for (let d of doctors) {
      await User.create({
        ...d,
        role: "doctor",
        status: "approved",
        passwordHash: "$2b$10$DummyPasswordForStaticDocs1234567890"
      });
      console.log("✅ Inserted:", d.name);
    }

    console.log("\n🎉 DONE — 15 doctors inserted successfully!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

run();

