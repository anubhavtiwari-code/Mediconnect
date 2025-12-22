// src/pages/Doctors.jsx
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Doctors.css";

const cardVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

function SkeletonCard() {
  return (
    <div className="mc-doctor-card skeleton" aria-hidden>
      <div className="mc-doctor-img skeleton-rect" />
      <div className="mc-doctor-name skeleton-line" />
      <div className="mc-doctor-speciality skeleton-line short" />
      <div className="mc-doctor-fee skeleton-line short" />
    </div>
  );
}

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speciality, setSpeciality] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors");
      const list = res?.data?.doctors || [];
      setDoctors(list);
      setFilteredDoctors(list);
    } catch (err) {
      console.error("Error loading doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (speciality === "All") {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(
        doctors.filter(
          (d) => (d.speciality || "").toLowerCase() === speciality.toLowerCase()
        )
      );
    }
  }, [speciality, doctors]);

  useEffect(() => {
  const term = searchTerm.toLowerCase();

  setFilteredDoctors(
    doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(term) ||
        doc.speciality.toLowerCase().includes(term)
    )
  );
}, [searchTerm, doctors]);

  return (
    <div className="mc-doctors-wrapper">

      {/* Intro Banner */}
      <div className="mc-intro-banner">
        <h3 className="mc-intro-title">Find the Right Doctor for Your Health Needs</h3>
        <p className="mc-intro-text">
          Browse trusted and verified healthcare professionals across multiple specialities.
          Book appointments instantly with real-time availability.
        </p>
      </div>

      {/* 🔍 Search Bar */}
      <div className="mc-search-container">
        <input
          type="text"
          className="mc-search-input"
          placeholder="Search doctors by name or speciality..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* <div className="mc-filter-row">
        <label htmlFor="spec">Filter by speciality: </label>
        <select
          id="spec"
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
        >
          <option value="All">All Specialities</option>
          <option value="General physician">General Physician</option>
          <option value="Gynecologist">Gynecologist</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Pediatricians">Pediatricians</option>
          <option value="Neurologist">Neurologist</option>
          <option value="Gastroenterologist">Gastroenterologist</option>
        </select>
      </div> */}

      <div className="mc-doctors-grid">
        {loading ? (
          // show 8 skeletons while loading
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filteredDoctors.length === 0 ? (
          <p className="mc-empty">No doctors found.</p>
        ) : (
          <AnimatePresence>
            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mc-grid-inner"
            >
              {filteredDoctors.map((doc) => (
                <motion.div
                  layout
                  key={doc._id}
                  className="mc-doctor-card"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                >
                  <img
                    className="mc-doctor-img"
                    src={doc.image ? `http://localhost:5000${doc.image}` : "/assets/doc_placeholder.png"}
                    alt={doc.name || "Doctor"}
                    onError={(e) => { e.currentTarget.src = "/assets/doc_placeholder.png"; }}
                  />

                  <div className="mc-doctor-name">{doc.name}</div>
                  <div className="mc-doctor-speciality">{doc.speciality || "General Physician"}</div>
                  <div className="mc-doctor-fee">₹{doc.fees ?? "N/A"}</div>

                  <Link to={`/appointment/${doc._id}`} className="mc-doctor-btn">
                    Book Appointment
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Why Choose MediConnect Doctors Section */}
      <div className="mc-why-choose">
        <h2 className="mc-why-title">Why Choose Doctors on MediConnect?</h2>

        <ul className="mc-why-list">
        <li>✔️ Verified Medical Certificates</li>
        <li>✔️ Trusted by thousands of patients</li>
        <li>✔️ Easy online appointments</li>
        <li>✔️ Instant availability updates</li>
      </ul>
    </div>

    </div>
  );
}
