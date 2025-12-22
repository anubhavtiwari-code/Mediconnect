import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get("/appointments/my").then((res) => {
      setAppointments(res.data.appointments || []);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Appointments</h1>

      {appointments.map((appt) => (
        <div key={appt._id} className="p-4 border rounded mb-4 bg-white">
          <p><strong>Patient:</strong> {appt.patientId?.name}</p>
          <p><strong>Email:</strong> {appt.patientId?.email}</p>
          <p><strong>Date:</strong> {appt.date}</p>
          <p><strong>Time:</strong> {appt.time}</p>
        </div>
      ))}
    </div>
  );
}
