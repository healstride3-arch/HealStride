import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CalendarCheck,
  Phone,
  Home as HomeIcon,
  Zap,
  ShieldCheck,
  HeartPulse,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import homePhysioImg from "../../assets/images/services/home-physiotherapy-main.jpg";
import SectionHeader from "../common/SectionHeader";

const HomePhysiotherapySection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: HomeIcon,
      color: "text-[#008272] bg-teal-50",
      title: t("homePhysioSection.f1Title", "Comfort of Your Home"),
      desc: t(
        "homePhysioSection.f1Desc",
        "Recover in a familiar, stress-free environment with no travel or waiting."
      ),
    },
    {
      icon: Zap,
      color: "text-[#d71920] bg-red-50",
      title: t("homePhysioSection.f2Title", "Advanced Portable Tech"),
      desc: t(
        "homePhysioSection.f2Desc",
        "Digital TENS, Ultrasound, cupping & therapy tools brought to your room."
      ),
    },
    {
      icon: ShieldCheck,
      color: "text-[#008272] bg-teal-50",
      title: t(
        "homePhysioSection.f3Title",
        "Certified Male & Female Therapists"
      ),
      desc: t(
        "homePhysioSection.f3Desc",
        "Experienced, background-verified specialists for personalized care."
      ),
    },
    {
      icon: HeartPulse,
      color: "text-rose-600 bg-rose-50",
      title: t("homePhysioSection.f4Title", "Post-Op & Elderly Care"),
      desc: t(
        "homePhysioSection.f4Desc",
        "Specialized protocols for joint replacement, stroke rehab & neurological recovery."
      ),
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-slate-50/70 to-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1"
          >
            <SectionHeader
              badge={t("homePhysioSection.badge", "Home Visit Physiotherapy")}
              title={t(
                "homePhysioSection.title",
                "Best Home Physiotherapy in Bhopal — Now at Your Home"
              )}
              subtitle={t(
                "homePhysioSection.subtitle",
                "Unable to visit our clinic due to acute pain, post-surgical recovery, or elderly mobility challenges? Heal Stride brings certified physiotherapists and modern portable rehabilitation equipment directly to your doorstep in Bhopal."
              )}
              align="left"
              animate={false}
              className="mb-4 sm:mb-6"
            />

            {/* 4 Feature Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-4 mt-6">
              {features.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all text-left flex items-start gap-3"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
                    >
                      <IconComponent size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Buttons & Quick Call */}
            <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center justify-center lg:justify-start gap-2.5 sm:gap-4 mt-6 sm:mt-8">
              <Link
                to="/booking?service=home-physiotherapy"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d71920] to-[#008272] hover:opacity-95 text-white font-bold px-4 xs:px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-xs sm:text-sm shadow-sm transition-all text-center"
              >
                <CalendarCheck size={16} className="shrink-0" />
                <span>{t("homePhysioSection.bookVisit", "Book Your Home Visit")}</span>
              </Link>

              <a
                href="tel:+918809491380"
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 xs:px-5 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-xs sm:text-sm shadow-sm transition-all text-center"
              >
                <Phone size={15} className="shrink-0 text-emerald-400" />
                <span>+91 88094 91380</span>
              </a>

              <Link
                to="/services/home-physiotherapy"
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold px-4 xs:px-5 py-2.5 sm:py-3 min-h-[44px] rounded-xl text-xs sm:text-sm shadow-xs transition-all text-center"
              >
                <span>View Details</span>
                <ArrowRight size={15} className="shrink-0" />
              </Link>
            </div>
          </motion.div>

          {/* Right: Realistic Clinical Photo */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 w-full flex flex-col items-center lg:items-end justify-center order-1 lg:order-2"
          >
            <div className="relative w-full max-w-[340px] xs:max-w-[420px] sm:max-w-[460px] mx-auto lg:mx-0">
              {/* Decorative aura */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-teal-500/15 via-rose-500/10 to-teal-500/15 rounded-3xl blur-xl opacity-80" />

              <div className="relative overflow-hidden rounded-3xl border border-teal-100 shadow-xl bg-white group">
                <img
                  src={homePhysioImg}
                  alt="Best Home Physiotherapy in Bhopal by Heal Stride"
                  className="w-full h-[280px] xs:h-[360px] sm:h-[400px] lg:h-[460px] object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />

                {/* Top Badge overlay */}
                <div className="absolute top-2.5 xs:top-3.5 left-2.5 xs:left-3.5 bg-white/95 backdrop-blur-md px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-full border border-teal-200 shadow-sm flex items-center gap-1.5 max-w-[calc(100%-1.5rem)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[10px] xs:text-[11px] font-bold text-slate-800 truncate">
                    Doorstep Physiotherapy in Bhopal
                  </span>
                </div>

                {/* Bottom Overlaid feature banner */}
                <div className="absolute bottom-2.5 xs:bottom-3 left-2.5 xs:left-3 right-2.5 xs:right-3 bg-slate-900/90 backdrop-blur-md text-white p-2.5 xs:p-3.5 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 xs:gap-2.5 min-w-0">
                    <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-400/30">
                      <Sparkles size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight truncate">
                        Certified Therapists &amp; Equipment
                      </p>
                      <p className="text-[9.5px] xs:text-[10px] text-slate-300 leading-tight mt-0.5 truncate">
                        Portable TENS, IFT, ultrasound &amp; kit
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[9.5px] xs:text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 xs:px-2 py-0.5 rounded-md">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coverage Tag Below Photo */}
            <div className="w-full max-w-[460px] mt-3.5 px-1 sm:px-2 flex items-center justify-center lg:justify-start gap-2 text-[11px] sm:text-xs text-slate-600">
              <MapPin size={14} className="text-[#d71920] shrink-0" />
              <span className="text-center lg:text-left leading-relaxed">{t("homePhysioSection.serviceAreas")}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomePhysiotherapySection;
