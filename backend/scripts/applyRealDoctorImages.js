import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "backend/.env" });

const Doctor = mongoose.model(
  "Doctor",
  new mongoose.Schema({ image: String, name: String })
);

const mapping = {
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
  "Dr. Amelia Hill": "/assets/doc15.png"
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected ✔");

  const docs = await Doctor.find();

  for (const d of docs) {
    const match = mapping[d.name];
    if (match) {
      await Doctor.updateOne({ _id: d._id }, { image: match });
      console.log(`Updated image for: ${d.name}`);
    }
  }

  console.log("DONE ✔✔ REAL IMAGES APPLIED");
  process.exit();
}

run();
