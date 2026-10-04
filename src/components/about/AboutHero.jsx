import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, ArrowRight, ShieldCheck, CheckCircle2, Star } from "lucide-react";
import AnimatedCounter from "../common/AnimatedCounter";

const AboutHero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-h-[calc(100vh-90px)] flex flex-col justify-center py-6 sm:py-8 lg:py-10 overflow-hidden border-b border-slate-800 bg-slate-950">
      {/* Background Photo - Visible with Dark Overlay */}
      <div className="absolute inset-0">
        <img
          src="/about.jpg"
          alt="Heal Stride Physiotherapy Clinic Bhopal"
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 shadow-lg mb-3 sm:mb-4 w-fit backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#d71920] animate-pulse" />
            <span className="uppercase tracking-wider font-bold text-xs text-teal-300">
              {t("aboutHero.badge", "About Heal Stride Physiotherapy • Bhopal")}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-white tracking-tight leading-tight">
            About{" "}
            <span className="bg-gradient-to-r from-red-400 via-rose-300 to-teal-300 bg-clip-text text-transparent">
              Heal Stride
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl leading-relaxed font-normal">
            {t(
              "aboutHero.subtitle",
              "Dedicated to helping patients recover faster, move better, and live pain-free lives through personalized physiotherapy, advanced rehabilitation techniques, and compassionate care."
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

            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-5 py-3.5 min-h-[46px] rounded-xl border border-white/20 backdrop-blur-md shadow-md transition-all cursor-pointer"
            >
              <span>Our 15+ Treatments</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Trust Checkmarks */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Certified Physiotherapy</span>
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

          {/* 4 Stats Cards with Bidirectional Animated Counters */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 max-w-4xl mx-auto items-stretch">
            {/* Card 1: 5+ Years Experience */}
            <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-red-500/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
              <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-red-400 whitespace-nowrap">
                  <AnimatedCounter target={5} suffix="+" duration={1.2} />
                </p>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                {t("aboutHero.yearsExp", "Years Experience")}
              </p>
            </div>

            {/* Card 2: 2500+ Happy Patients */}
            <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-teal-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
              <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-teal-400 whitespace-nowrap">
                  <AnimatedCounter target={2500} suffix="+" duration={1.6} />
                </p>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                {t("aboutHero.happyPatients", "Happy Patients")}
              </p>
            </div>

            {/* Card 3: 98% Recovery Rate */}
            <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-amber-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
              <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 whitespace-nowrap">
                  <AnimatedCounter target={98} suffix="%" duration={1.4} />
                </p>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                {t("hero.statSuccessRate", "Success Rate")}
              </p>
            </div>

            {/* Card 4: Expert Care */}
            <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-cyan-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
              <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-cyan-300 whitespace-nowrap">
                  {t("aboutHero.expertTag", "Expert")}
                </p>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                {t("aboutHero.expertCare", "Physiotherapy Care")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;