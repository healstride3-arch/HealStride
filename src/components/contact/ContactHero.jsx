import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Phone, Calendar, Clock, MapPin, MessageSquare, CheckCircle2, ShieldCheck, Star } from "lucide-react";

const ContactHero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-h-[calc(100vh-90px)] flex flex-col justify-center py-6 sm:py-8 lg:py-10 overflow-hidden border-b border-slate-800 bg-slate-950">
      {/* Full-Width Background Photo */}
      <div className="absolute inset-0">
        <img
          src="/contact-hero-bg.jpg"
          alt="Heal Stride Physiotherapy Bhopal Clinic Reception and Board"
          className="w-full h-full object-cover object-center opacity-45 brightness-90 contrast-110"
        />
      </div>

      {/* Dark Gradient Overlay for Maximum Text Clarity */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950/95" />

      {/* Subtle brand ambient glow accents */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-red-600/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-teal-500/15 blur-3xl rounded-full pointer-events-none" />

      {/* Content Container - Vertically centered with ample breathing room */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 shadow-lg mb-3 sm:mb-3.5 w-fit backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#d71920] animate-pulse" />
            <span className="uppercase tracking-wider font-bold text-xs text-teal-300">
              {t("contactHero.badge", "Contact & Consultation Desk • Bhopal")}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-white tracking-tight leading-tight">
            {t("contactHero.title", "Get in Touch with Our Specialists at")}{" "}
            <span className="bg-gradient-to-r from-red-400 via-rose-300 to-teal-300 bg-clip-text text-transparent">
              Heal Stride
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl leading-relaxed font-normal">
            {t(
              "contactHero.subtitle",
              "Have questions about back pain, sports injuries, or cupping therapy? Call, WhatsApp, or visit our clinic in Bhopal."
            )}
          </p>

          {/* Action Buttons: Direct Booking to /booking */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e] active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-6 py-3.5 min-h-[46px] rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Calendar size={16} className="shrink-0" />
              <span>Book Appointment</span>
            </Link>

            <a
              href="tel:+918809491380"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-5 py-3.5 min-h-[46px] rounded-xl border border-white/20 backdrop-blur-md shadow-md transition-all cursor-pointer"
            >
              <Phone size={15} className="text-red-400" />
              <span>Call: +91 88094 91380</span>
            </a>
          </div>

          {/* Trust Checkmarks */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Instant Doctor Response</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-teal-400 shrink-0" />
              <span>100% Non-Surgical Care</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Star size={14} className="fill-amber-400 text-amber-400 shrink-0" />
              <span>5.0 Rated in Bhopal</span>
            </span>
          </div>

          {/* 4 Contact Quick Cards */}
          {/* 4 Quick Info Cards - Center Aligned */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 max-w-4xl mx-auto text-center items-stretch">
            {/* Card 1: Phone */}
            <a
              href="tel:+918809491380"
              className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-white/15 shadow-xl hover:border-red-500/50 hover:bg-slate-800/90 transition-all flex flex-col items-center justify-center text-center h-full min-h-[92px] sm:min-h-[102px] group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center mb-1.5 mx-auto">
                <Phone size={16} />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Direct Call
              </p>
              <p className="text-xs sm:text-sm font-black text-white mt-0.5 group-hover:text-red-400 transition-colors whitespace-nowrap">
                88094 91380
              </p>
            </a>

            {/* Card 2: WhatsApp */}
            <a
              href="https://wa.me/918252580389?text=Hello%20Heal%20Stride%20Clinic,%20I%20would%20like%20to%20book%20an%20appointment"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-white/15 shadow-xl hover:border-teal-400/50 hover:bg-slate-800/90 transition-all flex flex-col items-center justify-center text-center h-full min-h-[92px] sm:min-h-[102px] group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center mb-1.5 mx-auto">
                <MessageSquare size={16} />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                WhatsApp
              </p>
              <p className="text-xs sm:text-sm font-black text-white mt-0.5 group-hover:text-teal-300 transition-colors whitespace-nowrap">
                82525 80389
              </p>
            </a>

            {/* Card 3: Hours */}
            <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-white/15 shadow-xl hover:border-amber-400/50 hover:bg-slate-800/90 transition-all flex flex-col items-center justify-center text-center h-full min-h-[92px] sm:min-h-[102px]">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center mb-1.5 mx-auto">
                <Clock size={16} />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Clinic Hours
              </p>
              <p className="text-xs sm:text-sm font-black text-white mt-0.5 whitespace-nowrap">
                9 AM - 9 PM
              </p>
            </div>

            {/* Card 4: Location */}
            <a
              href="https://maps.google.com/?q=Heal+Stride+Physiotherapy+Bhopal"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-white/15 shadow-xl hover:border-cyan-400/50 hover:bg-slate-800/90 transition-all flex flex-col items-center justify-center text-center h-full min-h-[92px] sm:min-h-[102px] group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-1.5 mx-auto">
                <MapPin size={16} />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Location
              </p>
              <p className="text-xs sm:text-sm font-black text-white mt-0.5 group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                Raisen Rd, Bhopal
              </p>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactHero;