import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ViewSummary() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`/api/visitsummary/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, [id, token]);

  if (!summary) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-bold">
        {summary.finalSummary ? "Final Summary" : "AI Draft"}
      </h2>

      <p className="text-sm text-gray-600">
        Doctor: {summary.doctor?.name} — Patient: {summary.patient?.name}
      </p>

      <div className="mt-4 whitespace-pre-wrap text-gray-800">
        {summary.finalSummary || summary.aiDraft}
      </div>
    </div>
  );
}
