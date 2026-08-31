import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "./assets/images/logo.png";

import LoadingScreen from "./components/common/LoadingScreen";
import Navbar from "./components/common/Navbar/Navbar";
import Footer from "./components/common/Navbar/Footer/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import ScrollToHash from "./components/ScrollToHash";

import Staff from "./pages/Staff";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";

import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";

import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";

import GalleryPage from "./pages/GalleryPage";
import ClinicGallery from "./pages/ClinicGallery";
import MachineGallery from "./pages/MachineGallery";
import TreatmentGallery from "./pages/TreatmentGallery";

import PhysiotherapyServices from "./pages/PhysiotherapyServices";
import ToolsEquipment from "./pages/ToolsEquipment";
import ReviewForm from "./pages/ReviewForm";

import AnimatedBackground from "./components/AnimatedBackground";

function App() {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [showAppointmentPopup, setShowAppointmentPopup] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const isAdminPage =
    location.pathname.startsWith("/admin");

  useEffect(() => {
    if (!loading && location.pathname === "/" && !isAdminPage) {
      const popupTimer = setTimeout(() => {
        setShowAppointmentPopup(true);
      }, 5000);

      return () => clearTimeout(popupTimer);
    }
  }, [loading, location.pathname, isAdminPage]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollToTop />
      <ScrollToHash />

      {!isAdminPage && <Navbar />}
      {!isAdminPage && <AnimatedBackground />}

      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/staff" element={<Staff />} />

        <Route path="/services" element={<Services />} />

        <Route
          path="/services/physiotherapy"
          element={<PhysiotherapyServices />}
        />

        <Route
          path="/services/tools-equipment"
          element={<ToolsEquipment />}
        />

        <Route path="/services/:slug" element={<Services />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/booking" element={<Booking />} />

        <Route path="/review" element={<ReviewForm />} />


        {/* ==================== DISABLED / FALLBACK ROUTES ==================== */}
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminPage && <Footer />}

      {/* ==================== APPOINTMENT POPUP ==================== */}

      {location.pathname === "/" &&
        showAppointmentPopup &&
        !isAdminPage && (
          <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
              }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full text-center relative shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            >
              {/* Close Button */}

              <button
                onClick={() =>
                  setShowAppointmentPopup(false)
                }
                className="absolute top-5 right-5 text-gray-500 hover:text-black text-2xl"
              >
                ×
              </button>

              {/* Logo */}

              <motion.div
                initial={{
                  scale: 0,
                }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.2,
                }}
                className="flex justify-center mb-5"
              >
                <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center">
                  <img
                    src={logo}
                    alt="HealStride"
                    className="w-14 h-14 object-contain"
                  />
                </div>
              </motion.div>

              {/* Heading */}

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Book Your Appointment
              </h2>

              {/* Text */}

              <p className="text-gray-600 mt-4 leading-7">
                Consult our expert physiotherapists and begin your recovery
                journey today.
              </p>

              {/* Buttons */}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() =>
                    setShowAppointmentPopup(false)
                  }
                  className="flex-1 border border-slate-300 py-3 rounded-xl font-medium hover:bg-slate-100 transition"
                >
                  Later
                </button>

                <Link
                  to="/booking"
                  onClick={() =>
                    setShowAppointmentPopup(false)
                  }
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold shadow-lg transition flex items-center justify-center"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          </div>
        )}
    </>
  );
}

export default App;
