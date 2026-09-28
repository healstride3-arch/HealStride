import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  GraduationCap,
  BriefcaseMedical,
  BadgeCheck,
  ArrowLeft,
} from "lucide-react";
import { doctors as defaultDoctors, getDoctorLocalizedName } from "../data/team";
import { useFirestoreCollection, where } from "../hooks/useFirestoreCollection";

const DoctorProfile = () => {
  const { doctorName } = useParams();
  const { t, i18n } = useTranslation();
  const { items: doctors } = useFirestoreCollection("doctors", {
    constraints: [where("active", "!=", false)],
    fallback: defaultDoctors,
  });
  const doctor = doctors.find((item) => item.slug === doctorName);

  if (!doctor) {
    return (
      <div className="py-20 text-center text-xl font-bold text-slate-800">
        {t("doctorProfile.notFound")}
      </div>
    );
  }

  const doctorLocalizedName = getDoctorLocalizedName(doctor, i18n);

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-100 min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 text-teal-600 mb-6 font-semibold text-xs sm:text-sm hover:text-teal-700 transition-colors"
        >
          <ArrowLeft size={16} />
          {t("doctorProfile.back")}
        </Link>

        <div
          className="
            grid
            lg:grid-cols-2
            gap-8
            lg:gap-12
            items-start
          "
        >
          {/* Image */}
          <div className="w-full">
            <img
              src={doctor.image || "/default-user.png"}
              alt={doctorLocalizedName}
              className="
                w-full
                h-[320px]
                sm:h-[420px]
                lg:h-[500px]
                object-cover
                rounded-2xl
                shadow-sm
                border
                border-slate-100
              "
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-bold
                text-slate-900
                leading-tight
              "
            >
              {doctorLocalizedName}
            </h1>

            <p
              className="
                text-teal-600
                text-sm
                sm:text-base
                font-semibold
                mt-1
              "
            >
              {doctor.role}
            </p>

            <p
              className="
                mt-4
                text-slate-600
                text-xs
                sm:text-base
                leading-relaxed
              "
            >
              {doctor.description}
            </p>

            <div className="space-y-4 mt-6">
              <Info
                icon={<GraduationCap size={20} />}
                title={t("doctorProfile.education")}
                value={doctor.education}
              />

              <Info
                icon={<BriefcaseMedical size={20} />}
                title={t("doctorProfile.experience")}
                value={doctor.experience}
              />

              <Info
                icon={<BadgeCheck size={20} />}
                title={t("doctorProfile.registration")}
                value={doctor.registration}
              />
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-2.5">
                {t("doctorProfile.specialization")}
              </h3>

              <div className="flex flex-wrap gap-2">
                {doctor.specialization
                  ?.split(",")
                  .map((item, index) => (
                    <span
                      key={index}
                      className="
                        bg-teal-50
                        text-teal-700
                        border
                        border-teal-200
                        px-3
                        py-1.5
                        rounded-xl
                        text-xs
                        sm:text-sm
                        font-medium
                      "
                    >
                      {item.trim()}
                    </span>
                  ))}
              </div>
            </div>

            <div className="mt-8">
              <Link
                to={`/booking?doctor=${encodeURIComponent(doctor.name || doctorLocalizedName)}`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  bg-teal-600
                  hover:bg-teal-700
                  active:bg-teal-800
                  text-white
                  px-6
                  py-3.5
                  rounded-xl
                  font-semibold
                  shadow-md
                  hover:shadow-lg
                  transition-all
                  duration-200
                  text-xs
                  xs:text-sm
                  sm:text-base
                  w-full
                  sm:w-auto
                "
              >
                {t("doctorProfile.bookAppointment")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Info = ({ icon, title, value }) => (
  <div className="flex gap-3">
    <div className="text-teal-600">{icon}</div>

    <div>
      <h3 className="font-semibold">{title}</h3>
      <p>{value || "-"}</p>
    </div>
  </div>
);

export default DoctorProfile;
