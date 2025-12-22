import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

export default function ViewSharedRecord() {
  const { token } = useParams();
  const [record, setRecord] = useState(null);
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/qrshare/view/${token}`);
        setRecord(res.data.record);
        setMsg(null);
      } catch (err) {
        setMsg("Link expired or invalid.");
      }
    };
    load();
  }, []);

  if (msg)
    return (
      <div className="max-w-2xl mx-auto py-10 text-center">
        <h3 className="text-xl text-gray-600">{msg}</h3>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Shared Medical Record</h2>

      <div className="bg-white p-5 rounded-xl shadow">
        <p><strong>Filename:</strong> {record.filename}</p>
        <p><strong>Notes:</strong> {record.notes || "No notes"}</p>
        <p><strong>Uploaded:</strong> {new Date(record.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
