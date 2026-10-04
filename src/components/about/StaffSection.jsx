import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { staff as defaultStaff, getStaffLocalizedRole } from "../../data/team";
import { useFirestoreCollection, where } from "../../hooks/useFirestoreCollection";
import SectionHeader from "../common/SectionHeader";

const StaffSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { items: rawStaff } = useFirestoreCollection("staff", {
    constraints: [where("active", "!=", false)],
    fallback: defaultStaff,
  });

  const staff = (rawStaff || [])
    .filter(
      (m) =>
        !m.slug &&
        !m.name?.startsWith("Dr.") &&
        m.id !== "dr-md-rashid" &&
        m.id !== "dr-wajhul-qamar"
    )
    .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));

  if (staff.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          badge={t("staffSection.badge", "Meet Our Team")}
          title={t("staffSection.title", "Our Clinic Support Staff")}
          subtitle={t("staffSection.subtitle", "Meet our dedicated clinic assistants and coordinators.")}
        />

        {/* Staff Cards */}
        <div className="flex flex-wrap justify-center items-stretch gap-6 lg:gap-8">
          {staff.map((member, index) => {
            const role = getStaffLocalizedRole(member, i18n);

            return (
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
                  shadow-sm
                  hover:shadow-md
                  transition-all
                  duration-200
                "
              >
                {/* Image */}
                <div className="w-full h-72 sm:h-80 bg-slate-50 overflow-hidden flex items-center justify-center">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                      No Image
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <div className="p-4 sm:p-5 text-center bg-white border-t border-slate-100 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-teal-600 mt-1">
                      {role}
                    </p>
                    {member.department && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {member.department}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate("/staff")}
          className="px-8 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition shadow-sm cursor-pointer"
        >
          {t("staffSection.viewMore")}
        </button>
      </div>
    </section>
  );
};

export default StaffSection;
