import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench, ShieldCheck, Clock, Award, Activity } from "lucide-react";
import ServicesGrid from "../components/service/ServicesGrid";
import ServicesCTA from "../components/service/ServicesCTA";

const Services = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950 text-white py-14 sm:py-20 overflow-hidden">
        {/* Subtle decorative glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 backdrop-blur-md">
              HealStride Physiotherapy & Wellness Centre
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-teal-200 via-white to-teal-300 bg-clip-text text-transparent">
              Our Specialized Services
            </h1>

            <p className="mt-4 text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Evidence-based treatments, pain management therapies, and personalized rehabilitation programs designed to help you recover fast and live pain-free.
            </p>

            {/* Key Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                <Award className="w-4 h-4 text-teal-400" />
                <span>Certified Doctors (BPT)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>100% Non-Invasive</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Fast Pain Relief</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advanced Equipment Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-teal-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 text-xl">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Advanced Tools & Equipment
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                Explore our modern rehabilitation machines, electrotherapy devices & physical therapy equipment.
              </p>
            </div>
          </div>

          <Link
            to="/services/tools-equipment"
            className="inline-flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors border border-teal-200 flex-shrink-0"
          >
            <span>Explore Equipment</span>
            <span>→</span>
          </Link>
        </motion.div>
      </section>

      {/* Full 16 Services Grid with Tabs & Search */}
      <ServicesGrid />

      {/* Booking CTA Section */}
      <ServicesCTA />
    </div>
  );
};

export default Services;