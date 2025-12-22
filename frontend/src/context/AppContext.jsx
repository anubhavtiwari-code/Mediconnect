import { createContext, useEffect, useState } from "react";
import api from "../api/client";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const currencySymbol = "$";

  const loadDoctors = async () => {
    try {
      const res = await api.get("/doctors");

      // BECAUSE BACKEND RETURNS { doctors: [...] }
      const list = res.data.doctors || [];

      // Normalize the doctors so frontend never breaks
      const normalized = list.map((doc) => ({
        _id: doc._id,
        name: doc.name,
        email: doc.email || "",
        speciality: doc.speciality || "General Physician",
        image: doc.image || "/default-doctor.png",
        fees: doc.fees || 0,
        about: doc.about || "",
        degree: doc.degree || "",
      }));

      setDoctors(normalized);

      console.log("Loaded doctors:", normalized.length);

    } catch (err) {
      console.error("Failed to load doctors:", err.message);
      setDoctors([]);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  return (
    <AppContext.Provider value={{ doctors, currencySymbol }}>
      {children}
    </AppContext.Provider>
  );
};
