import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

import http from "http";
import { Server } from "socket.io";  // <-- CORRECT IMPORT

// ROUTES
import authRoutes from "./routes/auth.js";
import recordRoutes from "./routes/records.js";
import doctorRoutes from "./routes/doctor.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import aiRoutes from "./routes/ai.js";

import visitSummaryRoutes from "./routes/visitsummary.js";
import qrShareRoutes from "./routes/qrshare.js";
import adminRoutes from "./routes/admin.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import chatRoutes from "./routes/chat.js"; // <-- CHAT ROUTES

/* --------------------------------------------------------
   CREATE EXPRESS + HTTP SERVER
-------------------------------------------------------- */
const app = express();
const server = http.createServer(app);

/* --------------------------------------------------------
   SOCKET.IO SETUP
-------------------------------------------------------- */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Save io instance for use in routes
app.set("io", io);

// Track the sockets of users
const userSockets = new Map();

io.on("connection", (socket) => {
  console.log("🔥 Socket connected:", socket.id);

  // Attach the user to their sockets
  socket.on("join", ({ userId }) => {
    if (!userId) return;
    socket.data.userId = userId;

    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socket.id);
  });

  // Join chat room for appointment
  socket.on("join-room", (appointmentId) => {
    socket.join(appointmentId);
  });

  // Real-time chat message
  socket.on("send-message", (msg) => {
    io.to(msg.appointmentId).emit("receive-message", msg);
  });

  // Remove user from map on disconnect
  socket.on("disconnect", () => {
    const userId = socket.data.userId;

    if (userId && userSockets.has(userId)) {
      userSockets.get(userId).delete(socket.id);

      if (userSockets.get(userId).size === 0) {
        userSockets.delete(userId);
      }
    }
  });
});

/* --------------------------------------------------------
   MIDDLEWARE
-------------------------------------------------------- */
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Public static assets
app.use("/static", express.static("public/static"));
app.use("/assets", express.static("public/assets"));

/* --------------------------------------------------------
   ROUTES
-------------------------------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/visitsummary", visitSummaryRoutes);
app.use("/api/qrshare", qrShareRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/summaries", summaryRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", assignmentRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/appointments", appointmentRoutes);

// Chat routes (API)
app.use("/api/chat", chatRoutes);

/* --------------------------------------------------------
   HEALTH CHECK
-------------------------------------------------------- */
app.get("/", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

/* --------------------------------------------------------
   CONNECT MONGO + START SERVER
-------------------------------------------------------- */
const start = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("❌ MONGO_URI not set in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");

    const port = process.env.PORT || 5000;

    server.listen(port, () => {
      console.log(`🚀 Server running with Socket.io on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

start();
