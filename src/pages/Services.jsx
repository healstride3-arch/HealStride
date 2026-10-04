import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench, ShieldCheck, Award, Calendar, ArrowRight, CheckCircle2, Star, ChevronRight } from "lucide-react";
import ServicesGrid from "../components/service/ServicesGrid";
import ServicesCTA from "../components/service/ServicesCTA";
import SEO from "../components/common/SEO";
import AnimatedCounter from "../components/common/AnimatedCounter";

const Services = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title="Physiotherapy Treatments & Services in Bhopal"
        description="Explore evidence-based physiotherapy treatments at Heal Stride Bhopal: Sports injury rehabilitation, cupping therapy, dry needling, spinal decompression, sciatica relief, and post-surgery care."
        keywords="Physiotherapy Services Bhopal, Cupping Therapy Bhopal, Dry Needling Bhopal, Sports Injury Rehabilitation, Spinal Decompression, Sciatica Treatment Bhopal"
      />

      {/* Full-Width Background Banner with Dark Overlay */}
      <section className="relative w-full min-h-[calc(100vh-90px)] flex flex-col justify-center py-6 sm:py-8 lg:py-10 overflow-hidden border-b border-slate-800 bg-slate-950">
        {/* Full-Width Clinic Background Photo */}
        <div className="absolute inset-0">
          <img
            src="/services-hero-bg.jpg"
            alt="Physiotherapy Services at Heal Stride Bhopal"
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
            {/* Pill Chip Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 shadow-lg mb-3 sm:mb-3.5 w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#d71920] animate-pulse" />
              <span className="uppercase tracking-wider font-bold text-xs text-teal-300">
                Specialized Clinical Treatments • Bhopal
              </span>
            </div>

            {/* Main Headline - Flows naturally in 2 compact lines */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-white tracking-tight leading-tight">
              Evidence-Based Physiotherapy &amp;{" "}
              <span className="bg-gradient-to-r from-red-400 via-rose-300 to-teal-300 bg-clip-text text-transparent">
                Non-Surgical Pain Relief
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl leading-relaxed font-normal">
              Explore 15+ specialized treatment therapies designed to eliminate pain, rehabilitate injuries, restore mobility, and rebuild long-term strength.
            </p>

            {/* Direct Booking to /booking */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                <Calendar size={16} className="shrink-0" />
                <span>Book Appointment</span>
              </Link>

              <Link
                to="/services/tools-equipment"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/20 backdrop-blur-md shadow-md transition-all cursor-pointer"
              >
                <Wrench size={15} />
                <span>Advanced Equipment</span>
              </Link>
            </div>

            {/* Trust Checkmarks */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Certified Doctors (BPT/MPT)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-teal-400 shrink-0" />
                <span>100% Non-Invasive</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Star size={14} className="fill-amber-400 text-amber-400 shrink-0" />
                <span>5.0 Rated in Bhopal</span>
              </span>
            </div>

            {/* 4 Cards - Uniform 1-Line Layout */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 max-w-4xl mx-auto items-stretch">
              {/* Card 1: 15+ Treatments */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-red-500/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-red-400 whitespace-nowrap">
                    <AnimatedCounter target={15} suffix="+" duration={1.2} />
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Clinical Services
                </p>
              </div>

              {/* Card 2: 100% Non-Invasive */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-teal-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-teal-400 whitespace-nowrap">
                    <AnimatedCounter target={100} suffix="%" duration={1.5} />
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Non-Surgical Care
                </p>
              </div>

              {/* Card 3: 5000+ Treatments Done */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-amber-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 whitespace-nowrap">
                    <AnimatedCounter target={5000} suffix="+" duration={1.7} />
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Patients Relieved
                </p>
              </div>

              {/* Card 4: Certified Specialists */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-cyan-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-cyan-300 whitespace-nowrap">
                    Expert
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Certified Doctors
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advanced Equipment Highlight Banner - Centered */}
      <section className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-9 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-teal-500/30 flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 shadow-md text-center md:text-left"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 text-xl mx-auto sm:mx-0 shadow-sm">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Advanced Tools &amp; Equipment
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                Explore our modern rehabilitation machines, electrotherapy devices &amp; physical therapy equipment.
              </p>
            </div>
          </div>

          <Link
            to="/services/tools-equipment"
            className="inline-flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors border border-teal-200 flex-shrink-0 shadow-sm"
          >
            <span>Explore Equipment</span>
            <span>→</span>
          </Link>
        </motion.div>
      </section>

      {/* Full 15 Services Grid with Tabs & Search */}
      <ServicesGrid />

      {/* Booking CTA Section */}
      <ServicesCTA />
    </div>
  );
};

export default Services;