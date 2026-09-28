import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const AboutHero = () => {
  const { t } = useTranslation();

  return (
    <section
      className="
        relative
        w-full
        min-h-[480px]
        sm:min-h-[560px]
        lg:min-h-[640px]
        flex
        items-center
        justify-center
        overflow-hidden
        py-12
        sm:py-16
        lg:py-20
      "
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/about.jpg"
          alt="About Heal Stride"
          className="
            w-full
            h-full
            object-cover
            object-center
          "
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-slate-950/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/40 to-teal-950/30" />

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="
          relative
          z-10
          w-full
          max-w-7xl
          mx-auto
          text-center
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="
            inline-flex
            items-center
            bg-teal-600/30
            border
            border-teal-400/30
            backdrop-blur-md
            text-teal-200
            px-4
            py-1.5
            rounded-full
            text-xs
            sm:text-sm
            font-medium
            mb-4
            sm:mb-6
          "
        >
          {t("aboutHero.badge")}
        </motion.span>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="
            text-3xl
            sm:text-5xl
            lg:text-6xl
            font-bold
            text-white
            leading-tight
            drop-shadow-md
            max-w-4xl
            mx-auto
          "
        >
          {t("aboutHero.title")}
          <span className="block mt-1 sm:mt-2 font-extrabold">
            <span className="text-sky-300">Heal</span>{" "}
            <span className="text-emerald-300">Stride</span>
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="
            mt-3
            sm:mt-5
            text-xs
            sm:text-base
            lg:text-lg
            text-slate-100
            max-w-2xl
            mx-auto
            leading-relaxed
          "
        >
          {t("aboutHero.subtitle")}
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="
            mt-6
            sm:mt-10
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-3
            sm:gap-6
            max-w-3xl
            mx-auto
          "
        >
          {/* Card 1 */}
          <div
            className="
              bg-white/10
              backdrop-blur-md
              border
              border-white/20
              rounded-2xl
              p-4
              sm:p-5
              shadow-md
            "
          >
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              5+
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm mt-1">
              {t("aboutHero.yearsExp")}
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="
              bg-white/10
              backdrop-blur-md
              border
              border-white/20
              rounded-2xl
              p-4
              sm:p-5
              shadow-md
            "
          >
            <h3 className="text-2xl sm:text-3xl font-extrabold text-teal-300">
              2500+
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm mt-1">
              {t("aboutHero.happyPatients")}
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="
              bg-white/10
              backdrop-blur-md
              border
              border-white/20
              rounded-2xl
              p-4
              sm:p-5
              shadow-md
            "
          >
            <h3 className="text-2xl sm:text-3xl font-extrabold text-teal-200">
              {t("aboutHero.expertTag")}
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm mt-1">
              {t("aboutHero.expertCare")}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutHero;