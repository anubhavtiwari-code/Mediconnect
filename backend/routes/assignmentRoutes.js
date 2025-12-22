import express from "express";
import { authenticate } from "../middleware/auth.js";
import { assignDoctorToPatient, getMyDoctor, getDoctorPatients } from "../controllers/assignmentController.js";

const router = express.Router();

// patient assigns/unassigns doctor
router.post("/patient/assign-doctor", authenticate, assignDoctorToPatient);
router.get("/patient/my-doctor", authenticate, getMyDoctor);

// doctor gets their patients
router.get("/doctor/my-patients", authenticate, getDoctorPatients);

export default router;
