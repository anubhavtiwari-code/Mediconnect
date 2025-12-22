import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function MySummaries() {
  const { token } = useContext(AuthContext);
  const [list, setList] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/visitsummary/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const arr = Array.isArray(res.data) ? res.data : [];
        setList(arr);
      } catch (err) {
        console.log(err);
        setList([]);
      }
    };

    load();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow mt-6">

      {/* Summary Header Section */}
      <h2 className="text-2xl font-bold text-blue-700">Visit Summary</h2>
      <p className="text-gray-600 mt-1">
        A detailed summary generated for your recent medical consultation.
      </p>

      {list.length === 0 && (
        <div className="text-gray-600">No summaries available.</div>
      )}

      <div className="grid gap-4">
        {list.map((s) => (
          <div
            key={s._id}
            className="p-4 bg-white border rounded flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold">
                {s.finalSummary ? "Final Summary" : "AI Draft"}
              </h3>

              <p className="text-sm text-gray-600">
                {new Date(s.createdAt).toLocaleString()}
              </p>

              <p className="mt-3 p-3 bg-gray-50 border rounded text-sm text-gray-700 line-clamp-4 shadow-sm">
                {s.finalSummary || s.aiDraft}
              </p>
            </div>

            <Link
              to={`/summaries/${s._id}`}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
            >
              View
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded bg-yellow-50 border-l-4 border-yellow-600">
        <h4 className="text-md font-semibold text-yellow-700">💡 Health Reminder</h4>
        <p className="text-gray-700 text-sm mt-1">
          Keep track of your medical records regularly.  
          Staying informed helps you make better health decisions.
        </p>
      </div>

      <div className="mt-6 border-t border-gray-300"></div>
      <div className="mt-10 p-5 bg-blue-600 text-white text-center rounded-lg shadow">
        <h3 className="text-lg font-semibold">Your Health Matters 💙</h3>
        <p className="text-sm mt-1">
          MediConnect is here to ensure you always have quick and secure access  
          to your medical information—anytime, anywhere.
        </p>
      </div>


    </div>

  );
}
