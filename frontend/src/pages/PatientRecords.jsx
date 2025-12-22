import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";

export default function PatientRecords() {
  const { id } = useParams();
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const res = await api.get(`/records/user/${id}`);
      setRecords(res.data.records || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load patient records");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Patient Medical Records</h2>

      {records.length === 0 && (
        <p className="text-gray-500">No medical reports uploaded yet.</p>
      )}

      <div className="space-y-4">
        {records.map((r) => (
          <div key={r._id} className="p-4 border rounded bg-white shadow">
            <strong>{r.originalName}</strong>
            <p className="text-sm">Notes: {r.notes || "None"}</p>
            <p className="text-xs text-gray-600">
              Uploaded: {new Date(r.createdAt).toLocaleString()}
            </p>

            <a
              href={r.fileUrl}
              target="_blank"
              className="text-blue-600 underline text-sm mt-2 inline-block"
            >
              View File
            </a>
          </div>
        ))}
      </div>

      <Link
        to={`/generate-summary/${id}`}
        className="inline-block mt-6 bg-green-600 text-white px-5 py-2 rounded"
      >
        Generate AI Visit Summary
      </Link>
    </div>
  );
}
