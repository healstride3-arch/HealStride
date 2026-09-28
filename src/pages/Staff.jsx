import { UserRound, ArrowLeft, Award, Clock, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { staff as defaultStaff, getStaffLocalizedRole } from "../data/team";
import { useFirestoreCollection, where } from "../hooks/useFirestoreCollection";

const Staff = () => {
  const { t, i18n } = useTranslation();
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

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-100 min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold text-xs sm:text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{t("common.backToHome", "Back to Home")}</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
          <span className="inline-block px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            {t("staffSection.badge", "Clinic Support Team")}
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            {t("staffSection.title", "Our Clinic Support Staff")}
          </h1>

          <p className="mt-2.5 sm:mt-3 text-slate-600 text-xs sm:text-base leading-relaxed">
            {t(
              "staffSection.subtitle",
              "Meet our dedicated healthcare assistants, therapy technicians, and coordinators who ensure smooth clinic operations and patient comfort."
            )}
          </p>
        </div>

        {/* Staff Cards Container */}
        {staff.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto p-6">
            <p className="text-slate-500 text-sm">
              {t("staffSection.noStaff", "No staff members available.")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {staff.map((member) => {
              const localizedRole = getStaffLocalizedRole(member, i18n);

              return (
                <div
                  key={member.id}
                  className="
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
                  <div className="w-full h-72 sm:h-80 bg-slate-100 overflow-hidden flex items-center justify-center relative group">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <UserRound size={64} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-teal-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                      <HeartHandshake size={14} className="text-teal-400" />
                      <span>{t("staffSection.supportBadge", "Clinic Support")}</span>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                        {member.name}
                      </h2>

                      <p className="text-xs sm:text-sm font-semibold text-teal-600 mt-1">
                        {localizedRole}
                      </p>

                      {member.department && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {member.department}
                        </p>
                      )}

                      {member.bio && (
                        <p className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>
                      )}
                    </div>

                    {/* Metadata Badges */}
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      {member.experience && (
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-teal-600 shrink-0" />
                          <span>{member.experience}</span>
                        </div>
                      )}
                      {member.certifications && (
                        <div className="flex items-center gap-2">
                          <Award size={14} className="text-teal-600 shrink-0" />
                          <span className="line-clamp-1">{member.certifications}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Staff;
