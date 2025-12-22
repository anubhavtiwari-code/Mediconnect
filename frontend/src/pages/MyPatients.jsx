// src/pages/MyPatients.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import DoctorLayout from "../layouts/DoctorLayout";

export default function MyPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const res = await api.get("/doctors/mypatients"); // ✅ FIXED URL
      setPatients(res.data.patients || []);
    } catch (err) {
      console.error("Failed to load patients:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6">My Patients</h2>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          {loading && <p>Loading patients...</p>}

          {!loading && patients.length === 0 && (
            <p className="text-gray-500">No patients assigned yet.</p>
          )}

          {patients.map((p) => (
            <div
              key={p._id}
              className="flex justify-between items-center border p-4 rounded-xl bg-gray-50"
            >
              {/* Patient Info */}
              <div className="flex gap-4 items-center">
                <img
                  src="/assets/user_placeholder.png"
                  alt="patient"
                  className="w-12 h-12 rounded-full border"
                />

                <div>
                  <div className="font-semibold text-lg">{p.name}</div>
                  <div className="text-gray-600 text-sm">{p.email}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link
                  to={`/patient-records/${p._id}`}
                  className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
                >
                  View Records
                </Link>

                <Link
                  to={`/doctor/chat/${p._id}`}
                  className="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
                >
                  Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
}
