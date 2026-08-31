import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ContactHero = () => {
  const { t } = useTranslation();

  return (
    <section
      className="
        relative
        w-full
        min-h-[380px]
        sm:min-h-[460px]
        lg:min-h-[500px]
        flex
        items-center
        justify-center
        overflow-hidden
        py-12
        sm:py-16
        lg:py-20
      "
    >
      {/* Background */}
      <img
        src="/appointment-bg.avif"
        alt="Contact Us"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          object-center
        "
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/40 to-teal-950/30" />

      {/* Content */}
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
            backdrop-blur-md
            border
            border-teal-400/30
            text-teal-200
            px-4
            py-1.5
            rounded-full
            mb-4
            sm:mb-6
            text-xs
            sm:text-sm
            font-medium
          "
        >
          {t("contactHero.badge")}
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
          {t("contactHero.title")}

          <span className="block text-teal-300 mt-1 sm:mt-2">
            {t("contactHero.titleHighlight")}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.4,
          }}
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
          {t("contactHero.subtitle")}
        </motion.p>
      </motion.div>
    </section>
  );
};

export default ContactHero;