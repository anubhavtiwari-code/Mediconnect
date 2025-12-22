// src/components/DoctorSidebar.jsx
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function DoctorSidebar({ user: propUser, setUser: setPropUser }) {
  const ctx = useContext(AuthContext) || {};
  const { user: ctxUser, setUser: ctxSetUser } = ctx;

  const user = propUser || ctxUser || null;
  const setUser = setPropUser || ctxSetUser;

  const navigate = useNavigate();

  // ✅ FIXED profile image URL handling
  const profileImg =
    user?.image && typeof user.image === "string"
      ? user.image.startsWith("http")
        ? user.image
        : `http://localhost:5000${user.image}`
      : "/assets/doc_placeholder.png";

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (typeof setUser === "function") setUser(null);
    navigate("/login");
  };

  // ✅ FIXED NavLink class
  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 bg-white shadow-lg rounded-xl p-5 h-full space-y-4">
      {/* Header — Profile Image + Name */}
      <div className="text-center mb-4">
        <img
          src={profileImg}
          alt={user?.name || "Doctor"}
          className="w-20 h-20 rounded-full mx-auto object-cover border"
        />

        <h2 className="mt-3 font-semibold text-lg">
          {user?.name ? `${user.name}` : "Doctor"}
        </h2>

        <p className="text-gray-500 text-sm">
          {user?.speciality || "General Physician"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <NavLink to="/doctor-dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/doctor/appointments" className={linkClass}>
          My Appointments
        </NavLink>

        <NavLink to="/doctor/patients" className={linkClass}>
          My Patients
        </NavLink>

        <NavLink to="/doctor/chat-list" className={linkClass}>
          Chat
        </NavLink>

        <NavLink to="/doctor/earnings" className={linkClass}>
          Earnings
        </NavLink>

        <NavLink to="/doctor/profile" className={linkClass}>
          Profile
        </NavLink>
      </nav>

      {/* Settings + Logout */}
      <div className="mt-4 pt-4 border-t">
        <button
          onClick={() => navigate("/doctor/settings")}
          className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
        >
          Settings
        </button>

        <button
          onClick={handleLogout}
          className="mt-2 w-full bg-red-600 text-white px-3 py-2 rounded-md text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
