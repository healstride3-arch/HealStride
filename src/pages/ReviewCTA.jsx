import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, PhoneCall, CheckCircle2, ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const ReviewCTA = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-teal-50/40 to-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3"
        >
          <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
          <span>START YOUR RECOVERY TODAY</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight"
        >
          Start Your <span className="text-teal-600">Pain-Free Journey</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-3.5 sm:mt-4 text-slate-600 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed"
        >
          Don't let chronic back pain, joint stiffness, or sports injuries limit your life. Get expert physiotherapy evaluation & targeted relief from Dr. MD Rashid and our team in Bhopal.
        </motion.p>

        {/* Value Props / Trust points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mt-5 text-xs sm:text-sm text-slate-700 font-medium"
        >
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-teal-100 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Root-Cause Assessment</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-teal-100 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Advanced Physiotherapy Modalities</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-teal-100 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Dedicated 1-on-1 Care</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 flex flex-wrap justify-center items-center gap-3.5 sm:gap-4"
        >
          <Link
            to="/booking"
            aria-label="Book an Appointment"
            className="
              group
              inline-flex
              items-center
              gap-2.5
              bg-teal-600
              hover:bg-teal-700
              active:bg-teal-800
              text-white
              px-5
              xs:px-7
              py-3.5
              rounded-xl
              font-semibold
              transition-all
              duration-200
              shadow-md
              hover:shadow-lg
              text-xs
              xs:text-sm
              sm:text-base
            "
          >
            <Calendar size={18} />
            <span>Book Consultation</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

          <a
            href="https://wa.me/918809491380?text=Hello%20HealStride%20Physiotherapy,%20I%20would%20like%20to%20book%20a%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              gap-2.5
              bg-emerald-600
              hover:bg-emerald-700
              text-white
              px-5
              xs:px-6
              py-3.5
              rounded-xl
              font-semibold
              transition-all
              duration-200
              shadow-sm
              hover:shadow-md
              text-xs
              xs:text-sm
              sm:text-base
            "
          >
            <FaWhatsapp size={18} />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href="tel:+918809491380"
            className="
              inline-flex
              items-center
              gap-2.5
              bg-white
              hover:bg-slate-50
              text-slate-800
              border
              border-slate-200
              hover:border-teal-500
              px-5
              xs:px-6
              py-3.5
              rounded-xl
              font-semibold
              transition-all
              duration-200
              shadow-sm
              text-xs
              xs:text-sm
              sm:text-base
            "
          >
            <PhoneCall size={18} className="text-teal-600" />
            <span>Call Now</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewCTA;
