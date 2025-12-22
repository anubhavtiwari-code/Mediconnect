import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <span className="text-gray-700 font-medium">ABOUT US</span>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[360px]" src={assets.about_image} alt="" />
        <div className="flex flex-col gap-6  text-gray-600 text-xl">
          <b className="text-gray-800 ">Empowering Patients. Assisting Doctors. Securing Health Records.</b>
          <p  >MediConnect is a smart, secure, and user-friendly digital health platform designed to bridge the gap between patients, doctors, and healthcare administrators. This provides a seamless way to store, access, and manage medical information — anytime, anywhere.</p>
          <b className="text-gray-800 ">🔍 Who We Are</b>
          <p>MediConnect is a next-generation health record management system built using modern technology. We aim to simplify healthcare by offering a centralized, secure, and accessible platform for everyone.</p>
          <b className="text-gray-800 ">🎯 Our Mission</b>
          <p>To make healthcare more connected, transparent, and efficient by enabling digitized medical records and AI-driven insights.</p>
        </div>
      </div>
      <div className="text-xl my-4">
        <span className="text-gray-700 font-semibold">WHAT WE OFFER</span>
      </div>
      <div className="flex flex-col md:flex-row mb:20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>🩺 For Patients</b>
          <ul>
            <li>Personal health dashboard</li>
            <li>Upload & store medical records</li>
            <li>AI-based health analytics</li>
            <li>Smart diet recommendations</li>
            <li>Easy appointment & doctor search</li>
            <li>Secure access to past reports anytime</li>
          </ul>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>👨‍⚕ For Doctors</b>
          <ul>
            <li>Quick access to patient records</li>
            <li>Simple & organized patient history</li>
            <li>Helps in accurate diagnosis</li>
            <li>Digital consultation notes</li>
          </ul>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>🏥 For Admin</b>
          <ul>
            <li>Manage patient & doctor accounts</li>
            <li>Monitor system activity</li>
            <li>Ensure secure & smooth operation</li>
          </ul>
        </div>
      </div>

      {/* ===================== WHY CHOOSE MEDICONNECT ===================== */}
      <div className="my-20">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Why Choose MediConnect?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    
          <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white">
            <h3 className="text-xl font-semibold mb-2">🔐 Secure Records</h3>
            <p className="text-gray-600 text-sm">
              All medical data is protected with encryption to ensure complete privacy and security.
            </p>
          </div>

          <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white">
            <h3 className="text-xl font-semibold mb-2">🤖 24/7 AI Assistant</h3>
            <p className="text-gray-600 text-sm">
              Your intelligent health assistant is available anytime to answer questions and guide you.
            </p>
          </div>

          <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white">
            <h3 className="text-xl font-semibold mb-2">👨‍⚕ Trusted Doctors</h3>
            <p className="text-gray-600 text-sm">
              Verified and experienced doctors available across multiple specialties.
            </p>
          </div>

          <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white">
            <h3 className="text-xl font-semibold mb-2">⚡ Fast Appointments</h3>
            <p className="text-gray-600 text-sm">
              Book doctor appointments in seconds with real-time availability.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default About