import { FaPhoneAlt, FaCalendarCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import heroBg from "../../assets/images/hero-bg.jpg";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section
      className="
        relative
        w-full
        min-h-[390px]
        xs:min-h-[410px]
        sm:min-h-[480px]
        lg:min-h-[520px]
        flex
        items-center
        justify-center
        overflow-hidden
      "
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay: Balanced opacity for therapist/patient background visibility with high contrast text */}
      <div className="absolute inset-0 bg-slate-950/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-teal-950/25" />

      {/* Content Container */}
      <div
        className="
          relative z-10
          w-full
          max-w-7xl
          mx-auto
          px-3.5
          xs:px-4
          sm:px-6
          lg:px-8
          py-9
          sm:py-12
          lg:py-14
          flex
          flex-col
          items-center
          justify-center
        "
      >
        <motion.div
          className="
            w-full
            max-w-4xl
            mx-auto
            text-center
          "
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Clinic Name */}
          <p
            className="
              bg-gradient-to-r from-sky-300 via-blue-200 to-emerald-300 bg-clip-text text-transparent
              font-extrabold
              text-base
              xs:text-lg
              sm:text-2xl
              md:text-3xl
              lg:text-4xl
              leading-tight
              mb-2
              sm:mb-3
              tracking-wide
              drop-shadow-sm
            "
          >
            {t("hero.clinicName")}
          </p>

          {/* Tagline / Main Heading */}
          <h1
            className="
              text-white
              font-bold
              text-[22px]
              xs:text-2xl
              sm:text-3xl
              md:text-[38px]
              lg:text-[45px]
              leading-snug
              sm:leading-tight
              drop-shadow-md
              max-w-3xl
              mx-auto
            "
          >
            {t("hero.tagline")}
          </h1>

          {/* Description */}
          <p
            className="
              mt-3
              sm:mt-4
              text-slate-100
              text-xs
              xs:text-sm
              sm:text-base
              md:text-lg
              leading-relaxed
              sm:leading-7
              max-w-2xl
              mx-auto
              px-2
              drop-shadow-sm
            "
          >
            {t("hero.description")}
          </p>

          {/* Buttons: Equal Height & Aligned */}
          <motion.div
            className="
              mt-5
              sm:mt-8
              flex
              flex-col
              sm:flex-row
              gap-3.5
              sm:gap-4
              justify-center
              items-center
              w-full
              sm:w-auto
              mx-auto
            "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Book Appointment (Primary CTA) */}
            <Link
              to="/booking"
              className="
                w-full
                sm:w-auto
                sm:min-w-[200px]
                h-12
                sm:h-13
                bg-gradient-to-r from-[#0066cc] to-[#16a34a] hover:from-[#0052a3] hover:to-[#15803d] active:scale-[0.98]
                text-white
                font-semibold
                text-sm
                sm:text-base
                px-4
                xs:px-6
                rounded-xl
                flex
                items-center
                justify-center
                gap-2.5
                shadow-md
                hover:shadow-teal-900/25
                hover:-translate-y-0.5
                transition-all
                duration-200
              "
            >
              <FaCalendarCheck className="text-base flex-shrink-0" />
              <span>{t("hero.bookAppointment")}</span>
            </Link>

            {/* Call Now (Secondary CTA) */}
            <a
              href="tel:+918809491380"
              className="
                w-full
                sm:w-auto
                sm:min-w-[200px]
                h-12
                sm:h-13
                border
                border-white/70
                bg-white/15
                hover:bg-white/25
                backdrop-blur-md
                text-white
                font-semibold
                text-sm
                sm:text-base
                px-4
                xs:px-6
                rounded-xl
                flex
                items-center
                justify-center
                gap-2.5
                shadow-sm
                hover:-translate-y-0.5
                transition-all
                duration-200
              "
            >
              <FaPhoneAlt className="text-sm flex-shrink-0 text-emerald-300" />
              <span>{t("hero.callNow")}</span>
            </a>
          </motion.div>

          {/* Trust Indicators Row */}
          <div className="mt-5 sm:mt-9 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-1.5 text-[11px] xs:text-xs sm:text-sm font-medium text-slate-200/90 drop-shadow-sm">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span> Experienced Physiotherapists
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span> Personalized Treatment
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span> 2500+ Patients Treated
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
