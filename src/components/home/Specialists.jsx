import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserRound, CalendarCheck, ArrowRight, BadgeCheck } from "lucide-react";
import { doctors as defaultDoctors, getDoctorLocalizedName } from "../../data/team";
import { useFirestoreCollection, where } from "../../hooks/useFirestoreCollection";
import SectionHeader from "../common/SectionHeader";

const Specialists = ({ limit = 3 }) => {
  const { t, i18n } = useTranslation();

  const { items: rawDoctors } = useFirestoreCollection("doctors", {
    fallback: defaultDoctors,
  });
  const activeDoctors = rawDoctors.filter((d) => d.active !== false);
  const doctorList = limit ? activeDoctors.slice(0, limit) : activeDoctors;

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <SectionHeader
          badge={t("specialists.badge", "Meet Our Doctors")}
          title={t("specialists.title", "Meet Our Expert Physiotherapists")}
          subtitle={t(
            "specialists.subtitle",
            "Meet our certified and experienced physiotherapists dedicated to personalized patient care and rapid recovery."
          )}
        />

        {/* Centered Cards Container */}
        <div className="flex flex-wrap justify-center items-stretch gap-5 sm:gap-6 lg:gap-8">
          {doctorList.map((rawDoc, index) => {
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
            const docSlug = doctor.slug || doctor.id || "doctor";
            const isRashid =
              doctor.id === "dr-md-rashid" ||
              doctor.slug === "dr-md-rashid" ||
              doctor.name?.toLowerCase().includes("rashid");

            const isWajhul =
              doctor.id === "dr-wajhul-qamar" ||
              doctor.slug === "dr-wajhul-qamar" ||
              doctor.name?.toLowerCase().includes("wajhul") ||
              doctor.name?.toLowerCase().includes("wazul") ||
              doctor.name?.toLowerCase().includes("qumar") ||
              doctor.name?.toLowerCase().includes("qamar");

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
                    <h3 className="text-base xs:text-lg sm:text-xl font-bold text-slate-900 leading-snug">
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
                        <span>{t("specialists.viewProfile", "View Profile")}</span>
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
          })}
        </div>

        {/* View All Doctors Button */}
        <div className="flex justify-center mt-8 sm:mt-10">
          <Link
            to="/doctors"
            className="
              inline-flex
              items-center
              gap-2
              px-7
              py-3
              rounded-xl
              bg-teal-50
              hover:bg-teal-100
              text-teal-700
              font-semibold
              text-xs
              sm:text-sm
              border
              border-teal-200
              transition-colors
            "
          >
            <span>{t("specialists.viewAllDoctors", "View All Doctors")}</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Specialists;
