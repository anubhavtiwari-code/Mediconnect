import express from "express";
import { generateSummary, mySummaries, getSummary } from "../controllers/summaryController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", authenticate, generateSummary);
router.get("/my", authenticate, mySummaries);
router.get("/:id", authenticate, getSummary);

export default router;
