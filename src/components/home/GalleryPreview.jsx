import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaExpand, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import SectionHeader from "../common/SectionHeader";

import tractionTherapy from "../../assets/images/gallery/traction-therapy.jpg";
import treatmentRoom from "../../assets/images/gallery/treatment-room.jpg";
import therapyArea from "../../assets/images/gallery/therapy-area.jpg";
import steamWellness from "../../assets/images/gallery/steam-wellness.jpg";
import patientTherapy1 from "../../assets/images/gallery/patient-therapy-1.jpg";
import patientTherapy2 from "../../assets/images/gallery/patient-therapy-2.jpg";
import abKingPro from "../../assets/images/gallery/ab-king-pro.jpg";
import cuppingSet from "../../assets/images/gallery/cupping-set.jpg";
import servicesBanner from "../../assets/images/gallery/services-banner.jpg";
import electroAcupuncture from "../../assets/images/gallery/electro-acupuncture.jpg";

const initialGalleryItems = [
  {
    id: "clinic-1",
    image: patientTherapy1,
    title: "Hands-on Physical Therapy & Joint Mobilization",
    subtitle: "Dr. MD Rashid providing targeted physical therapy",
  },
  {
    id: "clinic-2",
    image: tractionTherapy,
    title: "Advanced Traction Therapy",
    subtitle: "Non-surgical spinal joint decompression & pain relief",
  },
  {
    id: "clinic-3",
    image: treatmentRoom,
    title: "HealStride Clinic Treatment Room",
    subtitle: "Modern beds and clean patient care environment",
  },
  {
    id: "clinic-4",
    image: therapyArea,
    title: "Dedicated Therapy Area",
    subtitle: "Electrotherapy, modalities & movement restoration",
  },
  {
    id: "clinic-5",
    image: steamWellness,
    title: "Steam & Wellness Pod Therapy",
    subtitle: "Detoxification, relaxation & natural immunity booster",
  },
  {
    id: "clinic-6",
    image: patientTherapy2,
    title: "Knee & Musculoskeletal Rehabilitation",
    subtitle: "Specialized stretching and strength recovery protocols",
  },
  {
    id: "clinic-7",
    image: electroAcupuncture,
    title: "Electronic Acupuncture Treatment Instrument",
    subtitle: "Advanced nerve and muscle stimulator for deep pain relief",
  },
  {
    id: "clinic-8",
    image: cuppingSet,
    title: "Sterile Cupping & Hijama Therapy Kit",
    subtitle: "High-quality medical cups for pain & circulation relief",
  },
  {
    id: "clinic-9",
    image: abKingPro,
    title: "AB King Pro Abdominal Workout Bench",
    subtitle: "Core strengthening and spinal stability exercise equipment",
  },
  {
    id: "clinic-10",
    image: servicesBanner,
    title: "Comprehensive Physiotherapy Services",
    subtitle: "Dr. MD Rashid (PT) - Senior Consultant | MPT (Sports) • Certified in Cupping, Needling, Taping & MWM",
  },
];

const GalleryPreview = () => {
  const { t } = useTranslation();
  const { items: galleryList } = useFirestoreCollection("gallery", {
    fallback: initialGalleryItems,
    mapItem: (item) => ({
      ...item,
      image: item.imageUrl || item.image,
      subtitle: item.subtitle || item.description || "",
    }),
  });
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleToggle = () => {
    if (visibleCount >= galleryList.length) {
      setVisibleCount(5);
    } else {
      setVisibleCount((prev) => Math.min(prev + 4, galleryList.length));
    }
  };

  const displayedItems = galleryList.slice(0, visibleCount);

  return (
    <section className="py-10 sm:py-14 lg:py-18 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          badge={t("galleryPreview.badge")}
          title={t("galleryPreview.title")}
          subtitle={t("galleryPreview.subtitle")}
        />

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedItems.map((item, index) => {
            const isLarge = index === 1 || (visibleCount > 5 && index === 6);
            const spanClass = isLarge
              ? "col-span-1 sm:col-span-2 lg:col-span-2 h-[260px] sm:h-[300px] lg:h-[340px]"
              : "col-span-1 h-[240px] sm:h-[280px] lg:h-[320px]";

            const itemTitle = t(`galleryPreview.items.${item.id}.title`, { defaultValue: item.title });
            const itemSubtitle = t(`galleryPreview.items.${item.id}.subtitle`, { defaultValue: item.subtitle });

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 5) * 0.06 }}
                onClick={() => setSelectedImage(item)}
                className={`group relative overflow-hidden rounded-2xl border border-teal-500/40 shadow-sm hover:shadow-xl cursor-pointer bg-slate-900 ${spanClass} transition-all duration-300`}
              >
                <img
                  src={item.image}
                  alt={itemTitle}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent group-hover:from-slate-950/90 transition-all duration-300 flex flex-col justify-end p-4 sm:p-5">
                  <div className="flex items-center justify-between text-white mb-1">
                    <h3 className="font-bold text-sm sm:text-base tracking-wide line-clamp-1">
                      {itemTitle}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaExpand />
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-300 line-clamp-1">
                    {itemSubtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More Button (Directly on Home Page) */}
        {galleryList.length > 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mt-8 sm:mt-10"
          >
            <button
              onClick={handleToggle}
              className="
                group
                bg-teal-600
                hover:bg-teal-700
                active:bg-teal-800
                text-white
                font-semibold
                px-7
                py-3.5
                rounded-xl
                inline-flex
                items-center
                gap-2.5
                shadow-md
                hover:shadow-lg
                transition-all
                duration-200
                text-xs
                xs:text-sm
                sm:text-base
              "
            >
              <span>
                {visibleCount >= galleryList.length
                  ? t("galleryPreview.showLess")
                  : t("galleryPreview.loadMore")}
              </span>
              {visibleCount >= galleryList.length ? (
                <FaChevronUp className="text-xs" />
              ) : (
                <FaChevronDown className="text-xs group-hover:translate-y-0.5 transition-transform" />
              )}
            </button>
          </motion.div>
        )}
      </div>

      {/* High-Resolution Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-teal-500/50 shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 bg-slate-900/90 border-b border-slate-800 text-white">
                <div>
                  <h3 className="font-bold text-sm sm:text-lg text-white">
                    {t(`galleryPreview.items.${selectedImage.id}.title`, { defaultValue: selectedImage.title })}
                  </h3>
                  <p className="text-xs text-teal-400">
                    {t(`galleryPreview.items.${selectedImage.id}.subtitle`, { defaultValue: selectedImage.subtitle })}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors"
                >
                  <FaTimes className="text-base" />
                </button>
              </div>

              {/* Modal Full Image */}
              <div className="max-h-[75vh] flex items-center justify-center bg-slate-950 p-2 overflow-auto">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="max-h-[72vh] w-auto object-contain rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleryPreview;
