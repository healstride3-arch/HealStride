import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CalendarCheck, ArrowRight } from "lucide-react";
import { doctors as defaultDoctors, getDoctorLocalizedName } from "../data/team";
import { useFirestoreCollection, where } from "../hooks/useFirestoreCollection";

const Doctors = () => {
  const { t, i18n } = useTranslation();
  const { items: doctors } = useFirestoreCollection("doctors", {
    constraints: [where("active", "!=", false)],
    fallback: defaultDoctors,
  });

  return (
    <section
      className="
        py-10
        sm:py-16
        lg:py-20
        bg-slate-50
        min-h-[60vh]
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* Heading */}
        <div className="text-center">
          <span className="inline-block px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            {t("doctorsPage.badge", "Physiotherapy Specialists")}
          </span>

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
            {t("doctorsPage.title")}
          </h1>

          <p
            className="
              mt-2.5
              sm:mt-3
              text-xs
              sm:text-base
              text-slate-600
              max-w-2xl
              mx-auto
              leading-relaxed
            "
          >
            {t("doctorsPage.subtitle")}
          </p>
        </div>

        {/* Cards */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
            lg:gap-8
            mt-8
            sm:mt-12
            items-stretch
          "
        >
          {doctors.length === 0 ? (
            <p
              className="
                col-span-full
                text-center
                text-slate-500
                py-10
              "
            >
              {t("doctorsPage.noDoctors")}
            </p>
          ) : (
            doctors.map((doctor) => {
              const docName = getDoctorLocalizedName(doctor, i18n);

              return (
              <div
                key={doctor.id}
                className="
                  group
                  bg-white
                  rounded-2xl
                  shadow-sm
                  hover:shadow-xl
                  hover:border-teal-200
                  transition-all
                  duration-300
                  overflow-hidden
                  border
                  border-slate-100
                  flex
                  flex-col
                  h-full
                "
              >
                {/* Image */}
                <div className="overflow-hidden h-64 sm:h-72 w-full flex-shrink-0 bg-slate-100">
                  <img
                    src={doctor.imageUrl || doctor.image || "/default-user.png"}
                    alt={docName}
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      transition-transform
                      duration-300
                    "
                  />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h2
                      className="
                        text-lg
                        sm:text-xl
                        font-bold
                        text-slate-900
                      "
                    >
                      {docName}
                    </h2>

                    <p
                      className="
                        text-teal-600
                        mt-1
                        text-xs
                        sm:text-sm
                        font-semibold
                      "
                    >
                      {doctor.role}
                    </p>

                    <p
                      className="
                        text-slate-600
                        mt-2
                        text-xs
                        sm:text-sm
                        line-clamp-2
                        leading-relaxed
                      "
                    >
                      {doctor.specialization}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/doctors/${doctor.slug}`}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        px-3.5
                        py-2
                        rounded-xl
                        bg-teal-50
                        hover:bg-teal-100
                        text-teal-700
                        font-semibold
                        text-xs
                        sm:text-sm
                        transition-colors
                      "
                    >
                      <span>{t("doctorsPage.viewProfile")}</span>
                      <ArrowRight size={14} />
                    </Link>

                    <Link
                      to={`/booking?doctor=${encodeURIComponent(doctor.name || docName)}`}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        px-3.5
                        py-2
                        rounded-xl
                        bg-teal-600
                        hover:bg-teal-700
                        text-white
                        font-semibold
                        text-xs
                        sm:text-sm
                        transition-colors
                      "
                    >
                      <CalendarCheck size={14} />
                      <span>{t("navbar.book", "Book")}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
