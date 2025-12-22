// src/pages/MyAppointments.jsx
import React, { useEffect, useState } from "react";
import api from "../api/client";
import { motion, AnimatePresence } from "framer-motion";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for summary popup
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [currentAppt, setCurrentAppt] = useState(null);
  const [summaryText, setSummaryText] = useState("");

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

  useEffect(() => {
    loadAppointments();
  }, []);

  /* ------------------------- MARK AS COMPLETED ------------------------- */
  const markCompleted = async (id) => {
    try {
      await api.put(`/appointments/complete/${id}`);
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: "done" } : a
        )
      );
    } catch (err) {
      console.error("Complete error:", err);
      alert("Failed to mark as completed.");
    }
  };

  /* --------------------------- ADD SUMMARY ---------------------------- */
  const openSummaryModal = (appointment) => {
    setCurrentAppt(appointment);
    setSummaryText(appointment.summary || "");
    setShowSummaryModal(true);
  };

  const saveSummary = async () => {
    try {
      await api.put(`/appointments/summary/${currentAppt._id}`, {
        summary: summaryText,
      });

      setAppointments((prev) =>
        prev.map((a) =>
          a._id === currentAppt._id ? { ...a, summary: summaryText } : a
        )
      );

      setShowSummaryModal(false);
      setSummaryText("");
    } catch (err) {
      console.error(err);
      alert("Failed to save summary.");
    }
  };

  if (loading) return <div className="p-6">Loading your appointments...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">My Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments yet.</p>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {appointments.map((appt) => (
              <motion.div
                key={appt._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white shadow rounded-xl p-4 border"
              >
                <div className="flex justify-between items-center">

                  {/* Doctor Details */}
                  <div className="flex gap-4 items-center">
                    <img
                      src={
                        appt.doctorId?.image
                          ? `http://localhost:5000${appt.doctorId.image}`
                          : "/assets/doc_placeholder.png"
                      }
                      alt=""
                      className="w-20 h-20 rounded object-cover"
                    />

                    <div>
                      <p className="text-lg font-medium">{appt.doctorId?.name}</p>
                      <p className="text-gray-600 text-sm">{appt.doctorId?.speciality}</p>
                      <p className="text-sm mt-1"><strong>Date:</strong> {appt.date}</p>
                      <p className="text-sm"><strong>Time:</strong> {appt.time}</p>
                      <p className="text-sm text-green-600 mt-1">₹{appt.fees}</p>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="text-right">
                    <p className={`font-semibold mb-2 ${
                      appt.status === "cancelled"
                        ? "text-red-600"
                        : appt.status === "done"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}>
                      {appt.status.toUpperCase()}
                    </p>

                    {/* Doctor Options */}
                    {appt.status === "booked" && appt.doctorId?._id === appt.doctorId?._id && (
                      <>
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                          onClick={() => markCompleted(appt._id)}
                        >
                          Mark Completed
                        </button>

                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                          onClick={() => openSummaryModal(appt)}
                        >
                          Add Summary
                        </button>
                      </>
                    )}

                    {/* Patient seeing the summary */}
                    {appt.summary && (
                      <p className="mt-3 text-sm text-gray-700 bg-gray-100 p-2 rounded">
                        <strong>Visit Summary:</strong><br />
                        {appt.summary}
                      </p>
                    )}
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* --------------------- SUMMARY MODAL --------------------- */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-96 p-6 rounded-xl shadow-lg">

            <h2 className="text-lg font-semibold">Visit Summary</h2>

            <textarea
              className="w-full border p-2 rounded mt-3"
              rows={5}
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowSummaryModal(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={saveSummary}
              >
                Save
              </button>
              <button
  className="bg-purple-600 text-white px-3 py-1 rounded"
  onClick={() => navigate(`/chat/${appt._id}`)}
>
  Chat
</button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
