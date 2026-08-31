import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ContactInfo = () => {
  const { t } = useTranslation();

  const contactItems = [
    {
      icon: <FaPhoneAlt />,
      titleKey: "contactInfo.phone",
      content: (
        <a
          href="tel:+918809491380"
          className="text-gray-600 hover:text-teal-600 transition"
        >
          <div>+91 88094 91380</div>
          <div>+91 82525 80389</div>
        </a>
      ),
    },
    {
      icon: <FaEnvelope />,
      titleKey: "contactInfo.email",
      content: (
        <a
          href="mailto:healstride3@gmail.com"
          className="text-gray-600 hover:text-teal-600 transition break-all"
        >
          healstride3@gmail.com
        </a>
      ),
    },
    {
      icon: <FaMapMarkerAlt />,
      titleKey: "contactInfo.address",
      content: (
        <p className="text-gray-600 text-sm sm:text-base leading-7">
          HealStride Physiotherapy & Wellness Centre
          <br />
          LIG 85, New Subhash Nagar, Near Gurudwaran Raisen Road, Bhopal-462023
        </p>
      ),
    },
    {
      icon: <FaClock />,
      titleKey: "contactInfo.hours",
      content: (
        <>
          <p className="text-gray-600 text-sm sm:text-base">
            {t("contactInfo.monSat")}
          </p>

          <p className="font-medium text-slate-800 mt-1">
            Morning 9:00 AM - 12:00 PM
          </p>

          <p className="font-medium text-slate-800 mt-1">
            Evening 5:00 PM - 9:00 PM
          </p>

        </>
      ),
    },
  ];

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-teal-600 font-semibold uppercase tracking-wider text-xs sm:text-sm">
            {t("contactInfo.badge")}
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-2 leading-tight">
            {t("contactInfo.title")}
          </h2>

          <p className="text-slate-600 mt-2.5 sm:mt-3 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
            {t("contactInfo.subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {contactItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -4,
              }}
              className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-300 text-center flex flex-col items-center justify-start h-full"
            >
              <div className="bg-teal-50 text-teal-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-lg shrink-0">
                {item.icon}
              </div>

              <h3 className="font-bold text-slate-900 mb-2 text-base sm:text-lg">
                {t(item.titleKey)}
              </h3>

              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {item.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;