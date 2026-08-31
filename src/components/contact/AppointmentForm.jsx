import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FaCheck,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaPhoneAlt,
  FaStethoscope,
  FaCommentDots,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaStar,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { sendBookingNotification } from "../../services/bookingNotificationService";
import drRashidImage from "../../assets/images/Dr.MD.Rashid.png";
import drWazulImage from "../../assets/images/Dr Wazul Quamar.jpeg";

const POPULAR_SLOTS = [
  "09:30 AM",
  "10:30 AM",
  "11:30 AM",
  "05:30 PM",
  "06:30 PM",
  "07:30 PM",
  "08:30 PM",
];

const AppointmentForm = () => {
  const { t } = useTranslation();

  const [submitted, setSubmitted] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    doctor: "Any Available Specialist",
    condition: "",
    date: "",
    time: "",
    message: "",
  });

  const todayStr = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSlotSelect = (slot) => {
    setFormData((prev) => ({ ...prev, time: slot }));
    setTouched((prev) => ({ ...prev, time: true }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const isPhoneValid = formData.phone.length === 10;
  const isNameValid = formData.name.trim().length > 0;
  const isConditionValid = formData.condition.length > 0;
  const isDateValid = formData.date.length > 0;
  const isTimeValid = formData.time.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      phone: true,
      condition: true,
      date: true,
      time: true,
    });

    if (!isNameValid || !isPhoneValid || !isConditionValid || !isDateValid || !isTimeValid) {
      return;
    }

    try {
      setLoading(true);

      const formattedPhone = formData.phone.startsWith("+91")
        ? formData.phone
        : `+91${formData.phone}`;

      const bookingPayload = {
        userId: "guest-patient",
        name: formData.name.trim(),
        phone: formattedPhone,
        doctor: formData.doctor || "Any Available Specialist",
        condition: formData.condition,
        date: formData.date,
        time: formData.time,
        message: formData.message || "Consultation requested",
        email: "",
        profileImage: "",
        googleName: "",
        source: "website-direct",
        createdAt: new Date().toISOString(),
      };

      await sendBookingNotification(bookingPayload);

      setLastBooking({ ...bookingPayload });
      setSubmitted(true);

      setFormData({
        name: "",
        phone: "",
        doctor: "Any Available Specialist",
        condition: "",
        date: "",
        time: "",
        message: "",
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
    <section className="relative py-7 xs:py-8 sm:py-12 lg:py-16 bg-slate-900 overflow-hidden min-h-screen flex items-start lg:items-center">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 bg-radial from-teal-900/40 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-6 sm:mb-12"
        >
          <div className="inline-flex max-w-full items-center justify-center gap-2 px-3 xs:px-4 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 font-semibold text-[11px] xs:text-xs sm:text-sm tracking-wide mb-3 backdrop-blur-md text-center leading-snug">
            <FaShieldAlt className="text-teal-400 text-xs" />
            <span>Online Consultation Booking • Priority Appointment</span>
          </div>

          <h1 className="text-[26px] xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Book Your <span className="text-teal-400">Physiotherapy</span> Session
          </h1>

          <p className="text-slate-300 mt-3 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            Consult our expert physiotherapists <strong>Dr. MD Rashid (PT)</strong> and <strong>Dr. Wajhul Qamar (PT)</strong> for personalized pain relief and rehabilitation.
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
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 xs:p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-4">
              <div className="flex flex-col mobile:flex-row mobile:items-center mobile:justify-between gap-2.5 pb-3 border-b border-slate-700/70">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-start mobile:items-center gap-2">
                  <FaStethoscope className="text-teal-400" />
                  <span>Our Specialist Physiotherapists</span>
                </h3>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                  <FaStar className="text-xs" />
                  <span>4.7 ★ (43+ Reviews)</span>
                </div>
              </div>

              {/* Doctor 1: Dr. MD Rashid */}
              <div className="flex flex-col mobile:flex-row mobile:items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 text-center mobile:text-left">
                <img
                  src={drRashidImage}
                  alt="Dr. MD Rashid (PT)"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-teal-500/50 shadow-sm shrink-0"
                />
                <div className="w-full">
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Dr. MD Rashid (PT)
                  </h4>
                  <p className="text-teal-300 text-xs font-medium">
                    Consultant Physiotherapist (BPT)
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Reg. DEG2/71968/2025 • Cupping & Needling Certified
                  </p>
                </div>
              </div>

              {/* Doctor 2: Dr. Wajhul Qamar */}
              <div className="flex flex-col mobile:flex-row mobile:items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60 text-center mobile:text-left">
                <img
                  src={drWazulImage}
                  alt="Dr. Wajhul Qamar (PT)"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-teal-500/50 shadow-sm shrink-0"
                />
                <div className="w-full">
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Dr. Wajhul Qamar (PT)
                  </h4>
                  <p className="text-teal-300 text-xs font-medium">
                    Physiotherapist & Rehab Specialist (BPT)
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Movement Recovery & Musculoskeletal Rehabilitation
                  </p>
                </div>
              </div>

              {/* Highlights */}
              <div className="pt-2 space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <FaCheckCircle className="text-teal-400 mt-0.5 shrink-0" />
                  <span>Evidence-based modalities (Traction, Laser & Stimulator)</span>
                </div>
                <div className="flex items-start gap-2">
                  <FaCheckCircle className="text-teal-400 mt-0.5 shrink-0" />
                  <span>Dedicated one-on-one patient care & zero waiting time</span>
                </div>
              </div>
            </div>

            {/* Quick Contact & Consultation Hours Card */}
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 xs:p-5 sm:p-6 shadow-xl space-y-4">
              <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                <FaClock className="text-teal-400" />
                <span>Clinic Timings & Consultation Hours</span>
              </h3>

              <div className="grid grid-cols-1 mobile:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                  <div className="text-teal-400 font-semibold mb-1">Morning Session</div>
                  <div className="text-slate-200 font-medium">09:00 AM - 12:00 PM</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                  <div className="text-teal-400 font-semibold mb-1">Evening Session</div>
                  <div className="text-slate-200 font-medium">05:00 PM - 09:00 PM</div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 pt-1">
                <FaMapMarkerAlt className="text-teal-400 mt-0.5 shrink-0 text-sm" />
                <span>
                  LIG 85, Raisen Rd, Near Gurudwara, New Subhash Nagar, Ashoka Garden, Bhopal - 462023
                </span>
              </div>

              {/* Fast Direct Action Buttons */}
              <div className="grid grid-cols-1 mobile:grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:+918809491380"
                  className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 px-3 rounded-xl text-xs sm:text-sm transition-all border border-slate-600 shadow-sm"
                >
                  <FaPhoneAlt className="text-teal-300 text-xs" />
                  <span>Call Doctor</span>
                </a>

                <a
                  href="https://wa.me/918809491380?text=Hello%20Dr.%20MD%20Rashid,%20I%20would%20like%20to%20inquire%20about%20a%20physiotherapy%20appointment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                >
                  <FaWhatsapp className="text-base" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: High-Converting Booking Form (7 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7"
          >
            {/* Booking Form Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 xs:p-5 sm:p-8 lg:p-10 border border-slate-100 relative overflow-hidden">
              
              {/* Form Title */}
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Patient Consultation Form
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Fill in your details below to schedule your appointment.
                </p>
              </div>

              {/* Success Confirmation Modal / Banner */}
              <AnimatePresence>
                {submitted && lastBooking && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-6 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl p-5 shadow-sm"
                  >
                    <div className="flex flex-col mobile:flex-row mobile:items-center gap-3 mb-2 text-center mobile:text-left">
                      <div className="w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mobile:mx-0 shrink-0">
                        <FaCheck />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-900 text-base">
                          Appointment Request Received!
                        </h4>
                        <p className="text-emerald-700 text-xs">
                          Doctor & clinic have been notified. We will call you shortly to confirm.
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-emerald-200/80 grid grid-cols-1 mobile:grid-cols-2 gap-2 text-xs text-emerald-800">
                      <div><strong className="text-emerald-950">Patient:</strong> {lastBooking.name}</div>
                      <div><strong className="text-emerald-950">Phone:</strong> {lastBooking.phone}</div>
                      <div><strong className="text-emerald-950">Date:</strong> {lastBooking.date}</div>
                      <div><strong className="text-emerald-950">Time:</strong> {lastBooking.time}</div>
                    </div>

                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
                    >
                      Book another appointment
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Booking Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                
                {/* Full Name & Phone Number Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-slate-800 font-semibold text-xs sm:text-sm mb-1.5">
                      Patient Full Name <span className="text-red-500">*</span>
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
                        placeholder="e.g. Ramesh Sharma"
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
                      <p className="mt-1 text-xs text-red-500 font-medium">Please enter your full name.</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-slate-800 font-semibold text-xs sm:text-sm mb-1.5">
                      10-Digit Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-200 text-slate-700 text-xs font-bold rounded-l-xl flex-shrink-0">
                        +91
                      </span>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="e.g. 9876543210"
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
                      <p className="mt-1 text-xs text-red-500 font-medium">Please enter a valid 10-digit mobile number.</p>
                    )}
                  </div>
                </div>

                {/* Doctor Selection */}
                <div>
                  <label htmlFor="doctor" className="block text-slate-800 font-semibold text-xs sm:text-sm mb-1.5">
                    Select Specialist Doctor <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FaUser className="text-xs" />
                    </div>
                    <select
                      id="doctor"
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      className="
                        w-full
                        h-12
                        bg-slate-50
                        border
                        border-slate-200
                        focus:border-teal-500
                        focus:ring-teal-500/20
                        rounded-xl
                        pl-10 pr-8
                        text-slate-900
                        focus:bg-white
                        focus:ring-2
                        outline-none
                        transition-all
                        text-xs sm:text-sm
                      "
                    >
                      <option value="Any Available Specialist">Any Available Specialist (Recommended)</option>
                      <option value="Dr. MD Rashid (PT)">Dr. MD Rashid (PT) - Consultant Physiotherapist</option>
                      <option value="Dr. Wajhul Qamar (PT)">Dr. Wajhul Qamar (PT) - Physiotherapist & Rehab Specialist</option>
                    </select>
                  </div>
                </div>

                {/* Health Condition / Treatment Dropdown */}
                <div>
                  <label htmlFor="condition" className="block text-slate-800 font-semibold text-xs sm:text-sm mb-1.5">
                    Select Condition / Treatment <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FaStethoscope className="text-xs" />
                    </div>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`
                        w-full
                        h-12
                        bg-slate-50
                        border
                        ${touched.condition && !isConditionValid ? "border-red-400 bg-red-50/20 focus:ring-red-400/20" : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"}
                        rounded-xl
                        pl-10 pr-8
                        text-slate-900
                        focus:bg-white
                        focus:ring-2
                        outline-none
                        transition-all
                        text-xs sm:text-sm
                      `}
                    >
                      <option value="" className="text-slate-400">
                        Choose condition or therapy ▼
                      </option>
                      <option value="Back Pain">Back Pain / Lower Spine Stiffness</option>
                      <option value="Neck Pain / Cervical">Neck Pain / Cervical Spondylosis</option>
                      <option value="Knee Pain / Arthritis">Knee Pain / Osteoarthritis</option>
                      <option value="Sciatica Pain">Sciatica Nerve Pain & Leg Radiating Pain</option>
                      <option value="Frozen Shoulder">Frozen Shoulder / Joint Restriction</option>
                      <option value="Cupping (Hijama) Therapy">Cupping (Hijama) Pain Therapy</option>
                      <option value="Dry Needling Therapy">Dry Needling / Trigger Point Release</option>
                      <option value="Stroke / Paralysis Rehab">Stroke / Neurological Paralysis Rehab</option>
                      <option value="Post-Surgery Rehabilitation">Post-Surgery Orthopedic Rehab</option>
                      <option value="Sports Injury Rehab">Sports Injury / Ligament Sprain</option>
                      <option value="Tennis Elbow">Tennis Elbow / Forearm Pain</option>
                      <option value="Plantar Fasciitis / Heel Pain">Plantar Fasciitis / Heel Pain</option>
                      <option value="General Physical Assessment">General Physical Pain Assessment</option>
                      <option value="Other Consultation">Other Musculoskeletal Condition</option>
                    </select>
                  </div>
                  {touched.condition && !isConditionValid && (
                    <p className="mt-1 text-xs text-red-500 font-medium">Please select a condition or therapy.</p>
                  )}
                </div>

                {/* Preferred Date & Custom Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label htmlFor="date" className="block text-slate-800 font-semibold text-xs sm:text-sm mb-1.5">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FaCalendarAlt className="text-xs" />
                      </div>
                      <input
                        id="date"
                        type="date"
                        name="date"
                        min={todayStr}
                        value={formData.date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`
                          w-full
                          h-12
                          bg-slate-50
                          border
                          ${touched.date && !isDateValid ? "border-red-400 bg-red-50/20 focus:ring-red-400/20" : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"}
                          rounded-xl
                          pl-10 pr-4
                          text-slate-900
                          focus:bg-white
                          focus:ring-2
                          outline-none
                          transition-all
                          text-xs sm:text-sm
                        `}
                      />
                    </div>
                    {touched.date && !isDateValid && (
                      <p className="mt-1 text-xs text-red-500 font-medium">Please select an appointment date.</p>
                    )}
                  </div>

                  {/* Time */}
                  <div>
                    <label htmlFor="time" className="block text-slate-800 font-semibold text-xs sm:text-sm mb-1.5">
                      Preferred Time Slot <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FaClock className="text-xs" />
                      </div>
                      <input
                        id="time"
                        type="text"
                        name="time"
                        placeholder="e.g. 10:30 AM or select below"
                        value={formData.time}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`
                          w-full
                          h-12
                          bg-slate-50
                          border
                          ${touched.time && !isTimeValid ? "border-red-400 bg-red-50/20 focus:ring-red-400/20" : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"}
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
                    {touched.time && !isTimeValid && (
                      <p className="mt-1 text-xs text-red-500 font-medium">Please select or type a preferred time.</p>
                    )}
                  </div>
                </div>

                {/* Quick Slot Pill Chips */}
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium mb-1.5">
                    Quick Time Slots:
                  </span>
                  <div className="grid grid-cols-2 mobile:grid-cols-3 sm:flex sm:flex-wrap gap-1.5">
                    {POPULAR_SLOTS.map((slot) => {
                      const isSelected = formData.time === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSlotSelect(slot)}
                          className={`
                            w-full sm:w-auto px-2.5 xs:px-3 py-1.5 rounded-lg text-[11px] xs:text-xs font-semibold transition-all duration-150
                            ${isSelected
                              ? "bg-teal-600 text-white shadow-sm ring-2 ring-teal-600/30"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"}
                          `}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message / Symptoms Notes */}
                <div>
                  <label htmlFor="message" className="block text-slate-800 font-semibold text-xs sm:text-sm mb-1.5">
                    Brief Symptoms / Pain Details <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3.5 text-slate-400 pointer-events-none">
                      <FaCommentDots className="text-xs" />
                    </div>
                    <textarea
                      id="message"
                      rows={3}
                      name="message"
                      placeholder="Describe your pain duration, stiffness, or any previous doctor reports..."
                      value={formData.message}
                      onChange={handleChange}
                      className="
                        w-full
                        bg-slate-50
                        border
                        border-slate-200
                        rounded-xl
                        pl-10 pr-4 py-2.5
                        text-slate-900
                        placeholder:text-slate-400
                        focus:bg-white
                        focus:border-teal-500
                        focus:ring-2
                        focus:ring-teal-500/20
                        resize-none
                        outline-none
                        transition-all
                        text-xs sm:text-sm
                      "
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    min-h-13
                    h-auto
                    py-3.5
                    bg-gradient-to-r
                    from-teal-600
                    to-teal-700
                    hover:from-teal-700
                    hover:to-teal-800
                    active:from-teal-800
                    active:to-teal-900
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
                      <span>Confirming Your Session...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="text-base text-teal-200" />
                      <span>Confirm Appointment Now</span>
                    </>
                  )}
                </button>

                {/* Guarantee Pill */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 pt-1 text-center">
                  <FaShieldAlt className="text-teal-600" />
                  <span>Direct SMS / WhatsApp notification to clinic • Priority Session</span>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
