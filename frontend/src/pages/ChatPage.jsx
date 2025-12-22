// src/pages/ChatPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import ChatBox from "../components/ChatBox";
import { AuthContext } from "../context/AuthContext";

export default function ChatPage() {
  const { id } = useParams(); // this id is expected to be appointmentId
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherUserId, setOtherUserId] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Load current user's appointments and find this appointment
        // (backend has /api/appointments/my)
        const res = await api.get("/appointments/my");
        const list = res?.data?.appointments || [];
        const appt = list.find((a) => String(a._id) === String(id));
        if (!appt) {
          setAppointment(null);
          setLoading(false);
          return;
        }
        setAppointment(appt);

        // determine other user id
        const isDoctor = user?.role === "doctor";
        const otherId = isDoctor ? appt.patientId?._id : appt.doctorId?._id;
        setOtherUserId(otherId);

        // room id uses appointment-based namespace
        setRoomId(`appt_${appt._id}`);
      } catch (err) {
        console.error("Failed to load appointment for chat:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, user]);

  if (loading) return <div className="p-6">Loading chat...</div>;

  if (!appointment) {
    return (
      <div className="p-6">
        <p className="text-red-600">Chat not available — appointment not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-3 py-2 bg-gray-200 rounded"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!otherUserId || !roomId) {
    return (
      <div className="p-6">
        <p className="text-red-600">Couldn't determine chat counterpart. Try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Chat — {appointment.doctorId?.name && appointment.patientId?.name
          ? `${appointment.patientId?.name} ↔ ${appointment.doctorId?.name}`
          : "Appointment Chat"}
      </h2>

      <div className="bg-white p-4 rounded shadow">
        <ChatBox
          roomId={roomId}
          otherUserId={otherUserId}
          onClose={() => navigate(-1)}
        />
      </div>
    </div>
  );
}
