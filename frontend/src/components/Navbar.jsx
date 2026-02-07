import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);

  // Dynamic profile image
  const profileImage = user?.image
    ? `http://localhost:5000${user.image}` // Use user's uploaded image
    : user?.role === "admin"
      ? assets.admin_profile_pic // default admin pic
      : user?.role === "doctor"
        ? assets.doctor_profile_pic // default doctor pic
        : assets.patient_profile_pic; // default patient pic

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-300 bg-white shadow-sm"
    >
      {/* LOGO */}
      <motion.img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="logo"
        whileHover={{ scale: 1.03 }}
      />

      {/* DESKTOP MENU */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/"><li className="py-1 hover:text-blue-600">HOME</li></NavLink>
        <NavLink to="/doctors"><li className="py-1 hover:text-blue-600">ALL DOCTORS</li></NavLink>
        <NavLink to="/about"><li className="py-1 hover:text-blue-600">ABOUT</li></NavLink>
        <NavLink to="/contact"><li className="py-1 hover:text-blue-600">CONTACT</li></NavLink>

        {user?.role === "patient" && (
          <>
            <NavLink to="/patient-dashboard"><li className="py-1">DASHBOARD</li></NavLink>
            <NavLink to="/my-reports"><li className="py-1">MY REPORTS</li></NavLink>
            <NavLink to="/ai-chat"><li className="py-1">AI ASSISTANT</li></NavLink>
          </>
        )}

        {user?.role === "doctor" && (
          <>
            <NavLink to="/doctor-dashboard"><li className="py-1">DASHBOARD</li></NavLink>
            <NavLink to="/my-patients"><li className="py-1">MY PATIENTS</li></NavLink>
          </>
        )}

        {user?.role === "admin" && (
          <NavLink to="/admin-dashboard"><li className="py-1">ADMIN</li></NavLink>
        )}
      </ul>

      {/* RIGHT SIDE / PROFILE */}
      <div className="flex items-center gap-4">
        {!user ? (
          <motion.button
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 text-white px-7 py-2 rounded-full font-medium hidden md:block"
          >
            Create Account
          </motion.button>
        ) : (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={profileImage}
              alt={user?.name || "Profile"}
            />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />

            {/* DROPDOWN */}
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-700 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-white rounded shadow-md flex flex-col gap-2 p-4">
                <span className="font-semibold">{user?.name}</span>
                {user?.role === "doctor" && (
                  <span className="text-gray-500 text-sm">{user?.speciality}</span>
                )}
                {user?.role === "patient" && (
                  <span className="text-gray-500 text-sm">Patient</span>
                )}

                {user.role === "patient" && (
                  <>
                    <p onClick={() => navigate("/my-profile")} className="hover:text-black cursor-pointer">My Profile</p>
                    <p onClick={() => navigate("/my-appointments")} className="hover:text-black cursor-pointer">My Appointments</p>
                    <p onClick={() => navigate("/upload-report")} className="hover:text-black cursor-pointer">Upload Report</p>
                  </>
                )}

                {user.role === "doctor" && (
                  <>
                    <p onClick={() => navigate("/doctor-dashboard")} className="hover:text-black cursor-pointer">Doctor Dashboard</p>
                    <p onClick={() => navigate("/my-patients")} className="hover:text-black cursor-pointer">My Patients</p>
                  </>
                )}

                {user.role === "admin" && (
                  <p onClick={() => navigate("/admin-dashboard")} className="hover:text-black cursor-pointer">Admin Panel</p>
                )}

                <p onClick={logout} className="hover:text-black cursor-pointer text-red-600">Logout</p>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE MENU ICON */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />

        {/* MOBILE MENU */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-30 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img className="w-7" onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>

          {user && (
            <div className="flex items-center gap-2 px-5 py-3 border-b">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={profileImage}
                alt={user?.name || "Profile"}
              />
              <div>
                <p className="font-semibold">{user?.name}</p>
                {user?.role === "doctor" && <p className="text-gray-500 text-sm">{user.speciality}</p>}
                {user?.role === "patient" && <p className="text-gray-500 text-sm">Patient</p>}
              </div>
            </div>
          )}

          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/"><p className="px-4 py-2">HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors"><p className="px-4 py-2">ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about"><p className="px-4 py-2">ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact"><p className="px-4 py-2">CONTACT</p></NavLink>

            {user?.role === "patient" && (
              <>
                <NavLink onClick={() => setShowMenu(false)} to="/patient-dashboard"><p className="px-4 py-2">Dashboard</p></NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/my-reports"><p className="px-4 py-2">My Reports</p></NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/ai-chat"><p className="px-4 py-2">AI Assistant</p></NavLink>
              </>
            )}

            {user?.role === "doctor" && (
              <>
                <NavLink onClick={() => setShowMenu(false)} to="/doctor-dashboard"><p className="px-4 py-2">Doctor Dashboard</p></NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/my-patients"><p className="px-4 py-2">My Patients</p></NavLink>
              </>
            )}

            {user?.role === "admin" && (
              <NavLink onClick={() => setShowMenu(false)} to="/admin-dashboard"><p className="px-4 py-2">Admin Panel</p></NavLink>
            )}

            {user && (
              <p onClick={() => { logout(); setShowMenu(false); }} className="px-4 py-2 text-red-600">Logout</p>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
