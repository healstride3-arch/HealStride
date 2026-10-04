import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Phone, Calendar, CheckCircle2, Star, ArrowRight, ShieldCheck, Award } from "lucide-react";
import { toast } from "react-hot-toast";

import drRashidImage from "../../assets/images/Dr.MD.Rashid.png";
import { saveAppointmentToFirestore } from "../../services/appointmentSubmissionService";
import AnimatedCounter from "../common/AnimatedCounter";

const Hero = () => {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      await saveAppointmentToFirestore({
        name: "Quick Callback Request",
        phone: cleanPhone,
        service: "General Consultation & Pain Relief Callback",
        preferredDate: new Date().toISOString().split("T")[0],
        preferredTime: "Urgent Callback",
        source: "Landing Page Hero Callback Box",
        status: "pending",
        notes: `Immediate callback requested by user at phone +91 ${cleanPhone}`,
      });

      toast.success("Callback requested! Dr. Rashid's team will contact you shortly.", {
        duration: 4000,
      });

      // Direct WhatsApp lead trigger
      const whatsappUrl = `https://wa.me/918809491380?text=${encodeURIComponent(
        `Hello Heal Stride Clinic, I would like to request an instant callback regarding physiotherapy consultation. My phone number is +91 ${cleanPhone}.`
      )}`;
      window.open(whatsappUrl, "_blank");

      setPhoneNumber("");
    } catch (err) {
      console.error("Callback submission error:", err);
      window.location.href = `tel:+918809491380`;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative w-full pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-10 lg:pb-14 bg-gradient-to-b from-white via-slate-50/70 to-teal-50/20 border-b border-slate-200/80 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-10 w-[500px] h-[500px] bg-red-100/35 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-[550px] h-[550px] bg-teal-100/40 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-50/40 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Main Container with generous professional padding */}
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 xl:px-14">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">

          {/* Left Column: Heading, Subtitle, Stats Cards & Callback Bar (7 Columns) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            {/* Pill Chip Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-teal-50/90 border border-teal-200/90 shadow-2xs mb-3.5 sm:mb-4 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#d71920] animate-pulse" />
              <span className="uppercase tracking-wider font-bold text-[11px] sm:text-xs text-teal-800">
                {t("hero.badge", "Bhopal's Leading Physiotherapy & Wellness Clinic")}
              </span>
            </div>

            {/* Main Heading: Welcome to Heal Stride */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[46px] xl:text-[54px] font-black text-slate-900 tracking-tight leading-[1.12]">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-[#d71920] to-[#008272] bg-clip-text text-transparent">
                Heal Stride
              </span>
            </h1>

            {/* Tagline / Subtitle */}
            <p className="mt-2 sm:mt-3 text-base sm:text-xl lg:text-2xl font-bold text-slate-800 leading-snug">
              Bhopal&apos;s #1 Non-Surgical Pain Management Clinic
            </p>

            <p className="mt-1 text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed max-w-xl">
              Specialized in Advanced Sports Rehabilitation, Certified Cupping, Dry Needling &amp; Non-Invasive Orthopedic Pain Relief.
            </p>

            {/* 4 Stats Cards with Bidirectional Animated Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-5 sm:mt-6 max-w-xl sm:max-w-2xl">
              {/* Card 1: 5+ Years Experience */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
                <p className="text-2xl sm:text-3xl font-black text-[#d71920]">
                  <AnimatedCounter target={5} suffix="+" duration={1.2} />
                </p>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-1 font-semibold leading-tight">
                  {t("aboutHero.yearsExp", "Years Experience")}
                </p>
              </div>

              {/* Card 2: 2500+ Happy Patients */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
                <p className="text-2xl sm:text-3xl font-black text-[#008272]">
                  <AnimatedCounter target={2500} suffix="+" duration={1.6} />
                </p>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-1 font-semibold leading-tight">
                  {t("aboutHero.happyPatients", "Happy Patients")}
                </p>
              </div>

              {/* Card 3: 98% Success Rate */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
                <p className="text-2xl sm:text-3xl font-black text-[#D97706]">
                  <AnimatedCounter target={98} suffix="%" duration={1.4} />
                </p>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-1 font-semibold leading-tight">
                  {t("hero.statSuccessRate", "Success Rate")}
                </p>
              </div>

              {/* Card 4: Expert Physiotherapy Care */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
                <p className="text-2xl sm:text-3xl font-black text-teal-800">
                  {t("aboutHero.expertTag", "Expert")}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-1 font-semibold leading-tight">
                  {t("aboutHero.expertCare", "Physiotherapy Care")}
                </p>
              </div>
            </div>

            {/* Quick Callback Box (High-Converting Yellow Button) */}
            <div className="mt-5 sm:mt-7 max-w-xl">
              <form
                onSubmit={handleCallbackSubmit}
                className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 bg-white p-1 sm:p-1.5 rounded-2xl border border-slate-300 shadow-sm focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all"
              >
                {/* +91 Country Badge */}
                <div className="flex items-center justify-center px-4 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-slate-200 text-slate-800 font-extrabold text-sm sm:text-base shrink-0 bg-slate-50/80 sm:bg-transparent rounded-t-xl sm:rounded-none">
                  <span>+91</span>
                </div>

                {/* Mobile Input */}
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter Your Mobile Number"
                  className="flex-1 px-3.5 sm:px-4 py-2.5 sm:py-3 text-slate-900 placeholder:text-slate-400 font-medium text-xs sm:text-sm outline-none bg-transparent"
                  required
                />

                {/* Logo Gradient Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e] active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer"
                >
                  <Phone size={15} className="fill-white text-white shrink-0" />
                  <span>{submitting ? "Requesting..." : "Request A Callback"}</span>
                </button>
              </form>

              {/* Trust badges */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>Instant Doctor Response</span>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={13} className="text-teal-700 shrink-0" />
                  <span>100% Non-Surgical Care</span>
                </span>
                <span className="flex items-center gap-1">
                  <Star size={13} className="fill-amber-400 text-amber-400 shrink-0" />
                  <span>5.0 Rated in Bhopal</span>
                </span>
              </div>

              {/* Direct Booking & Phone Links */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Direct connect:</span>
                  <a
                    href="tel:+918809491380"
                    className="font-bold text-[#d71920] hover:underline flex items-center gap-1"
                  >
                    <span>+91 88094 91380</span>
                  </a>
                </div>

                <Link
                  to="/booking"
                  className="inline-flex items-center gap-1.5 font-bold text-[#008272] hover:text-[#0f766e] transition-colors"
                >
                  <Calendar size={13} />
                  <span>Book Appointment Online</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Founder & Chief Physiotherapist Dr. MD Rashid in Designer Frame (5 Columns) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center relative"
          >
            {/* Ambient behind-glow specifically framing the doctor photo */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-teal-400/25 via-red-400/15 to-amber-300/20 blur-2xl rounded-[3rem] pointer-events-none" />

            <div className="relative w-full max-w-[380px] sm:max-w-[400px] lg:max-w-[420px] rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-white group ring-1 ring-slate-200/60">
              {/* Doctor's Photo */}
              <div className="relative h-[360px] xs:h-[400px] sm:h-[440px] lg:h-[460px] w-full overflow-hidden bg-slate-100">
                <img
                  src={drRashidImage}
                  alt="Dr. MD Rashid (PT) - Lead Physiotherapist and Founder of Heal Stride"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Top-Left Review Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200/80 flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>5.0 (43+ Google Reviews)</span>
                </div>

                {/* Floating Top-Right Experience Badge */}
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md border border-white/10 flex items-center gap-1 text-[10px] font-bold text-teal-300">
                  <Award size={12} className="text-teal-300" />
                  <span>5+ Yrs Exp</span>
                </div>
              </div>

              {/* Bottom Credential Bar */}
              <div className="p-3.5 sm:p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#008272] font-black text-sm shrink-0 shadow-2xs">
                    PT
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        Dr. MD Rashid (PT)
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    </div>
                    <p className="text-[10px] sm:text-xs text-teal-700 font-semibold truncate">
                      MPT (Sports) • Founder &amp; Chief Specialist
                    </p>
                  </div>
                </div>

                <Link
                  to="/doctors/dr-md-rashid"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition shrink-0 border border-teal-200/70"
                >
                  <span>Profile</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
