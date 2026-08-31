import { motion } from "framer-motion";

const GoogleMap = () => {
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
          <p className="uppercase tracking-wider text-teal-600 font-semibold text-xs sm:text-sm">
            OUR LOCATION
          </p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-2 leading-tight">
            Visit HealStride Clinic
          </h2>

          <p className="text-slate-600 mt-2.5 sm:mt-3 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
            Find HealStride Physiotherapy & Wellness Centre in Bhopal and
            experience expert physiotherapy care in a comfortable,
            modern, and patient-friendly environment.
          </p>
        </motion.div>

        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-teal-500 shadow-sm"
        >
          <iframe
            title="HealStride Physiotherapy Clinic Location Bhopal"
            src="https://maps.google.com/maps?q=Heal+Stride+Physiotherapy+and+Wellness+Centre+LIG+85+Raisen+Rd+near+gurudwara+New+Subhash+Nagar+Bhopal+Madhya+Pradesh+462023&t=&z=16&ie=UTF8&iwloc=&output=embed"
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