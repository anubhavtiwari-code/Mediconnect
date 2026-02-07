// backend/scripts/fixDoctorImages.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import Doctor from "../models/User.js";

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
const run = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    const docs = await Doctor.find();
    console.log(`Found ${docs.length} doctors`);

    for (let doc of docs) {
      const correctImage = IMAGE_MAP[doc.name];
      if (correctImage) {
        doc.image = correctImage;
        await doc.save();
        console.log(`✅ Updated: ${doc.name}`);
      } else {
        console.log(`⚠️ No image mapping for: ${doc.name}`);
      }
    }

    console.log("\n🎉 DONE — All static doctor images fixed!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

run();
