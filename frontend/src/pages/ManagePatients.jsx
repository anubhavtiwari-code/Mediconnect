// src/pages/admin/ManagePatients.jsx
import { useEffect, useState } from "react";
import api from "../api/client";
import { toast } from "react-toastify";   // ✅ ADD THIS

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const p = await api.get("/admin/patients");
      const d = await api.get("/admin/doctors?status=approved");
      setPatients(p.data.patients || []);
      setDoctors(d.data.doctors || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const assign = async (patientId, doctorId) => {
    await api.post("/admin/patients/assign", { patientId, doctorId });
    load();
  };

  // ---------------------------------------------------------
  // ✅ ADD THIS → remove patient function
  // ---------------------------------------------------------
  const removePatient = async (id) => {
    if (!window.confirm("Are you sure you want to remove this patient?")) return;

    try {
      await api.delete(`/admin/patients/${id}`);
      toast.success("Patient removed successfully");
      load(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove patient");
    }
  };
  // ---------------------------------------------------------

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Patients</h2>

      {loading ? <p>Loading...</p> : (
        <div className="space-y-3">
          {patients.map(p => (
            <div key={p._id} className="p-3 border rounded flex justify-between items-center">
              
              {/* Left Section */}
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">{p.email}</div>
                <div className="text-sm mt-1">
                  Assigned: {p.assignedDoctor ? p.assignedDoctor : "None"}
                </div>
              </div>

              {/* Right Section */}
              <div className="flex gap-2 items-center">

                <select 
                  defaultValue={p.assignedDoctor || ""} 
                  onChange={(e)=>assign(p._id, e.target.value)} 
                  className="border p-2"
                >
                  <option value="">-- Assign doctor --</option>
                  {doctors.map(d => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.email})
                    </option>
                  ))}
                </select>

                {/* --------------------------------------------------------- */}
                {/* ✅ REMOVE BUTTON ADDED HERE */}
                {/* --------------------------------------------------------- */}
                <button
                  onClick={() => removePatient(p._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Remove
                </button>
                {/* --------------------------------------------------------- */}

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
