import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  appointmentId: String,
  sender: String,
  text: String,
  time: Date,
});

export default mongoose.model("Chat", chatSchema);

