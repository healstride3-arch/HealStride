import { motion } from "framer-motion";
import { Calendar, ArrowRight, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

const CTA = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-[#d71920] via-teal-700 to-[#008272]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            {t("cta.title")}
          </h2>

          <p className="mt-4 text-white/90 text-base md:text-lg max-w-2xl mx-auto">
            {t("cta.subtitle")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/booking"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#d71920] hover:text-[#008272] px-6 py-3 rounded-full font-bold shadow-md hover:scale-105 transition"
            >
              <Calendar className="w-5 h-5" />
              {t("cta.bookBtn")}
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="tel:+918809491380"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-[#008272] transition"
            >
              <img src="/call.png" alt="Call" className="w-4 h-4 object-contain" />
              {t("cta.callBtn")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;