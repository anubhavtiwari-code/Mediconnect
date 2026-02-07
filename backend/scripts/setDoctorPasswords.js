// backend/scripts/setDoctorPasswords.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const MONGO_URL =  "mongodb+srv://anubhavtiwari4150_db_user:sSQvAn2lXHhL9NuE@mediconnectdb.fqaqqlv.mongodb.net/?appName=MEDICONNECT"  ; // paste your URL

async function run() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");

  const newPassword = "doctor123";
  const hash = await bcrypt.hash(newPassword, 10);

  const result = await User.updateMany(
    { role: "doctor" },
    { passwordHash: hash }
  );

  console.log("Updated doctors:", result.modifiedCount);
  console.log("New doctor password: doctor123");

  mongoose.disconnect();
}

run();
