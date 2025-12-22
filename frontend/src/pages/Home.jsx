import { motion } from "framer-motion";
import { LuBot } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import TopDoctors from "../components/TopDoctors";


import { FaCalendarCheck, FaNotesMedical, FaUserMd } from "react-icons/fa";


export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 overflow-hidden">


      {/* ===================== PREMIUM HERO SECTION ===================== */}
      <section className="relative w-full pt-24 pb-20 px-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-b-[50px] overflow-hidden">

        {/* WAVES */}
        <div className="absolute bottom-0 left-0 w-full opacity-40">
          <img src="/waves.svg" className="w-full" aria-hidden="true" />
        </div>

        {/* Doctor Illustration */}
        <motion.img
          src="/hero-doctor.png" alt="Doctor illustration"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute right-0 bottom-0 w-[340px] hidden md:block drop-shadow-xl"
        />

        {/* LEFT TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-xl"
        >
          <h1 className="text-5xl font-bold leading-tight drop-shadow">
            Your Health, Connected Smarter.
          </h1>

          <p className="mt-5 text-lg opacity-95 max-w-md">
            Manage records, book appointments, view doctor summaries, and use AI-powered assistance — all in one secure platform.
          </p>
          
          <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)} } className=' mt-8 inline-block bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold shadow-xl hover:bg-gray-200 transition'>Book Appointment →</button>
          
        </motion.div>
      </section>

      {/* ===================== GLASS SERVICES ===================== */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Key Services</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
          {[
            {
              icon: <FaCalendarCheck size={45} />,
              title: "Book Appointments",
              text: "Find trusted doctors & schedule easily.",
              link: "/doctors",
            },
            {
              icon: <FaNotesMedical size={45} />,
              title: "Upload Records",
              text: "Secure cloud-based storage.",
              link: "/upload-report",
            },
            {
              icon: <LuBot size={45} className="text-blue-600" />,
              title: "AI Assistance",
              text: "Ask questions & get medical insights.",
              link: "/ai-chat",
            },
            {
              icon: <FaUserMd size={45} />,
              title: "Doctor Notes",
              text: "View diagnosis, prescriptions & visit summaries.",
              link: "/my-summaries",
            }
          ].map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.link)}
              className="w-full flex justify-center cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="backdrop-blur-md bg-white/60 shadow-lg rounded-2xl p-8 text-center border border-white/40 w-64 hover:bg-white transition"
              >
                {/* ICON */}
                <div className="flex justify-center items-center mb-4 text-blue-600">
                  {card.icon}
                </div>

                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.text}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>



      {/* ===================== TRUSTED DOCTORS ===================== */}
      {/* ======<Header />
      <SpecialityMenu />  =====*/}

      {/* DOCTORS GRID */}
      <TopDoctors />

      {/* ===================== COUNTERS SECTION ===================== */}
      <section className="py-16 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Trusted by Thousands</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {[
            { number: 100, label: "Doctors Available" },
            { number: 5000, label: "Patients Served" },
            { number: 12000, label: "Reports Uploaded" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white shadow-lg rounded-xl p-8 border hover:scale-105 transition cursor-default"
            >
              <motion.h3
                className="text-4xl font-bold text-blue-600"
                whileInView={{
                  textContent: [0, item.number],
                  transition: { duration: 2 },
                }}
              >
                {item.number}+
              </motion.h3>
              <p className="mt-2 text-gray-600">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================== TESTIMONIAL SLIDER (NO SWIPER) ===================== */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Patients Say</h2>
        <Testimonials />
      </section>

      {/* ===================== HOW MEDICONNECT WORKS ===================== */}
      <HowItWorks />

      {/* ===================== BANNER CTA ===================== */}
      <Banner />

      {/* ===================== FLOATING AI BUBBLE ===================== */}
      <Link
        to="/ai-chat"
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
      >
        🤖
      </Link>
    </div>
  );
}