import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserRound } from "lucide-react";
import { staff as defaultTeam } from "../../data/team";
import { useFirestoreCollection, where } from "../../hooks/useFirestoreCollection";

const Specialists = ({ limit = 3 }) => {
  const { t } = useTranslation();

  const { items: team } = useFirestoreCollection("staff", {
    constraints: [where("active", "!=", false)],
    fallback: defaultTeam,
  });
  const teamMembers = limit ? team.slice(0, limit) : team;

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
        >
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-teal-600 uppercase mb-2 sm:mb-3">
            {t("specialists.badge", "Meet Our Team")}
          </p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            {t("specialists.title", "Meet Our Expert Physiotherapists")}
          </h2>

          <p className="mt-2.5 sm:mt-3 text-slate-600 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            {t(
              "specialists.subtitle",
              "Meet our certified and experienced physiotherapists dedicated to personalized patient care and rapid recovery."
            )}
          </p>
        </motion.div>

        {/* Centered Cards Container */}
        <div className="flex flex-wrap justify-center items-stretch gap-6 lg:gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="
                w-full
                max-w-[320px]
                sm:max-w-[350px]
                bg-white
                rounded-2xl
                border
                border-teal-500
                overflow-hidden
                flex
                flex-col
                transition-all
                duration-200
              "
            >
              {/* Image */}
              <div className="w-full h-80 sm:h-96 md:h-[400px] bg-slate-50 overflow-hidden flex items-center justify-center">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                    <UserRound size={64} />
                  </div>
                )}
              </div>

              {/* Only Name */}
              <div className="p-4 sm:p-5 text-center bg-white border-t border-slate-100">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {member.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Team Button */}
        <div className="flex justify-center mt-8 sm:mt-10">
          <Link
            to="/staff"
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
            <span>View All Team Members</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Specialists;
