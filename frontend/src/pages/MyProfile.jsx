import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import api from "../api/client";
import { AuthContext } from "../context/AuthContext";

export default function MyProfile() {
    const { user, setUser } = useContext(AuthContext);


    const [form, setForm] = useState({
        name: "",
        age: "",
        gender: "",
        phone: "",
        address: "",
    });

    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(
        user?.image ? `http://localhost:5000${user.image}` : "/default-user.png"
    );

    // Load user data on mount
    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                age: user.age || "",
                gender: user.gender || "",
                phone: user.phone || "",
                address: user.address || "",
            });
            setPreview(user.user_pic ? `http://localhost:5000${user.user_pic}` : "");
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const saveProfile = async () => {
        try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => formData.append(key, form[key]));
            if (profileImage) formData.append("image", profileImage);

            const res = await api.put("/auth/update-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            alert("Profile updated successfully!");
            setUser(res.data.user);
            setPreview(res.data.user.image ? `http://localhost:5000${res.data.user.image}` : "");

        } catch (err) {
            console.error("Update failed:", err.response || err);
            alert("Update failed. Please try again.");
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6">

            {/* Page Heading */}
            <h1 className="text-3xl font-bold mb-4">My Profile</h1>
            <p className="text-gray-600 mb-6">
                Manage your personal details to help us personalize your healthcare experience.
            </p>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-md rounded-xl overflow-hidden border"
            >

                {/* Profile Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white">
                    <div className="flex items-center gap-6">
                        <img
                            src={preview || "/default-user.png"}
                            alt="profile"
                            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <div>
                            <h2 className="text-2xl font-semibold">{form.name || "Your Name"}</h2>
                            <p className="text-sm opacity-90">Patient</p>

                            <label className="inline-block mt-3 bg-white text-blue-600 px-4 py-1.5 rounded cursor-pointer font-medium shadow">
                                Change Photo
                                <input type="file" className="hidden" onChange={handleImage} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div>
                        <label className="text-gray-700 text-sm font-medium">Full Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="text-gray-700 text-sm font-medium">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md p-2"
                        />
                    </div>

                    <div>
                        <label className="text-gray-700 text-sm font-medium">Gender</label>
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md p-2"
                        >
                            <option value="">Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-gray-700 text-sm font-medium">Phone Number</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md p-2"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="text-gray-700 text-sm font-medium">Address</label>
                        <textarea
                            name="address"
                            rows={3}
                            value={form.address}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md p-2"
                        ></textarea>
                    </div>

                </div>

                {/* Save Button */}
                <div className="p-6 border-t bg-gray-50 flex justify-end">
                    <button
                        onClick={saveProfile}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
                    >
                        Save Changes
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
