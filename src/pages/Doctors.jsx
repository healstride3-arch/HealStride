import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CalendarCheck, ArrowRight, ShieldCheck, Award, HeartPulse, UserRound } from "lucide-react";
import { doctors as defaultDoctors, getDoctorLocalizedName } from "../data/team";
import { useFirestoreCollection, where } from "../hooks/useFirestoreCollection";
import { useFirestoreDoc } from "../hooks/useFirestoreDoc";
import SEO from "../components/common/SEO";

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
      {/* Top Hero Section - Matching Services & About Standard Spacing */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950 text-white py-10 xs:py-14 sm:py-20 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block px-3.5 xs:px-4 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-[11px] xs:text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 xs:mb-4 backdrop-blur-md">
              {t("doctorsPage.badge", "HealStride Medical Team")}
            </span>

            <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-teal-200 via-white to-teal-300 bg-clip-text text-transparent break-words">
              {t("doctorsPage.title", "Meet Our Expert Physiotherapists")}
            </h1>

            <p className="mt-3 sm:mt-4 text-slate-300 text-xs xs:text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              {t(
                "doctorsPage.subtitle",
                "Certified, dedicated specialists providing evidence-based pain relief, sports injury rehabilitation, and individualized healing plans."
              )}
            </p>

            {/* Trust Badges Strip */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 xs:gap-3 sm:gap-6 text-[11px] xs:text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-1.5 xs:gap-2 bg-white/10 backdrop-blur-md px-2.5 xs:px-3.5 py-1.5 rounded-full border border-white/15">
                <Award className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-teal-400 shrink-0" />
                <span>Verified Senior Specialists</span>
              </div>
              <div className="flex items-center gap-1.5 xs:gap-2 bg-white/10 backdrop-blur-md px-2.5 xs:px-3.5 py-1.5 rounded-full border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-teal-400 shrink-0" />
                <span>100% Non-Invasive Care</span>
              </div>
              <div className="flex items-center gap-1.5 xs:gap-2 bg-white/10 backdrop-blur-md px-2.5 xs:px-3.5 py-1.5 rounded-full border border-white/15">
                <HeartPulse className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-teal-400 shrink-0" />
                <span>Personalized Rehab Plans</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Doctor Cards Section - Symmetrical and Identical Design as Home/About */}
      <section className="py-8 xs:py-12 sm:py-16 px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-6 xs:mb-8 sm:mb-10">
          <span className="text-[11px] xs:text-xs sm:text-sm font-bold text-teal-600 uppercase tracking-widest">
            Clinical Specialists
          </span>
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Choose Your Specialist Doctor
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 xs:mt-2 max-w-xl mx-auto">
            Book an appointment or view detailed medical credentials, certifications, and clinical experience.
          </p>
        </div>

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
                          gap-1 xs:gap-1.5
                          px-2.5 xs:px-3.5
                          py-1.5 xs:py-2
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
                          inline-flex
                          items-center
                          gap-1 xs:gap-1.5
                          px-2.5 xs:px-3.5
                          py-1.5 xs:py-2
                          rounded-xl
                          bg-teal-600
                          hover:bg-teal-700
                          text-white
                          font-semibold
                          text-xs
                          transition-colors
                        "
                      >
                        <CalendarCheck size={13} />
                        <span>{t("navbar.book", "Book")}</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Quick Consultation Help CTA Banner */}
        <div className="mt-10 sm:mt-14 max-w-4xl mx-auto rounded-2xl xs:rounded-3xl bg-gradient-to-r from-teal-900 to-slate-900 p-4 xs:p-6 sm:p-8 text-white shadow-lg border border-teal-800/40 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="text-center md:text-left">
            <span className="inline-block px-2.5 xs:px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] xs:text-xs font-semibold mb-2">
              Need Assistance?
            </span>
            <h3 className="text-lg xs:text-xl sm:text-2xl font-bold">
              Not Sure Which Specialist to Consult?
            </h3>
            <p className="text-[11px] xs:text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
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
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 xs:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition text-center"
            >
              <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain shrink-0" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href={`tel:${phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 xs:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm backdrop-blur-sm shadow-md transition text-center"
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
