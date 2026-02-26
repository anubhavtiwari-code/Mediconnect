// src/pages/admin/ManageDoctors.jsx
import { useEffect, useState } from "react";
import api from "../api/client";
import Button from "../components/ui/Button";
import axios from "axios";
export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
const [showModal, setShowModal] = useState(false);
const token = localStorage.getItem("token");
  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/doctors?status=${filter}`);
      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const approve = async (id) => {
    await api.post("/admin/doctors/approve", { doctorId: id });
    load();
  };

  const reject = async (id) => {
    const reason = prompt("Reason for rejection (optional):");
    await api.post("/admin/doctors/reject", { doctorId: id, reason });
    load();
  };

  const removeDoctor = async (id) => {
    if (!confirm("Remove doctor permanently?")) return;
    await api.delete(`/admin/doctors/${id}`);
    load();
  };
  const viewDoctor = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/admin/doctors/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res.data.doctor);
    setSelectedDoctor(res.data.doctor); // store in state
    setShowModal(true);

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Doctors</h2>

      <div className="flex gap-3 mb-4">
        <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="border p-2">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="all">All</option>
        </select>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="space-y-3">
          {doctors.length===0 && <p>No doctors</p>}
          {doctors.map(d => (
            <div key={d._id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="text-sm text-gray-600">{d.email}</div>
                {d.bio && <div className="text-sm mt-1">{d.bio}</div>}
              </div>
           {/* 👇 ADD MODAL HERE */}
    {showModal && selectedDoctor && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded w-96">
          <h2 className="text-xl font-bold mb-2">
            {selectedDoctor.name}
          </h2>

          <p>Email: {selectedDoctor.email}</p>
          <p>Hospital: {selectedDoctor.hospitalName}</p>
          <p>Degree: {selectedDoctor.degree}</p>
          <p>Experience: {selectedDoctor.experience}</p>
          <p>Speciality: {selectedDoctor.speciality}</p>

          {selectedDoctor.image && (
            <img
              src={`http://localhost:5000/uploads/${selectedDoctor.image}`}
              className="mt-3 h-32"
            />
          )}

          <button
  onClick={async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `http://localhost:5000/api/admin/doctors/license/${selectedDoctor._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // VERY IMPORTANT
      }
    );

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  }}
  className="text-blue-500 block mt-2"
>
  View License PDF
</button>

          <button
            onClick={() => setShowModal(false)}
            className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
          >
            Close
          </button>
        </div>
      </div>
    )}
  

              <div className="flex gap-2">
                {d.status === "pending" && <Button onClick={()=>approve(d._id)}>Approve</Button>}
                {d.status === "pending" && <button className="px-3 py-1 border rounded" onClick={()=>reject(d._id)}>Reject</button>}
                <button className="px-3 py-1 text-red-600" onClick={()=>removeDoctor(d._id)}>Remove</button>
                <button
  onClick={() => viewDoctor(d._id)}
  className="bg-gray-600 text-white px-3 py-1 rounded"
>
  View
</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
