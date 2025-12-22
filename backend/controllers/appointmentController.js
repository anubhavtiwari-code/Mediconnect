// backend/controllers/appointmentController.js
import Appointment from "../models/Appointment.js";// optional use if you want to validate doctor
import User from "../models/User.js"; // optional

// Book an appointment
export const bookAppointment = async (req, res, next) => {
  try {
    const userId = req.user?.id; // set by auth middleware
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { doctorId, datetime, fee, notes } = req.body;
    if (!doctorId || !datetime) {
      return res.status(400).json({ message: "doctorId and datetime are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Optionally: check for conflicting appointments here
    const existing = await Appointment.findOne({
      doctor: doctorId,
      datetime: new Date(datetime),
      status: "booked"
    });
    if (existing) {
      return res.status(409).json({ message: "Slot already booked" });
    }

    const appointment = new Appointment({
      patient: userId,
      doctor: doctorId,
      datetime: new Date(datetime),
      fee: fee ?? doctor.fees ?? 0,
      notes: notes ?? ""
    });

    await appointment.save();

    // Optionally, push to doctor/patient docs
    return res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    console.error("bookAppointment:", err);
    return res.status(500).json({ message: "Server error booking appointment" });
  }
};

// Get appointments for logged-in patient
export const getMyAppointments = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const appointments = await Appointment.find({ patient: userId })
      .populate("doctor", "name speciality image fees")
      .sort({ datetime: -1 });

    return res.json({ appointments });
  } catch (err) {
    console.error("getMyAppointments:", err);
    return res.status(500).json({ message: "Server error fetching appointments" });
  }
};

// Cancel appointment (patient or admin)
export const cancelAppointment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // You can add role checks (patient owns appointment or admin)
    if (appointment.patient.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    return res.json({ message: "Appointment cancelled", appointment });
  } catch (err) {
    console.error("cancelAppointment:", err);
    return res.status(500).json({ message: "Server error cancelling appointment" });
  }
};
