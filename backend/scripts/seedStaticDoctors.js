import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve("C:/Users/ANUBHAV/Downloads/Mediconnect/backend/.env"),
});

import mongoose from "mongoose";
import User from "../models/User.js";

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

export const STATIC_DATA = [
  {
    name: "Dr. Richard James",
    email: "dr.richardjames@mediconnect.com",
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
    fees: 50,
    image: "/uploads/doc1.png"
  },
  {
    name: "Dr. Emily Larson",
    email: "dr.emilylarson@mediconnect.com",
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dedicated gynecologist providing expert women's health care, preventive care, and reproductive health guidance.",
    fees: 60,
    image: "/uploads/doc2.png"
  },
  {
    name: "Dr. Sarah Patel",
    email: "dr.sarahpatel@mediconnect.com",
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Year",
    about:
      "Specializes in skin treatments, acne management, and cosmetic dermatology with a focus on patient confidence.",
    fees: 30,
    image: "/uploads/doc3.png"
  },
  {
    name: "Dr. Christopher Lee",
    email: "dr.christopherlee@mediconnect.com",
    speciality: "Pediatricians",
    degree: "MBBS",
    experience: "2 Years",
    about:
      "Passionate pediatrician specializing in child wellness, vaccinations, and growth development.",
    fees: 40,
    image: "/uploads/doc4.png"
  },
  {
    name: "Dr. Jennifer Garcia",
    email: "dr.jennifergarcia@mediconnect.com",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Expert neurologist focusing on brain, nerve, and spinal disorders with patient-first care.",
    fees: 50,
    image: "/uploads/doc5.png"
  },
  {
    name: "Dr. Andrew Williams",
    email: "dr.andrewwilliams@mediconnect.com",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Committed to neurological health, advanced diagnostics, and long-term patient support.",
    fees: 50,
    image: "/uploads/doc6.png"
  },
  {
    name: "Dr. Christopher Davis",
    email: "dr.christopherdavis@mediconnect.com",
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Strong commitment to preventive healthcare, accurate diagnosis, and effective treatments.",
    fees: 50,
    image: "/uploads/doc7.png"
  },
  {
    name: "Dr. Timothy White",
    email: "dr.timothywhite@mediconnect.com",
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Focused on reproductive health, pregnancy care, and women's wellness.",
    fees: 60,
    image: "/uploads/doc8.png"
  },
  {
    name: "Dr. Ava Mitchell",
    email: "dr.avamitchell@mediconnect.com",
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Year",
    about:
      "Provides expert skincare treatment, dermatological diagnosis, and cosmetic procedures.",
    fees: 30,
    image: "/uploads/doc9.png"
  },
  {
    name: "Dr. Jeffrey King",
    email: "dr.jeffreyking@mediconnect.com",
    speciality: "Pediatricians",
    degree: "MBBS",
    experience: "2 Years",
    about:
      "Ensures child health with compassion, preventive care, and safe medical guidance.",
    fees: 40,
    image: "/uploads/doc10.png"
  },
  {
    name: "Dr. Zoe Kelly",
    email: "dr.zoekelly@mediconnect.com",
    speciality: "Gastroenterologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Expert in stomach, liver, and intestinal disorders with patient-focused care.",
    fees: 50,
    image: "/uploads/doc11.png"
  },
  {
    name: "Dr. Patrick Harris",
    email: "dr.patrickharris@mediconnect.com",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about: "Provides neurological treatment with modern diagnostic methods.",
    fees: 50,
    image: "/uploads/doc12.png"
  },
  {
    name: "Dr. Chloe Evans",
    email: "dr.chloeevans@mediconnect.com",
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Focused on preventive medicine, daily health issues, diagnosis, and patient care.",
    fees: 50,
    image: "/uploads/doc13.png"
  },
  {
    name: "Dr. Ryan Martinez",
    email: "dr.ryanmartinez@mediconnect.com",
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dedicated to women's reproductive health, maternity care, and preventive gynecology.",
    fees: 60,
    image: "/uploads/doc14.png"
  },
  {
    name: "Dr. Amelia Hill",
    email: "dr.ameliahill@mediconnect.com",
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Year",
    about:
      "Skin specialist offering cosmetic and clinical treatment with patient-friendly guidance.",
    fees: 30,
    image: "/uploads/doc15.png"
  }
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 Connected to DB");

    for (let doc of STATIC_DATA) {
      const updated = await User.findOneAndUpdate(
        { email: doc.email },
        doc,
        { new: true, upsert: true }
      );

      console.log(`✔ Updated/Inserted: ${updated.name}`);
    }

    process.exit();
  } catch (err) {
    console.log("❌ Error:", err);
    process.exit();
  }
};

run();