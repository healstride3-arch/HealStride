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

const Footer = () => {
  const { t } = useTranslation();
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 items-start">
          
          {/* Column 1: Clinic Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 h-10 sm:h-11">
              <img
                src={logo}
                alt="HealStride Logo"
                className="h-10 w-10 sm:h-11 sm:w-11 object-contain rounded-lg shrink-0"
              />
              <div className="leading-tight">
                <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Heal<span className="text-teal-400">Stride</span>
                </span>
                <span className="block text-[10px] text-teal-300 font-semibold tracking-wider uppercase">
                  Physiotherapy & Wellness
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              HealStride Physiotherapy & Wellness Centre in Bhopal offers personalized root-cause treatment, pain management, and specialized rehabilitation.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/healstride.physio/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-teal-600 text-white flex items-center justify-center transition-colors text-xs"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://wa.me/918809491380"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors text-xs"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-teal-600 text-white flex items-center justify-center transition-colors text-xs"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-teal-600 text-white flex items-center justify-center transition-colors text-xs"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <div className="h-10 sm:h-11 flex items-center">
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                Quick Links
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-teal-400 transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Treatments */}
          <div className="space-y-4">
            <div className="h-10 sm:h-11 flex items-center">
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                Treatments
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>Back & Spine Pain</li>
              <li>Cervical Neck Pain</li>
              <li>Knee Osteoarthritis</li>
              <li>Sciatica & Nerve Pain</li>
              <li>Frozen Shoulder</li>
              <li>Cupping (Hijama) Therapy</li>
              <li>Post-Surgery Rehabilitation</li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <div className="h-10 sm:h-11 flex items-center">
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                Contact Info
              </h3>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              {/* Phones */}
              <div className="flex items-start gap-3">
                <FaPhoneAlt className="text-teal-400 mt-1 shrink-0 text-xs" />
                <div className="flex flex-col space-y-0.5">
                  <a href="tel:+918809491380" className="hover:text-teal-400 transition-colors font-medium text-white">
                    +91 88094 91380
                  </a>
                  <a href="tel:+918252580389" className="hover:text-teal-400 transition-colors text-slate-400">
                    +91 82525 80389
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-teal-400 mt-1 shrink-0 text-xs" />
                <a
                  href="mailto:healstride3@gmail.com"
                  className="hover:text-teal-400 transition-colors break-all"
                >
                  healstride3@gmail.com
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-teal-400 mt-1 shrink-0 text-xs" />
                <span className="text-slate-400 leading-relaxed">
                  LIG 85, Raisen Rd, Near Gurudwara, New Subhash Nagar, Ashoka Garden, Bhopal - 462023
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
            © {new Date().getFullYear()} HealStride Physiotherapy & Wellness Centre. All rights reserved.
          </div>

          {/* Made with Love by TexWeb Solution */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Made with</span>
            <span className="text-rose-500 inline-block animate-pulse text-sm">❤️</span>
            <span>by</span>
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
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-slate-400 hover:text-teal-400 transition cursor-pointer"
            >
              Terms & Policy
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
                  Terms & Clinical Policy
                </h2>
                <p className="text-xs text-slate-500">
                  HealStride Physiotherapy & Wellness Centre
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
                  1. Appointments
                </h3>
                <p>
                  Appointments are scheduled in advance to ensure dedicated one-on-one attention. Please arrive on time for your consultation.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-slate-900 mb-1">
                  2. Patient Assessment & Privacy
                </h3>
                <p>
                  All patient medical records, contact information, and physical assessments are kept strictly confidential.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-slate-900 mb-1">
                  3. Contact & Inquiries
                </h3>
                <p>
                  For any questions or assistance, contact us at <strong>+91 8809491380</strong> or <strong>healstride3@gmail.com</strong>.
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;