import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Image, Activity, Stethoscope } from "lucide-react";
import { useTranslation } from "react-i18next";

const GalleryPage = () => {
  const { t } = useTranslation();

  const categories = [
    {
      titleKey: "galleryPage.cat1Title",
      descKey: "galleryPage.cat1Desc",
      path: "/gallery/clinic",
      icon: <Image size={24} />,
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    },
    {
      titleKey: "galleryPage.cat2Title",
      descKey: "galleryPage.cat2Desc",
      path: "/gallery/machine",
      icon: <Activity size={24} />,
      image:
        "https://images.unsplash.com/photo-1580281657527-47f249e8f4df",
    },
    {
      titleKey: "galleryPage.cat3Title",
      descKey: "galleryPage.cat3Desc",
      path: "/gallery/treatment",
      icon: <Stethoscope size={24} />,
      image:
        "https://images.unsplash.com/photo-1516549655169-df83a0774514",
    },
  ];

  return (
    <section
      className="
        py-10
        sm:py-16
        lg:py-20
        min-h-[60vh]
        bg-cover
        bg-center
        relative
      "
      style={{
        backgroundImage: "url('/gallery-bg.avif')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="uppercase tracking-wider text-teal-600 font-semibold text-xs sm:text-sm">
            {t("galleryPage.badge")}
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 text-slate-900 leading-tight">
            {t("galleryPage.title")}
          </h1>

          <p className="text-slate-600 mt-2.5 sm:mt-3 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
            {t("galleryPage.subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {categories.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="h-full block"
            >
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="
                  group
                  h-full
                  flex
                  flex-col
                  bg-white
                  rounded-2xl
                  overflow-hidden
                  border
                  border-slate-100
                  shadow-sm
                  hover:shadow-xl
                  hover:border-teal-200
                  transition-all
                  duration-300
                "
              >
                {/* Image */}
                <div className="relative overflow-hidden h-52 sm:h-60 w-full flex-shrink-0">
                  <img
                    src={item.image}
                    alt={t(item.titleKey)}
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      transition-transform
                      duration-300
                    "
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2.5 text-teal-600 mb-2">
                    {item.icon}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {t(item.titleKey)}
                    </h3>
                  </div>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {t(item.descKey)}
                  </p>

                  <div className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-1 text-teal-600 font-semibold text-xs sm:text-sm group-hover:text-teal-700 transition-colors">
                      <span>{t("galleryPage.viewGallery")}</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryPage;