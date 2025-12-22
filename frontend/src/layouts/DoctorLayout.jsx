// src/layouts/DoctorLayout.jsx
import { useEffect, useState } from "react";
import api from "../api/client";
import DoctorSidebar from "../components/DoctorSidebar";

export default function DoctorLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // call the /api/doctors/me route (we updated backend to return { user })
        const res = await api.get("/doctors/me");
        if (mounted) setUser(res.data.user || null);
      } catch (err) {
        console.warn("Failed to fetch profile", err);
        if (mounted) setUser(null);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  return (
    <div className="flex gap-6 p-6 max-w-7xl mx-auto">
      {/* pass user prop so sidebar shows the fetched doctor (do not rely only on AuthContext) */}
      <DoctorSidebar user={user} setUser={setUser} />
      <main className="flex-1">{children}</main>
   </div>
  );
}