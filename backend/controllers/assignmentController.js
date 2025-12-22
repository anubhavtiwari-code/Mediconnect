import User from "../models/User.js";

// Patient assigns (or removes) their primary doctor
export const assignDoctorToPatient = async (req, res) => {
  try {
    const patientId = req.user.id; // current user
    const { doctorId } = req.body; // can be null to unassign

    // confirm doctorId belongs to a doctor (if provided)
    if (doctorId) {
      const doc = await User.findById(doctorId);
      if (!doc || doc.role !== "doctor") return res.status(404).json({ message: "Doctor not found" });
    }

    // update patient assignedDoctor
    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // if previous assigned doctor exists, remove patient from that doctor's list
    if (patient.assignedDoctor) {
      await User.findByIdAndUpdate(patient.assignedDoctor, { $pull: { patientsAssigned: patientId } });
    }

    patient.assignedDoctor = doctorId || null;
    await patient.save();

    // add patient to doctor's patientsAssigned array (if doctorId given)
    if (doctorId) {
      await User.findByIdAndUpdate(doctorId, { $addToSet: { patientsAssigned: patientId } });
    }

    return res.json({ message: "Assigned updated", doctorId: patient.assignedDoctor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get patient's assigned doctor
export const getMyDoctor = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await User.findById(patientId).populate("assignedDoctor", "name email speciality image");
    return res.json({ doctor: patient.assignedDoctor || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Doctor: get list of patients assigned to current doctor
export const getDoctorPatients = async (req, res) => {
  try {
    if (req.user.role !== "doctor") return res.status(403).json({ message: "Only doctors allowed" });
    const doctorId = req.user.id;
    const doctor = await User.findById(doctorId).populate("patientsAssigned", "name email meta");
    return res.json({ patients: doctor.patientsAssigned || [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
