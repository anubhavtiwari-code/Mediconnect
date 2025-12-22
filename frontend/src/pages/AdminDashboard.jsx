import { useEffect, useState } from "react";
import api from "../api/client";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0, totalDoctors: 0, pendingDoctors: 0, totalRecords: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <motion.h1 initial={{y:-6,opacity:0}} animate={{y:0,opacity:1}} className="text-2xl font-bold mb-4">Admin Dashboard</motion.h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{y:10,opacity:0}} whileInView={{y:0,opacity:1}} className="bg-blue-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Patients</h2>
          <p className="text-3xl">{stats.totalPatients}</p>
        </motion.div>

        <motion.div initial={{y:10,opacity:0}} whileInView={{y:0,opacity:1}} className="bg-green-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Doctors</h2>
          <p className="text-3xl">{stats.totalDoctors}</p>
        </motion.div>

        <motion.div initial={{y:10,opacity:0}} whileInView={{y:0,opacity:1}} className="bg-yellow-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Pending</h2>
          <p className="text-3xl">{stats.pendingDoctors}</p>
        </motion.div>

        <motion.div initial={{y:10,opacity:0}} whileInView={{y:0,opacity:1}} className="bg-purple-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Total Records</h2>
          <p className="text-3xl">{stats.totalRecords}</p>
        </motion.div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <button onClick={() => navigate("/admin/manage-doctors")} className="bg-blue-600 text-white p-4 rounded-lg text-lg">Manage Doctors</button>
        <button onClick={() => navigate("/admin/manage-patients")} className="bg-green-600 text-white p-4 rounded-lg text-lg">Manage Patients</button>
        <button onClick={() => navigate("/admin/records")} className="bg-purple-600 text-white p-4 rounded-lg text-lg">All Records</button>
        <button onClick={() => navigate("/admin/activity")} className="bg-gray-700 text-white p-4 rounded-lg text-lg">Activity Log</button>
      </div>
    </div>
  );
}
