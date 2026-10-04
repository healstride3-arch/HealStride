import { motion } from "framer-motion";
import { Calendar, ArrowRight, HeartPulse, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CTA = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#d71920] via-teal-800 to-[#008272] overflow-hidden">
      {/* Background Decorative Heartbeat / Pulse Watermark */}
      <div className="absolute right-2 sm:right-8 lg:right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-10 text-white">
        <HeartPulse size={260} strokeWidth={1.2} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t("cta.title", "Start Your Pain-Free Journey Today")}
          </h2>

          <p className="mt-4 text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            {t(
              "cta.subtitle",
              "Our experienced physiotherapists are ready to help you recover, move better, and live healthier."
            )}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/booking"
              className="group inline-flex items-center justify-center gap-2 bg-white text-[#d71920] hover:text-[#008272] hover:bg-slate-50 px-7 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer text-sm sm:text-base w-full sm:w-auto"
            >
              <Calendar className="w-4 h-4 text-inherit transition-colors" />
              <span>{t("cta.bookBtn", "Book Appointment")}</span>
              <ArrowRight className="w-4 h-4 text-inherit transition-colors group-hover:translate-x-0.5" />
            </Link>

            <a
              href="tel:+918809491380"
              className="group inline-flex items-center justify-center gap-2.5 border-2 border-white text-white hover:bg-white hover:text-[#008272] px-7 py-3 rounded-full font-bold hover:scale-105 transition-all duration-200 cursor-pointer text-sm sm:text-base w-full sm:w-auto"
            >
              <PhoneCall className="w-4 h-4 text-emerald-300 group-hover:text-[#008272] transition-colors shrink-0" />
              <span>{t("cta.callBtn", "Call Us Now")}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;