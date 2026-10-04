import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { galleryItems as staticGalleryItems } from "../data/galleryItems";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";
import SectionHeader from "../components/common/SectionHeader";

const GalleryCategory = ({ category, title, titleKey, defaultTitle }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { t } = useTranslation();
  const { items: galleryItems } = useFirestoreCollection("gallery", {
    fallback: staticGalleryItems,
  });

  const displayTitle = titleKey ? t(titleKey) : (title || defaultTitle);
  const images = galleryItems.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-100 min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={category}
          title={displayTitle}
          subtitle={t("galleryCategory.explore", { title: displayTitle.toLowerCase() })}
        />

        {images.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-100 shadow-sm font-semibold text-slate-600 text-xs sm:text-sm">
            {t("galleryCategory.noImages")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {images.map((image) => (
              <motion.div
                key={image.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 cursor-pointer flex flex-col h-full group"
                onClick={() =>
                  setSelectedImage(image.imageUrl)
                }
              >
                <div className="overflow-hidden relative h-48 sm:h-56 w-full flex-shrink-0">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <span className="absolute top-3 left-3 bg-teal-600/90 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                    {image.category}
                  </span>
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900">
                    {image.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {image.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
            onClick={() =>
              setSelectedImage(null)
            }
          >
            <button
              className="absolute top-6 right-6 text-white text-3xl"
              onClick={() =>
                setSelectedImage(null)
              }
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] rounded-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleryCategory;
