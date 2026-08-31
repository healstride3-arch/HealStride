import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ServicesCTA = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-teal-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            {t("servicesCTA.title")}
          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-lg text-teal-50 leading-8">
            {t("servicesCTA.subtitle")}
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              to="/booking"
              className="
              inline-block
              mt-8
              bg-white
              text-teal-600
              px-10
              py-4
              rounded-xl
              font-semibold
              shadow-lg
              hover:bg-gray-100
              transition
              "
            >
              {t("servicesCTA.bookBtn")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesCTA;