// src/App.jsx
import { Route, Routes } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Public pages
import About from "./pages/About";
import Appointment from "./pages/Appointment";
import Checkin from "./pages/CheckIn";
import Contact from "./pages/Contact";
import Doctors from "./pages/Doctors";
import Home from "./pages/Home";
import ViewSharedRecord from "./pages/ViewSharedRecord";

// Patient pages
import AIChat from "./pages/AIChat";
import GenerateQR from "./pages/GenerateQR";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
import MyReports from "./pages/MyReports";
import MySummaries from "./pages/MySummaries";
import PatientDashboard from "./pages/PatientDashboard";
import UploadReport from "./pages/UploadReport";

// Doctor pages
import ChatPage from "./pages/Chat";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorChatList from "./pages/DoctorChatList";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorSettings from "./pages/DoctorSettings";
import Earnings from "./pages/Earnings";
import MyPatients from "./pages/MyPatients";

// Admin pages
import ActivityLog from "./pages/ActivityLog";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRecords from "./pages/AdminRecords";
import ManageDoctors from "./pages/ManageDoctors";
import ManagePatients from "./pages/ManagePatients";
import AdminMessages from "./pages/AdminMessages";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import { AppContextProvider } from "./context/AppContext";

const App = () => {
  return (
    <AppContextProvider>
      <div className="mx-4 sm:mx-[10%]">
        <Navbar />
        <div className="pt-4">

          <Routes>

            {/* --------------------- PUBLIC ROUTES --------------------- */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:speciality" element={<Doctors />} />

            {/* PUBLIC DOCTOR PROFILE PAGE */}
            <Route path="/doctor/:id" element={<DoctorProfile />} />

            <Route path="/appointment/:docId" element={<Appointment />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* QR Share & Check-in */}
            <Route path="/share/:token" element={<ViewSharedRecord />} />
            <Route path="/checkin/:token" element={<Checkin />} />

            {/* CHAT (patient or doctor) */}
            <Route
              path="/chat/:id"
              element={
                <ProtectedRoute role={["patient", "doctor"]}>
                  <ChatPage />
                </ProtectedRoute>
              }
            />

            {/* --------------------- PATIENT ROUTES --------------------- */}
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute role="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-profile"
              element={
                <ProtectedRoute role="patient">
                  <MyProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute role="patient">
                  <MyAppointments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/upload-report"
              element={
                <ProtectedRoute role="patient">
                  <UploadReport />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-reports"
              element={
                <ProtectedRoute role="patient">
                  <MyReports />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ai-chat"
              element={
                <ProtectedRoute role="patient">
                  <AIChat />
                </ProtectedRoute>
              }
            />

            <Route
              path="/generate-qr/:recordId"
              element={
                <ProtectedRoute role="patient">
                  <GenerateQR />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-summaries"
              element={
                <ProtectedRoute role="patient">
                  <MySummaries />
                </ProtectedRoute>
              }
            />

            {/* --------------------- DOCTOR ROUTES --------------------- */}
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/patients"
              element={
                 <ProtectedRoute role="doctor">
                    <MyPatients />
                 </ProtectedRoute>
                }
            />

            <Route
              path="/doctor/chat-list"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorChatList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/chat/:appointmentId"
              element={
                <ProtectedRoute role="doctor">
                  <ChatPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/earnings"
              element={
                <ProtectedRoute role="doctor">
                  <Earnings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/settings"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorSettings />
                </ProtectedRoute>
              }
            />

            {/* LOGGED-IN DOCTOR'S OWN PROFILE */}
            <Route
              path="/doctor/profile"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorProfile />
                </ProtectedRoute>
              }
            />

            {/* --------------------- ADMIN ROUTES --------------------- */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/messages" element={<AdminMessages />} />

            <Route
              path="/admin/manage-doctors"
              element={
                <ProtectedRoute role="admin">
                  <ManageDoctors />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/manage-patients"
              element={
                <ProtectedRoute role="admin">
                  <ManagePatients />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/records"
              element={
                <ProtectedRoute role="admin">
                  <AdminRecords />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/activity"
              element={
                <ProtectedRoute role="admin">
                  <ActivityLog />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>

        <Footer />
      </div>
    </AppContextProvider>
  );
};

export default App;
