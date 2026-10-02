import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import "swiper/css";

import treatment1 from "../../assets/images/treatment1.jpg";
import treatment2 from "../../assets/images/treatment2.jpg";
import treatment3 from "../../assets/images/treatment3.jpg";
import treatment4 from "../../assets/images/treatment4.jpg";
import treatment5 from "../../assets/images/treatment5.jpg";
import treatment6 from "../../assets/images/treatment6.jpg";
import treatment7 from "../../assets/images/treatment7.jpg";
import neckpain from "../../assets/images/neckpain.jpg";
import backpain from "../../assets/images/backpain.jpg";
import kneepain from "../../assets/images/kneepain.jpg";
import tenniselbow from "../../assets/images/tenniselbow.jpg";
import plantarfasciitis from "../../assets/images/plantarfasciitis.jpg";
import frozenshoulder from "../../assets/images/frozenshoulder.jpg";
import osteoarthritis from "../../assets/images/Osteoarthritis.jpg";
import sciaticapain from "../../assets/images/sciaticapain.jpg";
import strokerehab from "../../assets/images/strokerehab.jpg";
import sportsinjury from "../../assets/images/sportsinjury.jpg";
import postsurgeryrehab from "../../assets/images/postsurgeryrehab.jpg";

const treatmentsData = [
  {
    image: neckpain,
    titleKey: "servicesList.cervicalPainTitle",
    descKey: "servicesList.cervicalPainDesc",
  },
  {
    image: backpain,
    titleKey: "servicesList.backPainTitle",
    descKey: "servicesList.backPainDesc",
  },
  {
    image: kneepain,
    titleKey: "servicesList.kneePainTitle",
    descKey: "servicesList.kneePainDesc",
  },
  {
    image: tenniselbow,
    titleKey: "servicesList.tennisElbowTitle",
    descKey: "servicesList.tennisElbowDesc",
  },
  {
    image: plantarfasciitis,
    titleKey: "servicesList.plantarFasciitisTitle",
    descKey: "servicesList.plantarFasciitisDesc",
  },
  {
    image: frozenshoulder,
    titleKey: "servicesList.frozenShoulderTitle",
    descKey: "servicesList.frozenShoulderDesc",
  },
  {
    image: osteoarthritis,
    titleKey: "servicesList.osteoarthritisTitle",
    descKey: "servicesList.osteoarthritisDesc",
  },
  {
    image: sciaticapain,
    titleKey: "servicesList.sciaticaTitle",
    descKey: "servicesList.sciaticaDesc",
  },
  {
    image: strokerehab,
    titleKey: "servicesList.strokeRehabTitle",
    descKey: "servicesList.strokeRehabDesc",
  },
  {
    image: sportsinjury,
    titleKey: "servicesList.sportsRehabTitle",
    descKey: "servicesList.sportsRehabDesc",
  },
  {
    image: postsurgeryrehab,
    titleKey: "servicesList.postSurgeryPhysioTitle",
    descKey: "servicesList.postSurgeryPhysioDesc",
  },
  {
    image: treatment6,
    titleKey: "servicesList.painReductionTitle",
    descKey: "servicesList.painReductionDesc",
  },
  {
    image: treatment3,
    titleKey: "servicesList.cuppingTherapyTitle",
    descKey: "servicesList.cuppingTherapyDesc",
  },
  {
    image: treatment2,
    titleKey: "servicesList.dryNeedlingTitle",
    descKey: "servicesList.dryNeedlingDesc",
  },
  {
    image: treatment7,
    titleKey: "servicesList.iastmTherapyTitle",
    descKey: "servicesList.iastmTherapyDesc",
  },
  {
    image: treatment5,
    titleKey: "servicesList.exerciseTherapyTitle",
    descKey: "servicesList.exerciseTherapyDesc",
  },
];

const TreatmentSlider = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-slate-50 py-6 sm:py-8 lg:py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <p className="text-teal-600 uppercase tracking-wider font-semibold text-xs sm:text-sm">
            {t("treatmentSlider.badge")}
          </p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 text-slate-900 leading-tight">
            {t("treatmentSlider.title")}
          </h2>

          <p className="text-slate-600 mt-2.5 sm:mt-3 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
            {t("treatmentSlider.subtitle")}
          </p>
        </motion.div>

        {/* Slider Container */}
        <div className="w-full max-w-full overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            loop={true}
            speed={700}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            className="py-2"
          >
            {treatmentsData.map((item, index) => (
              <SwiperSlide key={index} className="!h-auto flex flex-col p-1">
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                  className="
                    group
                    h-full
                    w-full
                    flex
                    flex-col
                    justify-between
                    bg-white
                    rounded-2xl
                    p-4
                    border
                    border-teal-500
                    transition-all
                    duration-200
                  "
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative overflow-hidden rounded-xl w-full flex-shrink-0 aspect-[16/10] bg-slate-100">
                      <img
                        src={item.image}
                        alt={t(item.titleKey)}
                        className="
                          w-full
                          h-full
                          object-cover
                          object-center
                          group-hover:scale-105
                          transition-transform
                          duration-300
                        "
                      />
                    </div>

                    {/* Content Container */}
                    <div className="flex flex-col mt-3.5">
                      {/* Treatment Name */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 leading-snug line-clamp-1">
                        {t(item.titleKey)}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
                        {t(item.descKey)}
                      </p>
                    </div>
                  </div>

                  {/* Learn More Link */}
                  <div className="mt-4 pt-2">
                    <Link
                      to="/services"
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        text-teal-600
                        font-semibold
                        hover:text-teal-700
                        transition-colors
                        text-sm
                        group/link
                      "
                    >
                      <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">
                        {t("treatmentSlider.learnMore")}
                      </span>
                    </Link>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TreatmentSlider;