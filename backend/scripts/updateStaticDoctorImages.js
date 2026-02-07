// backend/scripts/updateStaticDoctorImages.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "../models/User.js";

dotenv.config({ path: "./.env" });

// mapping names → image paths
const IMAGE_MAP = {
  "Dr. Richard James": "/assets/doc1.png",
  "Dr. Emily Larson": "/assets/doc2.png",
  "Dr. Sarah Patel": "/assets/doc3.png",
  "Dr. Christopher Lee": "/assets/doc4.png",
  "Dr. Jennifer Garcia": "/assets/doc5.png",
  "Dr. Andrew Williams": "/assets/doc6.png",
  "Dr. Christopher Davis": "/assets/doc7.png",
  "Dr. Timothy White": "/assets/doc8.png",
  "Dr. Ava Mitchell": "/assets/doc9.png",
  "Dr. Jeffrey King": "/assets/doc10.png",
  "Dr. Zoe Kelly": "/assets/doc11.png",
  "Dr. Patrick Harris": "/assets/doc12.png",
  "Dr. Chloe Evans": "/assets/doc13.png",
  "Dr. Ryan Martinez": "/assets/doc14.png",
  "Dr. Amelia Hill": "/assets/doc15.png",
};

async function run() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🔄 Updating doctor image paths...");

    for (const [name, img] of Object.entries(IMAGE_MAP)) {
      const doctor = await Doctor.findOne({ name });

      if (!doctor) {
        console.log(`⚠️ Not found: ${name}`);
        continue;
      }

      doctor.image = img;
      await doctor.save();

      console.log(`✅ Updated image for: ${name}`);
    }

    console.log("\n🎉 DONE — All static doctor images updated!");
    process.exit();
  } catch (err) {
    console.error("❌ ERROR:", err);
    process.exit(1);
  }
}

run();
