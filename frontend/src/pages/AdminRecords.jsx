// src/pages/admin/AdminRecords.jsx
import { useEffect, useState } from "react";
import api from "../api/client";

export default function AdminRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/records");
      setRecords(res.data.records || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const del = async (id) => {
    if (!confirm("Delete record?")) return;
    await api.delete(`/admin/records/${id}`);
    load();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Records</h2>
      {loading ? <p>Loading...</p> : (
        <ul className="space-y-3">
          {records.map(r => (
            <li key={r._id} className="border p-3 rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{r.originalName || r.filename}</div>
                <div className="text-sm text-gray-600">{new Date(r.createdAt).toLocaleString()}</div>
              </div>

              <div className="flex gap-3">
                <a href={`${r.fileUrl}`} target="_blank" rel="noreferrer" className="text-blue-600">View</a>
                <a href={`${r.fileUrl}`} download className="text-indigo-600">Download</a>
                <button className="text-red-600" onClick={()=>del(r._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
