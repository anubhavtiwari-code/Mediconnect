// src/pages/Appointment.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { AppContext } from "../context/AppContext";
import { AuthContext } from "../context/AuthContext";

export default function Appointment() {
  const { docId } = useParams();
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);
  const { user } = useContext(AuthContext);

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [error, setError] = useState("");

  const availableSlots = [
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  // Load doctor (context first, then API)
  useEffect(() => {
    const found = doctors.find((d) => String(d._id) === String(docId));

    if (found) {
      setDoctor(found);
      setLoading(false);
    } else {
      const load = async () => {
        try {
          const res = await api.get(`/doctors/${docId}`);
          setDoctor(res.data.doctor);
        } catch (err) {
          console.error("Failed to load doctor:", err);
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [docId, doctors]);

  // BOOK APPOINTMENT
  const handleBooking = async () => {
    setError("");

    if (!user) {
      alert("Please login first to book an appointment.");
      navigate("/login");
      return;
    }

    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (!slot) {
      setError("Please select a time slot.");
      return;
    }

    try {
      const res = await api.post("/appointments", {
        doctorId: doctor._id,
        date,
        time: slot,
        fees: doctor.fees,
      });

      alert("Appointment booked successfully!");
      navigate("/my-appointments");

    } catch (err) {
      console.error("Booking failed:", err);
      setError("Failed to book appointment.");
    }
  };

  if (loading) return <div className="p-6">Loading doctor...</div>;
  if (!doctor) return <div className="p-6">Doctor not found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-10 mb-10">
        <img
          src={doctor.image ? `http://localhost:5000${doctor.image}` : "/assets/doc_placeholder.png"}
          onError={(e) => (e.target.src = "/assets/doc_placeholder.png")}
          className="w-full sm:w-80 rounded shadow"
        />

        <div>
          <h1 className="text-3xl font-bold">{doctor.name}</h1>
          <p className="text-gray-600 mt-1">{doctor.speciality}</p>
          <p className="mt-4 text-gray-700">{doctor.about || "No description available."}</p>

          <p className="mt-6 text-lg font-medium text-green-600">
            Consultation Fee: ₹{doctor.fees}
          </p>
        </div>
      </div>

      {/* Appointment Booking */}
      <div className="bg-white shadow p-6 rounded-xl border">

        <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          {/* Date */}
          <div>
            <p className="font-medium mb-2">Select date</p>
            <input
              type="date"
              className="border p-3 rounded w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Slot */}
          <div>
            <p className="font-medium mb-2">Available slots</p>
            <select
              className="border p-3 rounded w-full"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
            >
              <option value="">Choose a slot</option>
              {availableSlots.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Book */}
          <div className="flex items-end">
            <button
              onClick={handleBooking}
              className="bg-green-600 w-full text-white px-4 py-3 rounded hover:bg-green-700 transition"
            >
              Pay & Book ₹{doctor.fees}
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
}


