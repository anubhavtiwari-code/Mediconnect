import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { AuthContext } from "../context/AuthContext";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const apptRes = await api.get("/appointments/my");
      const summaryRes = await api.get("/summaries/my");

      setAppointments(apptRes.data.appointments || []);
      setSummaries(summaryRes.data.summaries || []);
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  const upcoming = appointments.filter(a => a.status === "booked");
  const completed = appointments.filter(a => a.status === "done");

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 pb-24">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-2xl shadow-lg mt-5">
        <h2 className="text-2xl font-semibold">Hi {user?.name},</h2>
        <p className="text-sm opacity-90 mt-1">
          Stay on track with your appointments, reports & personalized care.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-sm text-gray-500">Upcoming Visits</div>
          <div className="text-2xl font-bold">{upcoming.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-sm text-gray-500">Completed Visits</div>
          <div className="text-2xl font-bold">{completed.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-sm text-gray-500">Reports Uploaded</div>
          <div className="text-2xl font-bold">{user?.reportsCount || 0}</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-sm text-gray-500">Primary Doctor</div>
          <div className="text-md font-semibold">
            {user?.primaryDoctor?.name || "Not assigned"}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/upload-report")}
          className="bg-blue-100 p-4 rounded-xl"
        >
          Upload Medical Report 📤
        </button>

        <button
          onClick={() => navigate("/my-reports")}
          className="bg-green-100 p-4 rounded-xl"
        >
          My Reports 📁
        </button>

        <button
          onClick={() => navigate("/my-summaries")}
          className="bg-orange-100 p-4 rounded-xl"
        >
          Visit Summaries 📄
        </button>

        <button
          onClick={() => navigate("/ai-chat")}
          className="bg-purple-100 p-4 rounded-xl"
        >
          Ask AI (Health Assistant) 🤖
        </button>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-3">Upcoming Appointments</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          upcoming.map((appt) => (
            <motion.div
              key={appt._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center mb-3"
            >
              <div>
                <div className="font-semibold">{appt.doctorId?.name}</div>
                <div className="text-xs text-gray-500">{appt.doctorId?.email}</div>
                <div className="text-sm mt-2">
                  Date: {appt.date} • Time: {appt.time}
                </div>
              </div>

              <button
                onClick={() => navigate(`/chat/${appt._id}`)}
                className="px-3 py-1 bg-indigo-600 text-white rounded"
              >
                Chat
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Recent Summaries */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-3">Recent Summaries</h2>
        {summaries.length === 0 ? (
          <p className="text-gray-500">No summaries yet.</p>
        ) : (
          summaries.slice(0, 3).map((s) => (
            <div key={s._id} className="bg-white p-4 rounded-xl shadow mb-2">
              <p className="text-gray-700 text-sm">{s.summary}</p>
            </div>
          ))
        )}
      </div>

      {/* Choose Doctor */}
      <button
        onClick={() => navigate("/doctors")}
        className="w-full bg-gray-100 p-4 rounded-xl mt-4"
      >
        Choose / Change Primary Doctor 👨‍⚕️
      </button>

      {/* Inspirational Bottom Banner */}
      <div className="bg-blue-50 p-6 rounded-2xl shadow-md text-center mt-10">
        <h3 className="text-xl font-semibold text-blue-700">
          Your Health Comes First 💙
        </h3>
        <p className="text-gray-600 mt-2 text-sm">
          We’re here to support you at every step of your medical journey.
        </p>
      </div>

    </div>
  );
}
