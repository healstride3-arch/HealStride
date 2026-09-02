import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { doctors as defaultDoctors } from "../data/team";
import { useFirestoreCollection, where } from "../hooks/useFirestoreCollection";

const Doctors = () => {
  const { t } = useTranslation();
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
            doctors.map((doctor) => (
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
                <div className="overflow-hidden h-64 sm:h-72 w-full flex-shrink-0">
                  <img
                    src={doctor.image || "/default-user.png"}
                    alt={doctor.name}
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
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <h2
                    className="
                      text-lg
                      sm:text-xl
                      font-bold
                      text-slate-900
                    "
                  >
                    {doctor.name}
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

                  <div className="mt-auto pt-4">
                    <Link
                      to={`/doctors/${doctor.slug}`}
                      className="
                        inline-flex
                        items-center
                        gap-1
                        text-teal-600
                        font-semibold
                        text-xs
                        sm:text-sm
                        hover:text-teal-700
                        transition-colors
                      "
                    >
                      <span>{t("doctorsPage.viewProfile")}</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
