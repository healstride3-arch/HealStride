import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import logo from "../../../../assets/images/logo.png";
import BrandName from "../../BrandName";
import { useClinicSettings } from "../../../../hooks/useClinicSettings";

const Footer = () => {
  const { t } = useTranslation();
  const [showTerms, setShowTerms] = useState(false);
  const { data: settings } = useClinicSettings();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 items-start">
          
          {/* Column 1: Clinic Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logo}
                alt="Heal Stride Logo"
                className="h-10 w-10 sm:h-11 sm:w-11 object-contain rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-105"
              />
              <BrandName
                variant="dark"
                size="lg"
                showSubtitle={true}
              />
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {t("footer.desc")}
            </p>

            {/* Social Links with Authentic Brand Colors on Hover */}
            <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
              <a
                href={settings.instagram || DEFAULT_SETTINGS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn social-icon-instagram"
                aria-label="Instagram"
              >
                <FaInstagram className="text-[16px]" />
              </a>

              <a
                href={`https://wa.me/${String(settings.whatsapp || settings.phone || "").replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn social-icon-whatsapp"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-[16px]" />
              </a>

              <a
                href={settings.facebook || DEFAULT_SETTINGS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn social-icon-facebook"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-[14px]" />
              </a>

              <a
                href={settings.linkedin || DEFAULT_SETTINGS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn social-icon-linkedin"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="text-[14px]" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <div className="h-10 sm:h-11 flex items-center">
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                {t("footer.quickLinks")}
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">
                  {t("navbar.home")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">
                  {t("navbar.about")}
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-400 transition-colors">
                  {t("navbar.services")}
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-teal-400 transition-colors">
                  {t("navbar.doctors")}
                </Link>
              </li>
              <li>
                <Link to="/staff" className="hover:text-teal-400 transition-colors">
                  {t("navbar.staff")}
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-teal-400 transition-colors">
                  {t("navbar.bookAppointment")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition-colors">
                  {t("navbar.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Treatments */}
          <div className="space-y-4">
            <div className="h-10 sm:h-11 flex items-center">
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                {t("footer.treatments")}
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>{t("footer.backSpine")}</li>
              <li>{t("footer.cervicalNeck")}</li>
              <li>{t("footer.kneeOsteo")}</li>
              <li>{t("footer.sciaticaNerve")}</li>
              <li>{t("footer.frozenShoulder")}</li>
              <li>{t("footer.cuppingTherapy")}</li>
              <li>{t("footer.postSurgery")}</li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <div className="h-10 sm:h-11 flex items-center">
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                {t("footer.contact")}
              </h3>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              {/* Phones */}
              <div className="flex items-start gap-3">
                <FaPhoneAlt className="text-teal-400 mt-1 shrink-0 text-xs" />
                <div className="flex flex-col space-y-0.5">
                  <a href={`tel:${settings.phone}`} className="hover:text-teal-400 transition-colors font-medium text-white">
                    {settings.phone}
                  </a>
                  <a href={`tel:${settings.whatsapp}`} className="hover:text-teal-400 transition-colors text-slate-400">
                    {settings.whatsapp}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-teal-400 mt-1 shrink-0 text-xs" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-teal-400 transition-colors break-all"
                >
                  {settings.email}
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-teal-400 mt-1 shrink-0 text-xs" />
                <span className="text-slate-400 leading-relaxed">
                  {settings.address}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {t("footer.rights")}
          </div>

          {/* Made with Love by TexWeb Solution */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>{t("footer.madeWith")}</span>
            <span className="text-rose-500 inline-block animate-pulse text-sm">❤️</span>
            <span>{t("footer.by")}</span>
            <a
              href="https://texwebsolution.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 font-semibold transition-colors underline-offset-2 hover:underline"
            >
              TexWeb Solution
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/adminlogin"
              className="text-slate-400 hover:text-teal-400 transition"
            >
              {t("footer.adminLogin")}
            </Link>
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-slate-400 hover:text-teal-400 transition cursor-pointer"
            >
              {t("footer.termsPolicy")}
            </button>
          </div>
        </div>
      </div>

      {/* Terms & Policy Modal */}
      {showTerms && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowTerms(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 sm:px-8 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {t("footer.termsTitle")}
                </h2>
                <p className="text-xs text-slate-500">
                  {t("footer.termsSubtitle")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition text-xl cursor-pointer"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 sm:px-8 py-5 space-y-4 text-gray-700 text-xs sm:text-sm leading-relaxed">
              <section>
                <h3 className="font-bold text-slate-900 mb-1">
                  {t("footer.term1Title")}
                </h3>
                <p>
                  {t("footer.term1Desc")}
                </p>
              </section>

              <section>
                <h3 className="font-bold text-slate-900 mb-1">
                  {t("footer.term2Title")}
                </h3>
                <p>
                  {t("footer.term2Desc")}
                </p>
              </section>

              <section>
                <h3 className="font-bold text-slate-900 mb-1">
                  {t("footer.term3Title")}
                </h3>
                <p>
                  {t("footer.term3Desc")}
                </p>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 sm:px-8 py-3.5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                {t("footer.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
