import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      whileInView={{ opacity: 1 }} 
      transition={{ duration: 0.7 }}
      className="md:mx-10 mt-20"
    >
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm">

        {/* LEFT */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            MediConnect is your secure digital health partner. Access records anywhere with complete data privacy.
          </p>

          <p className="text-gray-600 mt-3">📍 New Delhi, India</p>
          <p className="text-gray-600">📞 +91 98765 *****</p>
          <p className="text-gray-600">✉️ support@mediconnect.com</p>
        </div>

        {/* CENTER */}
        <div>
          <p className="text-xl font-medium mb-5">Quick Links</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>All Doctors</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* RIGHT */}
        <div>
          <p className="text-xl font-medium mb-5">Services</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Book Appointments</li>
            <li>Upload Health Records</li>
            <li>Patient Dashboard</li>
            <li>Diet Recommendation</li>
            <li>AI Health Analytics</li>
          </ul>
        </div>
      </div>

      <hr />
      <p className="py-5 text-sm text-center">© MediConnect — All Rights Reserved.</p>
    </motion.div>
  );
};

export default Footer;
