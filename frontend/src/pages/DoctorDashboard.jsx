// src/pages/DoctorDashboardPage.jsx
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import QRModal from "../components/QRModal";
import { AuthContext } from "../context/AuthContext";
import DoctorLayout from "../layouts/DoctorLayout";


export default function DoctorDashboardPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState(null);
  /* ---------------- LOAD APPOINTMENTS ---------------- */
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const res = await api.get("/appointments/my");
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error("Error loading appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- MARK APPOINTMENT DONE ---------------- */
  const markComplete = async (id) => {
    try {
      await api.put(`/appointments/complete/${id}`);
      loadAppointments();
    } catch (err) {
      console.error(err);
      alert("Failed to mark as completed.");
    }
  };

  /* ---------------- GENERATE QR TOKEN ---------------- */
  const generateQR = async (id) => {
  try {
    const res = await api.post(`/appointments/generate-qr/${id}`);
    setQrUrl(res.data.qrUrl);
  } catch (err) {
    console.error(err);
    alert("Failed to generate QR.");
  }
};


  /* ---------------- CALCULATED VALUES ---------------- */
  const totalPatients = new Set(appointments.map((a) => a.patientId?._id)).size;
  const completedCount = appointments.filter((a) => a.status === "done").length;
  const earnings = appointments
    .filter((a) => a.status === "done")
    .reduce((sum, a) => sum + (a.fees || 0), 0);

  return (
    <DoctorLayout>
      <div className="space-y-6 p-4">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-2xl font-semibold">
            Welcome back, {user?.name} 👨‍⚕
          </h2>
          <p className="text-sm opacity-90 mt-1">
            Manage your appointments, track earnings, and stay connected with your patients.
          </p>
        </div>
        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="text-sm text-gray-500">Patients Treated</div>
            <div className="text-2xl font-bold">{totalPatients}</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="text-sm text-gray-500">Completed Visits</div>
            <div className="text-2xl font-bold">{completedCount}</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="text-sm text-gray-500">Earnings</div>
            <div className="text-2xl font-bold">₹{earnings}</div>
          </div>
        </div>

        {/* MAIN SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: APPOINTMENT LIST */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>

            {loading ? (
              <div className="p-6 bg-white rounded-lg shadow text-center">
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-6 bg-white rounded-lg shadow text-center">
                No upcoming appointments
              </div>
            ) : (
             appointments
  .filter((a) => a.status === "booked")     // <-- Show only upcoming
  .map((appt) => (

                <motion.div
                  key={appt._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-xl shadow border flex justify-between items-center"
                >
                  {/* Patient Info */}
                  <div>
                    <div className="font-semibold">{appt.patientId?.name}</div>
                    <div className="text-xs text-gray-500">
                      {appt.patientId?.email}
                    </div>
                    <div className="mt-2 text-sm">
                      <strong>Date:</strong> {appt.date} •{" "}
                      <strong>Time:</strong> {appt.time}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        appt.status === "done"
                          ? "text-green-600"
                          : appt.status === "cancelled"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {appt.status.toUpperCase()}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/doctor/chat/${appt._id}`)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded"
                      >
                        Chat
                      </button>

                      <button
                        onClick={() => generateQR(appt._id)}
                        className="px-3 py-1 bg-purple-600 text-white rounded"
                      >
                        QR
                      </button>
                     {qrUrl && <QRModal url={qrUrl} onClose={() => setQrUrl(null)} />}

                      <button
                        onClick={() => markComplete(appt._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* RIGHT SIDE QUICK ACTION PANEL */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-semibold mb-2">Today</h3>
              <p className="text-sm text-gray-600">
                Total Appointments: {appointments.length}
              </p>
              <p className="text-sm text-gray-600">
                Pending:{" "}
                {appointments.filter((a) => a.status === "booked").length}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="font-semibold mb-2">Quick Actions</h3>

              <div className="flex flex-col gap-2">
                <button
                  className="px-3 py-2 bg-blue-600 text-white rounded"
                  onClick={() => navigate("/doctor/appointments")}
                >
                  My Appointments
                </button>

                <button
                  className="px-3 py-2 bg-indigo-600 text-white rounded"
                  onClick={() => navigate("/doctor/patients")}
                >
                  My Patients
                </button>

                <button
                  className="px-3 py-2 bg-green-600 text-white rounded"
                  onClick={() => navigate("/doctor/earnings")}
                >
                  Earnings
                </button>

                <button
                  className="px-3 py-2 bg-gray-200 rounded"
                  onClick={() => navigate("/doctor/settings")}
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Doctor Motivation Footer */}
      <div className="mt-10 p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold">Your Care Makes a Difference 💙</h3>
        <p className="text-sm mt-1">
          Every consultation helps someone feel healthier, happier, and hopeful.
        </p>
      </div>
    </DoctorLayout>
  );
}
