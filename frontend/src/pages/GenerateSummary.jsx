import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function GenerateSummary() {
  const { token } = useContext(AuthContext);

  const [patientId, setPatientId] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!patientId || !doctorNotes) {
      toast.error("Patient ID and doctor notes required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "/api/visitsummary/generate",
        { patientId, doctorNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Summary generated successfully!");
    } catch (err) {
      toast.error("Failed to generate summary");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Generate Visit Summary</h2>

      <div className="grid gap-4">
        <input
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Patient ID"
          className="p-3 border rounded"
        />

        <textarea
          value={doctorNotes}
          onChange={(e) => setDoctorNotes(e.target.value)}
          placeholder="Doctor Notes"
          rows={4}
          className="p-3 border rounded"
        />

        <button
          disabled={loading}
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate Summary"}
        </button>
      </div>
    </div>
  );
}
