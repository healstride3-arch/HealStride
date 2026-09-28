import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useClinicSettings } from "../../hooks/useClinicSettings";

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
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="uppercase tracking-wider text-[#0066cc] font-semibold text-xs sm:text-sm">
            OUR LOCATION
          </p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-2 leading-tight">
            Visit Heal Stride Clinic
          </h2>

          <p className="text-slate-600 mt-2.5 sm:mt-3 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
            Find Heal Stride Physiotherapy &amp; Wellness Centre in Bhopal and
            experience expert physiotherapy care in a comfortable,
            modern, and patient-friendly environment.
          </p>

          {/* Live Address Badge */}
          <div className="mt-3.5 inline-flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 text-xs sm:text-sm text-slate-700 shadow-sm font-medium">
            <FaMapMarkerAlt className="text-[#0066cc] shrink-0" />
            <span>{settings.address}</span>
          </div>
        </motion.div>

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