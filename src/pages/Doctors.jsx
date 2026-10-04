import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CalendarCheck, ArrowRight, ShieldCheck, Award, HeartPulse, UserRound, Calendar, Phone } from "lucide-react";
import AnimatedCounter from "../components/common/AnimatedCounter";
import { doctors as defaultDoctors, getDoctorLocalizedName } from "../data/team";
import { useFirestoreCollection, where } from "../hooks/useFirestoreCollection";
import { useFirestoreDoc } from "../hooks/useFirestoreDoc";
import SEO from "../components/common/SEO";
import SectionHeader from "../components/common/SectionHeader";

const Doctors = () => {
  const { t, i18n } = useTranslation();
  const { items: rawDoctors } = useFirestoreCollection("doctors", {
    fallback: defaultDoctors,
  });
  const doctors = rawDoctors.filter((d) => d.active !== false);
  const { doc: clinicSettings } = useFirestoreDoc("settings", "clinic");

  const phoneRaw = (clinicSettings?.phone || "8809491380").replace(/[^0-9]/g, "");
  const whatsappRaw = (clinicSettings?.whatsapp || "8252580389").replace(/[^0-9]/g, "");

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO
        title="Meet Our Expert Physiotherapists in Bhopal"
        description="Meet Dr. MD Rashid (MPT Sports) and our certified physiotherapy team at Heal Stride Bhopal. Specialized in sports rehabilitation, dry needling, cupping, and non-invasive pain relief."
        keywords="Physiotherapist in Bhopal, Dr MD Rashid, Dr Wajhul Qamar, Sports Physiotherapy Bhopal, Cupping Specialist Bhopal, Dry Needling Bhopal"
      />
      {/* Full-Width Background Banner with Dark Overlay */}
      <section className="relative w-full min-h-[calc(100vh-90px)] flex flex-col justify-center py-6 sm:py-8 lg:py-10 overflow-hidden border-b border-slate-800 bg-slate-950">
        {/* Full-Width Background Photo */}
        <div className="absolute inset-0">
          <img
            src="/doctors-hero-bg.jpg"
            alt="Heal Stride Medical Team Bhopal"
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
                {t("doctorsPage.badge", "Heal Stride Medical Team • Bhopal")}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-white tracking-tight leading-tight">
              {t("doctorsPage.titlePrefix", "Meet Our Expert")}{" "}
              <span className="bg-gradient-to-r from-red-400 via-rose-300 to-teal-300 bg-clip-text text-transparent">
                Physiotherapists &amp; Specialists
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl leading-relaxed font-normal">
              {t(
                "doctorsPage.subtitle",
                "Certified, university-trained specialists providing evidence-based pain relief, sports injury rehabilitation, and dedicated 1-on-1 care."
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
                href={`https://wa.me/91${whatsappRaw}?text=${encodeURIComponent(
                  "Hello Heal Stride Clinic, I would like to consult with Dr. MD Rashid regarding physiotherapy treatment."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-5 py-3.5 min-h-[46px] rounded-xl border border-white/20 backdrop-blur-md shadow-md transition-all cursor-pointer"
              >
                <Phone size={15} className="text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Trust highlights */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Award size={14} className="text-emerald-400 shrink-0" />
                <span>Verified Medical Council Registration</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-teal-400 shrink-0" />
                <span>100% Non-Surgical Care</span>
              </span>
              <span className="flex items-center gap-1.5">
                <HeartPulse size={14} className="text-rose-400 shrink-0" />
                <span>1-on-1 Personalized Protocols</span>
              </span>
            </div>

            {/* 4 Stats Cards - Uniform 1-Line Layout */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 max-w-4xl mx-auto items-stretch">
              {/* Card 1: 5+ Years Experience */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-red-500/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-red-400 whitespace-nowrap">
                    <AnimatedCounter target={5} suffix="+" duration={1.2} />
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Years Clinical Exp.
                </p>
              </div>

              {/* Card 2: 2500+ Patients Recovered */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-teal-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-teal-400 whitespace-nowrap">
                    <AnimatedCounter target={2500} suffix="+" duration={1.6} />
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Patients Recovered
                </p>
              </div>

              {/* Card 3: MPT & BPT Qualified - Single Line Guaranteed */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-amber-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-lg sm:text-xl lg:text-2xl font-black text-amber-400 whitespace-nowrap tracking-tight">
                    MPT &amp; BPT
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Certified Specialists
                </p>
              </div>

              {/* Card 4: 1-on-1 Care */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-3.5 text-center border border-white/15 shadow-xl hover:border-cyan-400/50 hover:bg-slate-800/90 transition-all flex flex-col justify-center items-center h-full min-h-[92px] sm:min-h-[102px]">
                <div className="h-8 sm:h-9 lg:h-10 flex items-center justify-center">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-cyan-300 whitespace-nowrap">
                    1-on-1
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 font-semibold leading-tight whitespace-nowrap">
                  Personalized Care
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Doctor Cards Section - Symmetrical and Identical Design as Home/About */}
      <section className="py-8 xs:py-12 sm:py-16 px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          badge="Clinical Specialists"
          title="Choose Your Specialist Doctor"
          subtitle="Book an appointment or view detailed medical credentials, certifications, and clinical experience."
        />

        {/* Doctor Cards - Centered and Symmetrical (Matching Specialists.jsx) */}
        <div className="flex flex-wrap justify-center gap-5 sm:gap-8 items-stretch">
          {doctors.length === 0 ? (
            <p className="w-full text-center text-slate-500 py-10">
              {t("doctorsPage.noDoctors", "No doctors available currently.")}
            </p>
          ) : (
            doctors.map((rawDoc, index) => {
              const fallbackMatch = defaultDoctors.find(
                (d) =>
                  d.slug === rawDoc.slug ||
                  d.id === rawDoc.id ||
                  (rawDoc.slug?.includes("rashid") && d.id === "dr-md-rashid") ||
                  (rawDoc.slug?.includes("wajhul") && d.id === "dr-wajhul-qamar") ||
                  (rawDoc.slug?.includes("wazul") && d.id === "dr-wajhul-qamar")
              );
              const doctor = {
                ...fallbackMatch,
                ...rawDoc,
                certifications:
                  rawDoc.certifications && rawDoc.certifications.length > 0
                    ? rawDoc.certifications
                    : fallbackMatch?.certifications || [],
              };

              const docName = getDoctorLocalizedName(doctor, i18n);
              const docSlug = doctor.slug || doctor.id;
              const isRashid =
                doctor.id === "dr-md-rashid" ||
                doctor.slug === "dr-md-rashid" ||
                doctor.name?.toLowerCase().includes("rashid");

              const isWajhul =
                doctor.id === "dr-wajhul-qamar" ||
                doctor.slug === "dr-wajhul-qamar" ||
                doctor.name?.toLowerCase().includes("wajhul") ||
                doctor.name?.toLowerCase().includes("wazul");

              const cardPhoto =
                rawDoc.image ||
                rawDoc.imageUrl ||
                rawDoc.photoUrl ||
                fallbackMatch?.image ||
                fallbackMatch?.imageUrl ||
                doctor.imageUrl ||
                doctor.image ||
                "/default-user.png";

              const displayRole =
                rawDoc.role ||
                doctor.role ||
                fallbackMatch?.role ||
                (isRashid
                  ? "Senior Consultant Physiotherapist | MPT (Sports)"
                  : "Physiotherapist & Rehab Specialist (BPT)");

              return (
                <motion.div
                  key={doctor.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="
                    w-full
                    max-w-[290px]
                    xs:max-w-[320px]
                    sm:max-w-[350px]
                    bg-white
                    rounded-2xl
                    border
                    border-teal-500
                    overflow-hidden
                    flex
                    flex-col
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-200
                  "
                >
                  {/* Image */}
                  <div className="w-full h-72 xs:h-80 sm:h-96 md:h-[400px] bg-slate-50 overflow-hidden flex items-center justify-center relative group">
                    {cardPhoto ? (
                      <img
                        src={cardPhoto}
                        alt={docName}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                        <UserRound size={64} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3.5 xs:p-4 sm:p-5 text-center bg-white border-t border-slate-100 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-base xs:text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                        {docName}
                      </h3>
                      <p className="text-[11px] xs:text-xs sm:text-sm font-semibold text-teal-600 mt-0.5 xs:mt-1">
                        {displayRole}
                      </p>
                      <p className="text-[11px] xs:text-xs text-slate-500 mt-2 line-clamp-2 min-h-[2.2rem] xs:min-h-[2.5rem] leading-relaxed">
                        {doctor.specialization || doctor.description}
                      </p>
                    </div>

                    <div className="mt-3.5 xs:mt-4 pt-2.5 xs:pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 xs:gap-2">
                      <Link
                        to={`/doctors/${docSlug}`}
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-1 xs:gap-1.5
                          px-3 xs:px-3.5
                          py-2.5
                          min-h-[40px]
                          rounded-xl
                          bg-teal-50
                          hover:bg-teal-100
                          text-teal-700
                          font-semibold
                          text-xs
                          transition-colors
                        "
                      >
                        <span>{t("doctorsPage.viewProfile", "View Profile")}</span>
                        <ArrowRight size={13} />
                      </Link>

                      <Link
                        to={`/booking?doctor=${encodeURIComponent(doctor.name || docName)}`}
                        className="
                          flex-1
                          inline-flex
                          items-center
                          justify-center
                          gap-1.5
                          px-3 xs:px-3.5
                          py-2.5
                          min-h-[40px]
                          rounded-xl
                          bg-gradient-to-r from-[#d71920] to-[#008272]
                          hover:from-[#b91c1c] hover:to-[#0f766e]
                          active:scale-95
                          text-white
                          font-semibold
                          text-xs
                          shadow-sm
                          hover:shadow-md
                          transition-all
                          whitespace-nowrap
                        "
                      >
                        <CalendarCheck size={14} className="shrink-0" />
                        <span>{t("navbar.bookAppointment", "Book Appointment")}</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Quick Consultation Help CTA Banner - Full Width Container */}
        <div className="mt-10 sm:mt-14 w-full rounded-2xl xs:rounded-3xl bg-gradient-to-r from-teal-900 to-slate-900 p-5 xs:p-6 sm:p-8 lg:p-10 text-white shadow-lg border border-teal-800/40 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-[10px] xs:text-xs font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d71920] animate-pulse" />
              <span>Need Assistance?</span>
            </div>
            <h3 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold">
              Not Sure Which Specialist to Consult?
            </h3>
            <p className="text-[11px] xs:text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Speak directly with our clinic helpdesk or chat on WhatsApp to get matched with the right specialist.
            </p>
          </div>

          <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-2.5 xs:gap-3 shrink-0 w-full md:w-auto">
            <a
              href={`https://wa.me/${whatsappRaw}?text=${encodeURIComponent(
                "Hello HealStride, I need assistance choosing the right physiotherapy specialist."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3 min-h-[44px] rounded-xl font-bold text-xs sm:text-sm shadow-md transition text-center"
            >
              <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain shrink-0" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href={`tel:${phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3 min-h-[44px] rounded-xl font-bold text-xs sm:text-sm backdrop-blur-sm shadow-md transition text-center"
            >
              <img src="/call.png" alt="Call" className="w-4 h-4 object-contain shrink-0" />
              <span>Call Clinic</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Doctors;
