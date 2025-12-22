// src/components/TopDoctors.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./TopDoctors.css";

export default function TopDoctors() {
  const [doctors, setDoctors] = useState([]);

  const fetchTopDocs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/doctors");
      const list = res.data.doctors || [];
      setDoctors(list.slice(0, 6)); // top 6
    } catch (err) {
      console.error("Top doctors loading error:", err);
    }
  };

  useEffect(() => {
    fetchTopDocs();
  }, []);

  return (
    <div className="top-doctors container">
      <h2 className="section-title">Top Doctors</h2>

      <div className="doctors-grid">
        {doctors.map((doc) => (
          <div className="doctor-card" key={doc._id}>
            <img
                    className="mc-doctor-img"
                    src={doc.image ? `http://localhost:5000${doc.image}` : "/assets/doc_placeholder.png"}
                    alt={doc.name || "Doctor"}
                    onError={(e) => { e.currentTarget.src = "/assets/doc_placeholder.png"; }}
                  />

            <h3 className="doctor-name">{doc.name}</h3>
            <p className="doctor-speciality">{doc.speciality}</p>

            <Link to={`/appointment/${doc._id}`} className="mc-doctor-btn">
                    Book Appointment
                  </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
