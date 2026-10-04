import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useClinicSettings } from "../../hooks/useClinicSettings";
import SectionHeader from "../common/SectionHeader";

const GoogleMap = () => {
  const { data: settings } = useClinicSettings();
  const mapQuery = encodeURIComponent(
    settings.address
      ? `Heal Stride Physiotherapy ${settings.address}`
      : "Heal Stride Physiotherapy LIG 85 Raisen Rd Bhopal"
  );

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="OUR LOCATION"
          title="Visit Heal Stride Clinic"
          subtitle="Find Heal Stride Physiotherapy & Wellness Centre in Bhopal and experience expert physiotherapy care in a comfortable, modern, and patient-friendly environment."
        />

        {/* Live Address Badge */}
        <div className="text-center -mt-4 sm:-mt-6 mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 text-xs sm:text-sm text-slate-700 shadow-sm font-medium">
            <FaMapMarkerAlt className="text-red-600 shrink-0" />
            <span>{settings.address}</span>
          </div>
        </div>

        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-slate-200 shadow-md"
        >
          <iframe
            title="Heal Stride Physiotherapy Clinic Location"
            src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-[300px] sm:h-[400px] lg:h-[480px] border-0"
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