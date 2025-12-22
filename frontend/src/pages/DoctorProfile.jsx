// src/pages/DoctorProfile.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadDoctor = async () => {
    setLoading(true);
    try {
      // FIXED — Correct template literal
      const endpoint = id ? `/doctors/${id}` : `/doctors/me`;

      const res = await api.get(endpoint);

      // Normalizing doctor data
      const d = res.data?.doctor ?? res.data?.user ?? res.data;
      setDoctor(d || null);
    } catch (err) {
      console.error("Error loading doctor:", err);
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading doctor info...</div>;
  if (!doctor) return <div className="p-6 text-center">Doctor not found.</div>;

  // FIXED — Correct image
  const imageUrl =
    doctor.image
      ? doctor.image.startsWith("http")
        ? doctor.image
        : `http://localhost:5000${doctor.image}`
      : "/assets/doc_placeholder.png";

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex gap-6">
        <img
          src={imageUrl}
          alt={doctor.name || "Doctor"}
          className="w-40 h-40 rounded-xl object-cover border"
        />

        <div>
          <h1 className="text-3xl font-bold">Dr. {doctor.name}</h1>
          <p className="text-blue-600 text-lg">{doctor.speciality || "General Physician"}</p>

          <div className="mt-3 text-gray-700">
            <p><strong>Experience:</strong> {doctor.experience || "5+ years"}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Doctor ID:</strong> {doctor._id}</p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">About</h2>
        <p className="text-gray-700 leading-relaxed">
          {doctor.about?.trim()
            ? doctor.about
            : `Dr. ${doctor.name} is a highly skilled healthcare professional dedicated to providing excellent patient care.`}
        </p>
      </div>

      {/* Qualifications / Hospital */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-1">Qualifications</h3>
          <p className="text-gray-700 text-sm">
            {doctor.degree || "MBBS, MD — Certified Specialist"}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-1">Clinic / Hospital</h3>
          <p className="text-gray-700 text-sm">
            {doctor.hospital || "City Medical Hospital"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="text-gray-600">
          Last Updated:{" "}
          {doctor.updatedAt
            ? new Date(doctor.updatedAt).toLocaleDateString()
            : "--"}
        </p>
      </div>
    </motion.div>
  );
}
