import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useClinicSettings, DEFAULT_CLINIC_SETTINGS } from "../../hooks/useClinicSettings";
import SectionHeader from "../common/SectionHeader";

const ContactInfo = () => {
  const { t } = useTranslation();
  const { data: settings } = useClinicSettings();
  const phones = [settings.phone, settings.whatsapp].filter(Boolean);
  const hours = String(settings.hours || "").split("\n").filter(Boolean);

  const contactItems = [
    {
      icon: <img src="/call.png" alt="Call" className="w-5 h-5 object-contain" />,
      titleKey: "contactInfo.phone",
      content: (
        <a
          href="tel:+918809491380"
          className="text-gray-600 hover:text-teal-600 transition"
        >
          {phones.map((phone) => (
            <div key={phone}>{phone}</div>
          ))}
        </a>
      ),
    },
    {
      icon: <FaEnvelope />,
      titleKey: "contactInfo.email",
      content: (
        <a
          href={`mailto:${settings.email}`}
          className="text-gray-600 hover:text-teal-600 transition break-all"
        >
          {settings.email}
        </a>
      ),
    },
    {
      icon: <FaMapMarkerAlt />,
      titleKey: "contactInfo.address",
      content: (
        <div className="space-y-3 text-left w-full mt-1">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 transition-colors">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                {t("contactInfo.clinic1Title", "Clinic 1 • Subhash Nagar")}
              </span>
            </div>
            <p className="text-gray-600 text-xs sm:text-[13px] leading-relaxed">
              {settings.address || DEFAULT_CLINIC_SETTINGS.address}
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.address || DEFAULT_CLINIC_SETTINGS.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 hover:text-teal-700 hover:underline mt-1.5"
            >
              <span>Get Directions</span> →
            </a>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-red-300 transition-colors">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider">
                {t("contactInfo.clinic2Title", "Clinic 2 • Charbatti Chouraha")}
              </span>
            </div>
            <p className="text-gray-600 text-xs sm:text-[13px] leading-relaxed">
              {settings.address2 || DEFAULT_CLINIC_SETTINGS.address2}
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.address2 || DEFAULT_CLINIC_SETTINGS.address2)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline mt-1.5"
            >
              <span>Get Directions</span> →
            </a>
          </div>
        </div>
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

          {hours.map((line) => (
            <p key={line} className="font-medium text-slate-800 mt-1">
              {line}
            </p>
          ))}

        </>
      ),
    },
  ];

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge={t("contactInfo.badge")}
          title={t("contactInfo.title")}
          subtitle={t("contactInfo.subtitle")}
        />

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
