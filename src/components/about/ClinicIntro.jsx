import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle, CalendarCheck, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import drRashidImage from "../../assets/images/Dr.MD.Rashid.png";
import SectionHeader from "../common/SectionHeader";

const featureKeys = [
  "clinicIntro.f1",
  "clinicIntro.f2",
  "clinicIntro.f3",
  "clinicIntro.f4",
];

const ClinicIntro = ({ isHome = false }) => {
  const { t } = useTranslation();

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Dr. Rashid Image Card */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 w-full flex justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-[380px] sm:max-w-[420px]">
              {/* Decorative subtle ambient glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-teal-500/10 via-rose-500/10 to-teal-500/10 rounded-3xl blur-lg opacity-70" />

              <div className="relative overflow-hidden rounded-3xl border border-teal-100 shadow-md bg-gradient-to-b from-teal-50/60 to-white">
                <img
                  src={drRashidImage}
                  alt="Dr. MD Rashid (PT) - Lead Physiotherapist"
                  className="w-full h-[360px] sm:h-[420px] lg:h-[450px] object-cover object-top hover:scale-102 transition-transform duration-300"
                />

                {/* Overlaid Doctor Info Tag */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-md flex items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
                      Dr. MD Rashid (PT)
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#008272] font-semibold leading-tight mt-0.5 truncate">
                      Senior Consultant | MPT (Sports)
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      ★ 4.7 (43+ Reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-center lg:text-left mt-2 lg:mt-0"
          >
            <SectionHeader
              badge={t("clinicIntro.badge", "Clinic Introduction")}
              title={
                isHome
                  ? t("clinicIntro.homeTitle", "Dedicated to Your Pain-Free Life")
                  : t("clinicIntro.title", "Welcome to Heal Stride")
              }
              subtitle={t("clinicIntro.desc")}
              align="left"
              animate={false}
              className="mb-4 sm:mb-6"
            />

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-3.5 mt-6">
              {featureKeys.map((key, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 bg-slate-50/90 rounded-xl p-3 border border-slate-100 text-left hover:border-teal-200 transition-colors"
                >
                  <CheckCircle
                    size={18}
                    className="text-[#008272] shrink-0"
                  />
                  <span className="text-slate-800 font-semibold text-xs sm:text-sm">
                    {t(key)}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mt-8">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d71920] to-[#008272] hover:opacity-95 text-white font-bold px-5 py-2.5 min-h-[42px] rounded-xl text-sm shadow-sm transition-all"
              >
                <CalendarCheck size={16} className="shrink-0" />
                <span>{t("navbar.bookAppointment", "Book Appointment")}</span>
              </Link>
              {isHome ? (
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-2.5 min-h-[42px] rounded-xl text-sm transition-all"
                >
                  <span>{t("common.learnMore", "Learn More About Us")}</span>
                  <ArrowRight size={15} className="shrink-0" />
                </Link>
              ) : (
                <Link
                  to="/doctors"
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-2.5 min-h-[42px] rounded-xl text-sm transition-all"
                >
                  <span>{t("navbar.doctors", "Meet Our Specialists")}</span>
                  <ArrowRight size={15} className="shrink-0" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClinicIntro;