import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/client";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("patient");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Doctor fields
  const [hospitalName, setHospitalName] = useState("");
  const [degree, setDegree] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [experience, setExperience] = useState("");
  const [licenseFile, setLicenseFile] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (role === "doctor") {
      if (!hospitalName || !degree || !speciality || !experience || !licenseFile) {
        toast.error("All doctor fields are required");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);

      if (role === "doctor") {
        formData.append("hospitalName", hospitalName);
        formData.append("degree", degree);
        formData.append("speciality", speciality);
        formData.append("experience", experience);
        formData.append("licenseCertificate", licenseFile);
      }

      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(
        role === "doctor"
          ? "Registration successful! Awaiting admin approval."
          : "Account created successfully!"
      );

      navigate("/login");

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create an Account</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 mb-3 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-3 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="border p-2 mb-3 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        {/* Doctor Fields */}
        {role === "doctor" && (
          <>
            <input
              type="text"
              placeholder="Hospital Name"
              className="border p-2 mb-3 w-full"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Degree"
              className="border p-2 mb-3 w-full"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />

            <input
              type="text"
              placeholder="Speciality"
              className="border p-2 mb-3 w-full"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
            />

            <input
              type="text"
              placeholder="Experience (e.g., 5 years)"
              className="border p-2 mb-3 w-full"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />

            <input
              type="file"
              accept="application/pdf"
              className="border p-2 mb-3 w-full"
              onChange={(e) => setLicenseFile(e.target.files[0])}
            />
          </>
        )}

        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-3 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 mb-3 w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md w-full"
        >
          Register
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Login here
        </Link>
      </p>
    </div>
  );
}