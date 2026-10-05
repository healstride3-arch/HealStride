import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  FaCheck,
  FaTimes,
  FaUser,
  FaPhoneAlt,
  FaStethoscope,
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { auth } from "../../firebase/firebase";
import { saveAppointmentToFirestore } from "../../services/appointmentSubmissionService";
import { sendBookingNotification } from "../../services/bookingNotificationService";
import { useClinicSettings } from "../../hooks/useClinicSettings";
import drRashidImage from "../../assets/images/Dr.MD.Rashid.png";
import drWazulImage from "../../assets/images/Dr Wazul Quamar.jpeg";

// 15 Official Clinical Services at Heal Stride Bhopal
const CLINIC_SERVICES_GROUPS = [
  {
    category: "Spine & Joint Care",
    services: [
      "Chiropractic Treatment",
      "Spinal Decompression Therapy",
      "Posture Correction Therapy",
      "Ultrasound Therapy",
    ],
  },
  {
    category: "Advanced Therapies",
    services: [
      "Cupping Therapy (Hijama)",
      "Cranio Sacral Therapy",
      "Cryo Therapy",
      "Laser Therapy",
    ],
  },
  {
    category: "Rehabilitation & Recovery",
    services: [
      "Clinical Physiotherapy",
      "Home Physiotherapy",
      "Sports Injury Rehabilitation",
      "Stroke / Paralysis Rehabilitation",
    ],
  },
  {
    category: "Electro & Modern Tech",
    services: [
      "Interferential Therapy (IFT)",
      "Shockwave Therapy",
      "Red Light Therapy",
    ],
  },
  {
    category: "General Consultation",
    services: [
      "General Physical Assessment & Consultation",
      "Other Consultation",
    ],
  },
];

const ALL_SERVICES_FLAT = CLINIC_SERVICES_GROUPS.flatMap((g) => g.services);

const AppointmentForm = () => {
  const { t } = useTranslation();
  const { data: settings } = useClinicSettings();
  const [searchParams] = useSearchParams();

  const [submitted, setSubmitted] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  // Query parameter support: ?service=... or ?treatment=...
  const queryParamService =
    searchParams.get("service") ||
    searchParams.get("treatment") ||
    searchParams.get("condition") ||
    "";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
  });

  // Pre-fill service from URL if provided
  useEffect(() => {
    if (queryParamService) {
      // Find matching service or set queryParamService directly
      const matched = ALL_SERVICES_FLAT.find(
        (s) => s.toLowerCase() === queryParamService.toLowerCase()
      );
      setFormData((prev) => ({
        ...prev,
        service: matched || queryParamService,
      }));
    }
  }, [queryParamService]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const isPhoneValid = formData.phone.length === 10;
  const isNameValid = formData.name.trim().length > 0;
  const isServiceValid = formData.service.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      phone: true,
      service: true,
    });

    if (!isNameValid || !isPhoneValid || !isServiceValid) {
      return;
    }

    try {
      setLoading(true);

      const formattedPhone = formData.phone.startsWith("+91")
        ? formData.phone
        : `+91${formData.phone}`;

      const currentUser = auth?.currentUser;

      const bookingPayload = {
        userId: currentUser?.uid || "guest-patient",
        name: formData.name.trim(),
        phone: formattedPhone,
        service: formData.service,
        condition: formData.service, // backward compatibility with admin table
        doctor: "Specialist Doctor",
        date: new Date().toISOString().split("T")[0],
        time: "Priority Callback / Immediate Slot",
        message: `Service Consultation Requested: ${formData.service}`,
        email: currentUser?.email || "",
        profileImage: currentUser?.photoURL || "",
        googleName: currentUser?.displayName || "",
        source: "website-booking-form",
        status: "new",
        read: false,
        notificationRead: false,
        createdAt: new Date().toISOString(),
      };

      await saveAppointmentToFirestore(bookingPayload);

      try {
        await sendBookingNotification(bookingPayload);
      } catch (notifyErr) {
        console.warn("Booking webhook notification warning (non-fatal):", notifyErr);
      }

      setLastBooking({ ...bookingPayload });
      setSubmitted(true);

      setFormData({
        name: "",
        phone: "",
        service: "",
      });
      setTouched({});
    } catch (error) {
      console.error("Booking submission error:", error);
      alert("Failed to submit appointment. Please try again or call clinic directly at +91 8809491380.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-8 xs:py-10 sm:py-14 lg:py-16 bg-white overflow-hidden min-h-screen flex items-start lg:items-center border-t border-slate-100">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-50/30 via-white to-slate-50/50 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-100/25 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-6 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50/80 border border-teal-200/80 shadow-xs mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d71920] animate-pulse" />
            <span className="uppercase tracking-wider font-bold text-[11px] sm:text-xs text-teal-800">
              {t("appointmentForm.badge", "Online Consultation Booking • Priority Appointment")}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight pb-1 text-slate-900">
            {t("appointmentForm.titleLine1", "Book Your")}{" "}
            <span className="bg-gradient-to-r from-[#d71920] to-[#008272] bg-clip-text text-transparent">
              {t("appointmentForm.titleHighlight", "Physiotherapy")}
            </span>{" "}
            {t("appointmentForm.titleLine2", "Session")}
          </h1>

          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 max-w-2xl sm:max-w-3xl mx-auto">
            {t("appointmentForm.subtitle", "Consult our expert physiotherapists Dr. MD Rashid (PT) and Dr. Md Wajhul Qumar (PT) for personalized pain relief and rehabilitation.")}
          </p>
        </motion.div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
          
          {/* Left Column: Both Doctors & Clinic Trust Panel (5 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 space-y-4 sm:space-y-5"
          >
            {/* Our Expert Doctors Box */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 xs:p-5 sm:p-6 shadow-md shadow-slate-100 relative overflow-hidden space-y-4">
              <div className="flex flex-col mobile:flex-row mobile:items-center mobile:justify-between gap-2.5 pb-3 border-b border-slate-100">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-start mobile:items-center gap-2">
                  <FaStethoscope className="text-teal-700" />
                  <span>{t("appointmentForm.specialistTitle", "Our Specialist Physiotherapists")}</span>
                </h3>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                  <FaStar className="text-xs" />
                  <span>{t("appointmentForm.reviewsRating", "4.7 (43+ Reviews)")}</span>
                </div>
              </div>

              {/* Doctor 1: Dr. MD Rashid */}
              <div className="flex flex-col mobile:flex-row mobile:items-center gap-3 bg-slate-50/80 hover:bg-teal-50/40 transition-colors p-3 rounded-xl border border-slate-200/80 text-center mobile:text-left">
                <img
                  src={drRashidImage}
                  alt="Dr. MD Rashid (PT)"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-teal-200 shadow-sm shrink-0 mx-auto mobile:mx-0"
                />
                <div className="w-full">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    Dr. MD Rashid (PT)
                  </h4>
                  <p className="text-teal-700 text-xs font-semibold">
                    {t("appointmentForm.drRashidTitle", "Senior Consultant Physiotherapist | MPT (Sports)")}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {t("appointmentForm.drRashidReg", "Reg. DEG2/71968/2025 • MPT (Sports) • Certified in Cupping, Dry Needling & Taping")}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5 justify-center mobile:justify-start">
                    <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/70 px-1.5 py-0.5 rounded-md">Cupping</span>
                    <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/70 px-1.5 py-0.5 rounded-md">Dry Needling</span>
                    <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/70 px-1.5 py-0.5 rounded-md">Taping</span>
                    <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/70 px-1.5 py-0.5 rounded-md">Mulligan MWM</span>
                    <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/70 px-1.5 py-0.5 rounded-md">BLS</span>
                  </div>
                </div>
              </div>

              {/* Doctor 2: Dr. Md Wajhul Qumar (PT) */}
              <div className="flex flex-col mobile:flex-row mobile:items-center gap-3 bg-slate-50/80 hover:bg-teal-50/40 transition-colors p-3 rounded-xl border border-slate-200/80 text-center mobile:text-left">
                <img
                  src={drWazulImage}
                  alt="Dr. Md Wajhul Qumar (PT)"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-teal-200 shadow-sm shrink-0 mx-auto mobile:mx-0"
                />
                <div className="w-full">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    Dr. Md Wajhul Qumar (PT)
                  </h4>
                  <p className="text-teal-700 text-xs font-semibold">
                    {t("appointmentForm.drWazulTitle", "Physiotherapist & Rehab Specialist (BPT) • 7 Certified")}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {t("appointmentForm.drWazulDesc", "Cardiopulmonary Rehab, Cupping, Dry Needling, IASTM, Taping & Manual Therapy")}
                  </p>
                </div>
              </div>

              {/* Highlights */}
              <div className="pt-2 space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <FaCheckCircle className="text-[#008272] mt-0.5 shrink-0" />
                  <span>{t("appointmentForm.highlight1", "Evidence-based modalities (Traction, Laser & Stimulator)")}</span>
                </div>
                <div className="flex items-start gap-2">
                  <FaCheckCircle className="text-[#008272] mt-0.5 shrink-0" />
                  <span>{t("appointmentForm.highlight2", "Dedicated one-on-one patient care & zero waiting time")}</span>
                </div>
              </div>
            </div>

            {/* Quick Contact & Consultation Hours Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 xs:p-5 sm:p-6 shadow-md shadow-slate-100 space-y-4">
              <h3 className="text-slate-900 font-bold text-sm sm:text-base flex items-center gap-2">
                <FaClock className="text-teal-700" />
                <span>{t("appointmentForm.timingsTitle", "Clinic Timings & Consultation Hours")}</span>
              </h3>

              <div className="grid grid-cols-1 mobile:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-teal-700 font-bold mb-1">{t("appointmentForm.morningSession", "Morning Session")}</div>
                  <div className="text-slate-800 font-medium">{t("appointmentForm.morningTime", "09:00 AM - 12:00 PM")}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-teal-700 font-bold mb-1">{t("appointmentForm.eveningSession", "Evening Session")}</div>
                  <div className="text-slate-800 font-medium">{t("appointmentForm.eveningTime", "05:00 PM - 09:00 PM")}</div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 pt-1">
                <FaMapMarkerAlt className="text-red-600 mt-0.5 shrink-0 text-sm" />
                <span>
                  {settings.address || "LIG 85, Raisen Rd, New Subhash Nagar, Bhopal, MP 462023"}
                </span>
              </div>

              {/* Fast Direct Action Buttons */}
              <div className="grid grid-cols-1 mobile:grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${(settings.phone || "+918809491380").replace(/\s+/g, "")}`}
                  className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-3 rounded-xl text-xs sm:text-sm transition-all border border-slate-300 shadow-sm"
                >
                  <img src="/call.png" alt="Call" className="w-4 h-4 object-contain shrink-0" />
                  <span>{t("appointmentForm.callDoctor", "Call Doctor")}</span>
                </a>

                <a
                  href={`https://wa.me/${(settings.whatsapp || "918809491380").replace(/[^0-9]/g, "")}?text=Hello%20Dr.%20MD%20Rashid,%20I%20would%20like%20to%20inquire%20about%20a%20physiotherapy%20appointment.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-2.5 px-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                >
                  <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain shrink-0" />
                  <span>{t("appointmentForm.whatsapp", "WhatsApp")}</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Simplified 3-Field Booking Form (7 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7"
          >
            {/* Booking Form Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 xs:p-6 sm:p-8 lg:p-10 border border-slate-100 relative overflow-hidden">
              
              {/* Form Title */}
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {t("appointmentForm.formTitle", "Patient Consultation Form")}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Fill in your details below for a quick consultation booking.
                </p>
              </div>

              {/* The Booking Form: Only Full Name, Mobile Number, Choose Service */}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                
                {/* 1. Full Name */}
                <div>
                  <label htmlFor="name" className="block text-slate-800 font-semibold text-xs sm:text-sm mb-1.5">
                    {t("appointmentForm.fullNameLabel", "Patient Full Name")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FaUser className="text-xs" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder={t("appointmentForm.fullNamePlaceholder", "e.g. Ramesh Sharma")}
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full
                        h-12
                        bg-slate-50
                        border
                        ${touched.name && !isNameValid ? "border-red-400 bg-red-50/20 focus:ring-red-400/20" : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"}
                        rounded-xl
                        pl-10 pr-4
                        text-slate-900
                        placeholder:text-slate-400
                        focus:bg-white
                        focus:ring-2
                        outline-none
                        transition-all
                        text-xs sm:text-sm
                      `}
                    />
                  </div>
                  {touched.name && !isNameValid && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{t("appointmentForm.fullNameError", "Please enter your full name.")}</p>
                  )}
                </div>

                {/* 2. Mobile Number */}
                <div>
                  <label htmlFor="phone" className="block text-slate-800 font-semibold text-xs sm:text-sm mb-1.5">
                    {t("appointmentForm.phoneLabel", "Mobile Number")} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3.5 bg-slate-100 border border-r-0 border-slate-200 text-slate-700 text-xs font-bold rounded-l-xl flex-shrink-0">
                      +91
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder={t("appointmentForm.phonePlaceholder", "e.g. 9876543210")}
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full
                        h-12
                        bg-slate-50
                        border
                        ${touched.phone && !isPhoneValid ? "border-red-400 bg-red-50/20 focus:ring-red-400/20" : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"}
                        rounded-r-xl
                        px-3.5
                        text-slate-900
                        placeholder:text-slate-400
                        focus:bg-white
                        focus:ring-2
                        outline-none
                        transition-all
                        text-xs sm:text-sm
                      `}
                    />
                  </div>
                  {touched.phone && !isPhoneValid && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{t("appointmentForm.phoneError", "Please enter a valid 10-digit mobile number.")}</p>
                  )}
                </div>

                {/* 3. Choose Service Dropdown (Heal Stride Services) */}
                <div>
                  <label htmlFor="service" className="block text-slate-800 font-semibold text-xs sm:text-sm mb-1.5">
                    {t("appointmentForm.serviceLabel", "Choose Service")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FaStethoscope className="text-xs" />
                    </div>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full
                        h-12
                        bg-slate-50
                        border
                        ${touched.service && !isServiceValid ? "border-red-400 bg-red-50/20 focus:ring-red-400/20" : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"}
                        rounded-xl
                        pl-10 pr-8
                        text-slate-900
                        focus:bg-white
                        focus:ring-2
                        outline-none
                        transition-all
                        text-xs sm:text-sm
                        cursor-pointer
                      `}
                    >
                      <option value="" disabled className="text-slate-400">
                        {t("appointmentForm.servicePlaceholder", "Select a Service / Therapy")}
                      </option>

                      {/* If arrived from a specific treatment/condition not in standard list, display it at top */}
                      {queryParamService &&
                        !ALL_SERVICES_FLAT.some(
                          (s) => s.toLowerCase() === queryParamService.toLowerCase()
                        ) && (
                          <optgroup label="Selected Condition / Treatment">
                            <option value={queryParamService}>{queryParamService}</option>
                          </optgroup>
                        )}

                      {CLINIC_SERVICES_GROUPS.map((group) => (
                        <optgroup key={group.category} label={group.category}>
                          {group.services.map((svc) => (
                            <option key={svc} value={svc}>
                              {svc}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  {touched.service && !isServiceValid && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {t("appointmentForm.serviceError", "Please select a service.")}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      min-h-13
                      h-auto
                      py-3.5
                      bg-gradient-to-r
                      from-[#d71920]
                      to-[#008272]
                      hover:from-[#b91c1c]
                      hover:to-[#0f766e]
                      active:scale-[0.99]
                      disabled:opacity-70
                      text-white
                      font-bold
                      text-sm sm:text-base
                      leading-snug
                      rounded-2xl
                      shadow-lg
                      shadow-teal-700/25
                      hover:shadow-xl
                      hover:shadow-teal-700/35
                      transition-all
                      duration-200
                      flex
                      items-center
                      justify-center
                      gap-2
                      cursor-pointer
                    "
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t("appointmentForm.submittingBtn", "Confirming Your Session...")}</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="text-base text-teal-200" />
                        <span>{t("appointmentForm.submitBtn", "Confirm Appointment Now")}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Guarantee Pill */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 pt-1 text-center">
                  <FaShieldAlt className="text-teal-700" />
                  <span>{t("appointmentForm.guarantee", "Direct SMS / WhatsApp notification to clinic • Priority Session")}</span>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Appointment Confirmation Popup Modal */}
      <AnimatePresence>
        {submitted && lastBooking && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 xs:p-4 mobile:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSubmitted(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[460px] max-h-[92vh] flex flex-col bg-white rounded-2xl xs:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-4 xs:px-5 mobile:px-6 py-3 xs:py-3.5 border-b border-slate-100 bg-slate-50/90 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="font-bold text-slate-800 text-xs xs:text-sm mobile:text-base">
                    {t("appointmentForm.confirmationTitle", "Appointment Confirmation")}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close confirmation"
                >
                  <FaTimes className="text-xs xs:text-sm" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-4 xs:p-5 mobile:p-6 text-center">
                <div className="w-12 h-12 xs:w-14 xs:h-14 mobile:w-16 mobile:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2.5 xs:mb-3 ring-4 xs:ring-6 ring-emerald-50">
                  <FaCheckCircle className="text-2xl xs:text-3xl mobile:text-4xl" />
                </div>

                <h4 className="text-lg xs:text-xl mobile:text-2xl font-extrabold text-slate-900 leading-snug">
                  {t("appointmentForm.receivedTitle", "Booking Request Received!")}
                </h4>
                <p className="text-slate-600 text-[11px] xs:text-xs mobile:text-sm mt-1 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{lastBooking.name}</strong>. Your consultation request has been received. Our clinic reception will call you on <strong className="text-slate-900">{lastBooking.phone}</strong> shortly to confirm your visit.
                </p>

                {/* Booking Summary Box */}
                <div className="mt-4 mobile:mt-5 bg-slate-50 border border-slate-200/80 rounded-xl xs:rounded-2xl p-3.5 mobile:p-4 text-left space-y-2.5 text-xs mobile:text-sm">
                  <div className="flex items-start justify-between gap-2.5 pb-2 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium shrink-0">Patient Name:</span>
                    <span className="text-slate-900 font-semibold text-right break-words">{lastBooking.name}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2.5 pb-2 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium shrink-0">Mobile Number:</span>
                    <span className="text-slate-900 font-semibold text-right">{lastBooking.phone}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2.5 pb-2 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium shrink-0">Selected Service:</span>
                    <span className="text-emerald-700 font-bold text-right break-words">{lastBooking.service}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2.5">
                    <span className="text-slate-500 font-medium shrink-0">Status:</span>
                    <span className="text-teal-700 font-bold text-right flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping inline-block" />
                      Priority Clinic Call Back
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 mobile:mt-5 grid grid-cols-1 mobile:grid-cols-2 gap-2 xs:gap-2.5">
                  <a
                    href={`https://wa.me/${(settings.whatsapp || "918809491380").replace(/[^0-9]/g, "")}?text=Hello%20Heal%20Stride,%20I%20have%20submitted%20a%20consultation%20request%20for%20${encodeURIComponent(lastBooking.name)}%20(${encodeURIComponent(lastBooking.service)}).`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-semibold py-2.5 xs:py-3 px-3.5 rounded-xl text-xs mobile:text-sm transition-all shadow-md shadow-emerald-600/20"
                  >
                    <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain shrink-0" />
                    <span>{t("appointmentForm.whatsappClinic", "WhatsApp Clinic")}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-semibold py-2.5 xs:py-3 px-3.5 rounded-xl text-xs mobile:text-sm transition-all cursor-pointer shadow-md shadow-slate-900/10"
                  >
                    {t("appointmentForm.doneClose", "Done / Close")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AppointmentForm;
