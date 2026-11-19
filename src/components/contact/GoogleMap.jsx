import { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaExternalLinkAlt, FaDirections } from "react-icons/fa";
import { useClinicSettings, DEFAULT_CLINIC_SETTINGS } from "../../hooks/useClinicSettings";
import SectionHeader from "../common/SectionHeader";

const GoogleMap = () => {
  const { data: settings } = useClinicSettings();
  const [activeBranch, setActiveBranch] = useState(1);

  const branch1Address = settings.address || DEFAULT_CLINIC_SETTINGS.address;
  const branch2Address = settings.address2 || DEFAULT_CLINIC_SETTINGS.address2;

  const branches = [
    {
      id: 1,
      badge: "Clinic 1 • Main Branch",
      name: "Subhash Nagar Clinic",
      address: branch1Address,
      query: `Heal Stride Physiotherapy ${branch1Address}`,
      mapUrl: `https://maps.google.com/?q=${encodeURIComponent(`Heal Stride Physiotherapy ${branch1Address}`)}`,
      tagColor: "teal",
    },
    {
      id: 2,
      badge: "Clinic 2 • Second Clinic",
      name: "Charbatti Chouraha Clinic",
      address: branch2Address,
      query: branch2Address,
      mapUrl: `https://maps.google.com/?q=${encodeURIComponent(branch2Address)}`,
      tagColor: "rose",
    },
  ];

  const currentBranch = branches.find((b) => b.id === activeBranch) || branches[0];
  const mapQuery = encodeURIComponent(currentBranch.query);

  return (
    <section id="locations" className="py-8 sm:py-12 bg-slate-50 border-b border-slate-200/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="OUR CLINIC LOCATIONS"
          title="Visit Heal Stride in Bhopal"
          subtitle="Now serving you across two convenient clinic locations in Bhopal. Select a clinic below to view map directions and plan your visit."
        />

        {/* 2 Clinic Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-6 sm:mb-8">
          {branches.map((b) => {
            const isSelected = activeBranch === b.id;
            return (
              <div
                key={b.id}
                onClick={() => setActiveBranch(b.id)}
                className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-200 border-2 text-left flex flex-col justify-between ${
                  isSelected
                    ? b.id === 1
                      ? "bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20"
                      : "bg-white border-rose-500 shadow-md ring-2 ring-rose-500/20"
                    : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                        b.id === 1
                          ? isSelected
                            ? "bg-teal-100 text-teal-800"
                            : "bg-slate-100 text-slate-700"
                          : isSelected
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <FaMapMarkerAlt className={b.id === 1 ? "text-teal-600" : "text-rose-600"} />
                      {b.badge}
                    </span>

                    {isSelected && (
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ● Viewing on Map
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1">
                    {b.name}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {b.address}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveBranch(b.id);
                    }}
                    className={`text-xs font-semibold ${
                      isSelected
                        ? b.id === 1
                          ? "text-teal-700"
                          : "text-rose-700"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {isSelected ? "Active Map View" : "Show on Map"}
                  </button>

                  <a
                    href={b.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-teal-600 transition-colors"
                  >
                    <FaDirections className="text-teal-600" />
                    <span>Get Directions</span>
                    <FaExternalLinkAlt className="text-[10px] text-slate-400" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Google Map View */}
        <motion.div
          key={activeBranch}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white"
        >
          {/* Map Header Bar */}
          <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className={activeBranch === 1 ? "text-teal-400" : "text-rose-400"} />
              <span className="font-bold text-white">{currentBranch.name}:</span>
              <span className="text-slate-300 hidden sm:inline truncate max-w-lg">
                {currentBranch.address}
              </span>
            </div>

            <a
              href={currentBranch.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white font-medium text-xs transition border border-white/20 cursor-pointer ml-auto"
            >
              <FaDirections className="text-teal-300" />
              <span>Open in Google Maps</span>
              <FaExternalLinkAlt className="text-[10px] text-slate-300" />
            </a>
          </div>

          <iframe
            title={`Heal Stride Physiotherapy Clinic - ${currentBranch.name}`}
            src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-[320px] sm:h-[420px] lg:h-[480px] border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default GoogleMap;
