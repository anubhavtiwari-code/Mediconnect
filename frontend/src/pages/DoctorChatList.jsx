// src/pages/DoctorChatList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function DoctorChatList() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
    try {
      const res = await api.get("/appointments/my");
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-gray-500 text-center">
        Loading chat sessions...
      </div>
    );

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Chat Sessions</h1>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        appointments.map((appt) => (
          <div
            key={appt._id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-medium">{appt.patientId?.name}</p>
              <p className="text-sm text-gray-500">{appt.patientId?.email}</p>

              <p className="text-sm mt-2">
                <strong>Date:</strong> {appt.date}
              </p>
              <p className="text-sm">
                <strong>Time:</strong> {appt.time}
              </p>
            </div>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => navigate(`/doctor/chat/${appt._id}`)}
            >
              Open Chat
            </button>
          </div>
        ))
      )}
    </div>
);
}