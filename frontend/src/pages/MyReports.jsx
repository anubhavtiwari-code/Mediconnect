import { useContext, useEffect, useState } from "react";
import api from "../api/client";
import { AuthContext } from "../context/AuthContext";

export default function MyReports() {
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const res = await api.get(`/records/user/${user._id}`);
        setRecords(res.data.records || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  return (
    <div className="p-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-5 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold">Hi {user?.name},</h2>
        <p className="text-sm opacity-90 mt-1">
          All your medical reports are safely stored here. View, download or manage them anytime.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-lg font-bold text-green-700">{records.length}</p>
          <p className="text-xs text-gray-600">Total Reports</p>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-lg font-bold text-purple-700">100%</p>
          <p className="text-xs text-gray-600">Secure Storage</p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-lg font-bold text-blue-700">Instant</p>
          <p className="text-xs text-gray-600">Download Access</p>
        </div>
      </div>


      {loading ? <p>Loading...</p> : (
        records.length === 0 ? <div className="text-center bg-gray-50 p-6 rounded-xl shadow-sm mt-6">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
            alt="No Reports"
            className="w-20 mx-auto opacity-80"
          />
          <h3 className="text-lg font-semibold mt-3 text-gray-700">No Reports Uploaded Yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            Upload your first medical report to get AI insights and easy sharing.
          </p>
          <a
            href="/upload-report"
            className="inline-block mt-4 px-5 py-2 rounded bg-blue-600 text-white text-sm"
          >
            Upload Report
          </a>
        </div>
        : (

          <ul className="space-y-3">
            {records.map(r => (
              <li key={r._id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{r.originalName || r.filename}</div>
                  <div className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-3 items-center">
                  <a href={r.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600">View</a>
                  <a href={r.fileUrl} download className="text-indigo-600">Download</a>
                </div>
              </li>
            ))}
          </ul>
        )
      )}

      {/* Bottom Banner */}
      <div className="mt-10 bg-gradient-to-r from-green-400 to-green-600 text-white p-5 rounded-xl text-center shadow-md">
        <h3 className="text-lg font-semibold">Organized. Secure. Accessible.</h3>
        <p className="text-sm mt-1 opacity-95">
          Every report you upload helps you track your health better and enables doctors to provide improved care.
        </p>
      </div>

    </div>


  );
}
