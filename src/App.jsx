import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import logo from "./assets/images/logo.png";
import BrandName from "./components/common/BrandName";
import RoleSelection from "./pages/RoleSelection";

import LoadingScreen from "./components/common/LoadingScreen";
import Navbar from "./components/common/Navbar/Navbar";
import Footer from "./components/common/Navbar/Footer/Footer";
import CTA from "./components/about/CTA";
import ScrollToTop from "./components/common/ScrollToTop";
import ScrollToHash from "./components/ScrollToHash";

import AdminServices from "./components/admin/AdminServices";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Treatments from "./pages/Treatments";
import TreatmentDetail from "./pages/TreatmentDetail";
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

import ToolsEquipment from "./pages/ToolsEquipment";
import ReviewForm from "./pages/ReviewForm";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/admin/ProtectedRoute";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminDoctorProfile from "./components/admin/AdminDoctorProfile";
import Appointments from "./components/admin/Appointments";
import AdminSettings from "./components/admin/AdminSettings";
import AdminLogin from "./components/admin/AdminLogin";
import AdminTestimonials from "./components/admin/AdminTestimonials";
import AdminGallery from "./components/admin/AdminGallery";
import AdminFAQ from "./components/admin/AdminFAQ";
import AdminBlogs from "./components/admin/AdminBlogs";
import AdminNotificationsPage from "./components/admin/AdminNotificationsPage";
import AdminTreatments from "./components/admin/AdminTreatments";

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
    location.pathname.startsWith("/admin") ||
    location.pathname === "/adminlogin";

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

        <Route path="/treatments" element={<Treatments />} />
        <Route path="/treatments/:slug" element={<TreatmentDetail />} />

        <Route path="/services" element={<Services />} />

        <Route
          path="/services/physiotherapy"
          element={<ServiceDetail />}
        />

        <Route
          path="/services/tools-equipment"
          element={<ToolsEquipment />}
        />

        <Route path="/services/:slug" element={<ServiceDetail />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/booking" element={<Booking />} />

        <Route path="/review" element={<ReviewForm />} />


        {/* Login Role Selection */}

<Route
  path="/login-selection"
  element={<RoleSelection />}
 />
        {/* User Login */}
        <Route path="/login" element={<Login />} />

        {/* User Signup */}
        <Route path="/signup" element={<Signup />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/doctors" element={<Doctors />} />

        <Route
          path="/doctors/:doctorName"
          element={<DoctorProfile />}
        />

        <Route path="/gallery" element={<GalleryPage />} />

        <Route
          path="/gallery/clinic"
          element={<ClinicGallery />}
        />

        <Route
          path="/gallery/machine"
          element={<MachineGallery />}
        />

        <Route
          path="/gallery/treatment"
          element={<TreatmentGallery />}
        />

        {/* ==================== BLOG ROUTES ==================== */}

        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog" element={<Blogs />} />

        <Route
          path="/blogs/:id"
          element={<BlogDetails />}
        />
        <Route
          path="/blog/:id"
          element={<BlogDetails />}
        />

        {/* ==================== ADMIN LOGIN ==================== */}

        <Route
          path="/adminlogin"
          element={<AdminLogin />}
        />

        {/* ==================== ADMIN ROUTES ==================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="appointments"
            element={<Appointments />}
          />

          <Route
            path="notifications"
            element={<AdminNotificationsPage />}
          />

          <Route
  path="doctor-profile"
  element={<AdminDoctorProfile />}
/>

          <Route
            path="gallery"
            element={<AdminGallery />}
          />

          <Route
            path="testimonials"
            element={<AdminTestimonials />}
          />

          <Route
            path="faq"
            element={<AdminFAQ />}
          />

          <Route
            path="blogs"
            element={<AdminBlogs />}
          />

          <Route
            path="services"
            element={<AdminServices />}
          />

          <Route
            path="treatments"
            element={<AdminTreatments />}
          />

          <Route
            path="settings"
            element={<AdminSettings />}
          />
        </Route>
      </Routes>

      {!isAdminPage && <CTA />}
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
              className="bg-white rounded-[24px] xs:rounded-[32px] p-5 xs:p-6 sm:p-8 max-w-[480px] w-full text-center relative shadow-[0_20px_60px_rgba(0,0,0,0.15)] mx-3"
            >
              {/* Close Button */}

              <button
                onClick={() =>
                  setShowAppointmentPopup(false)
                }
                className="absolute top-4 right-4 xs:top-5 xs:right-5 text-gray-500 hover:text-black text-2xl"
              >
                ×
              </button>

              {/* Logo & Brand */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col items-center mb-4 xs:mb-5"
              >
                <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 rounded-2xl bg-teal-50 border border-teal-100/80 flex items-center justify-center p-2.5 xs:p-3 shadow-sm mb-2.5 xs:mb-3">
                  <img
                    src={logo}
                    alt="Heal Stride Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <BrandName
                  variant="light"
                  size="sm"
                  centered={true}
                  showSubtitle={true}
                  className="mx-auto"
                />
              </motion.div>

              {/* Heading */}

              <h2 className="text-2xl xs:text-3xl md:text-4xl font-bold text-slate-900 text-center mx-auto">
                Book Your Appointment
              </h2>

              {/* Text */}

              <p className="text-gray-600 mt-4 leading-7 text-center mx-auto max-w-sm">
                Consult our expert physiotherapists and begin your recovery
                journey today.
              </p>

              {/* Buttons */}

              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4 mt-8">
                <button
                  onClick={() =>
                    setShowAppointmentPopup(false)
                  }
                  className="w-full xs:w-28 sm:w-32 xs:shrink-0 border border-slate-300 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer text-sm sm:text-base"
                >
                  Later
                </button>

                <Link
                  to="/booking"
                  onClick={() =>
                    setShowAppointmentPopup(false)
                  }
                  className="flex-1 bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e] text-white px-5 sm:px-6 py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer hs-safe-action"
                >
                  <CalendarCheck size={17} className="shrink-0" />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
    </>
  );
}

export default App;
