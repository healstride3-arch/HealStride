import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaPhoneAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { NAVIGATION } from "../../../constants/navigation";
import logo from "../../../assets/images/logo.png";
import LanguageSwitcher from "../../LanguageSwitcher";
import BrandName from "../BrandName";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBookAppointment = () => {
    navigate("/booking");
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const getNavigationLabel = (item) => {
    if (item.key) {
      return t(item.key);
    }

    switch (item.path) {
      case "/":
        return t("navbar.home");

      case "/about":
        return t("navbar.about");

      case "/services":
        return t("navbar.services");

      case "/contact":
        return t("navbar.contact");

      default:
        return item.title;
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100/80"
          : "bg-white border-b border-slate-100 shadow-sm"
      }`}
    >
      <div className="max-w-[1600px] mx-auto h-14 sm:h-16 px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">

          {/* Logo & Brand */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="shrink-0"
          >
            <Link
              to="/"
              className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 group py-0.5"
            >
              <img
                src={logo}
                alt="Heal Stride Logo"
                className="
                  h-8 w-8
                  xs:h-9 xs:w-9
                  sm:h-10 sm:w-10
                  object-contain
                  shrink-0
                  transition-transform duration-200 group-hover:scale-105
                "
              />

              <BrandName
                variant="light"
                size="md"
                showSubtitle={true}
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-2 lg:gap-2.5 xl:gap-5 2xl:gap-8">
            {NAVIGATION.map((item) => {
              const active = isActive(item.path);
              return (
                <motion.li
                  key={item.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={item.path}
                    className={`
                      px-3 py-1.5 lg:px-3.5 xl:px-4 xl:py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 block whitespace-nowrap
                      ${
                        active
                          ? "bg-gradient-to-r from-[#0066cc] to-[#16a34a] text-white shadow-sm"
                          : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                      }
                    `}
                  >
                    {getNavigationLabel(item)}
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2.5 lg:gap-3 xl:gap-5 2xl:gap-6 flex-shrink-0">

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Appointment Button */}
            <button
              onClick={handleBookAppointment}
              className="
                bg-teal-700
                text-white
                px-3
                py-1.5
                lg:px-3.5
                xl:px-4
                xl:py-1.5
                rounded-lg
                hover:bg-teal-800
                hover:scale-105
                hover:shadow-md
                transition-all
                duration-300
                transform
                active:scale-95
                font-semibold
                text-xs xl:text-sm
                shadow-sm
                whitespace-nowrap
              "
            >
              {t("navbar.bookAppointment")}
            </button>

          </div>

          {/* Tablet Actions */}
          <div className="hidden md:flex lg:hidden items-center gap-3">

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Tablet Appointment Button */}
            <button
              onClick={handleBookAppointment}
              className="
                bg-gradient-to-r from-[#0066cc] to-[#16a34a] hover:from-[#0052a3] hover:to-[#15803d]
                text-white
                px-3.5
                py-1.5
                rounded-lg
                text-xs
                font-semibold
              "
            >
              {t("navbar.bookAppointment")}
            </button>

            {/* Tablet Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="text-teal-700 text-xl p-1"
              aria-label="Toggle Navigation"
            >
              {open ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setOpen(!open)}
              className="
                text-teal-700
                text-xl
                p-1.5
              "
              aria-label="Toggle Navigation"
            >
              {open ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="
              lg:hidden
              bg-white
              border-t
              shadow-lg
              px-3
              xs:px-4
              py-4
              max-h-[80vh]
              overflow-y-auto
            "
          >

            {/* Navigation Links */}
            <ul className="flex flex-col gap-1.5">
              {NAVIGATION.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={`
                        block py-2.5 px-3 xs:px-3.5 rounded-lg font-semibold text-sm transition-all duration-200
                        ${
                          active
                            ? "bg-gradient-to-r from-[#0066cc] to-[#16a34a] text-white shadow-sm"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        }
                      `}
                    >
                      {getNavigationLabel(item)}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Language Switcher */}
            <LanguageSwitcher variant="mobile" />

            {/* Appointment Button */}
            <button
              onClick={() => {
                setOpen(false);
                handleBookAppointment();
              }}
              className="
                w-full
                mt-4
                bg-gradient-to-r from-[#0066cc] to-[#16a34a] hover:from-[#0052a3] hover:to-[#15803d]
                text-white
                py-2.5
                rounded-xl
                font-semibold
                text-sm
              "
            >
              {t("navbar.bookAppointment")}
            </button>

            {/* Quick Call Button */}
            <a
              href="tel:+918809491380"
              className="
                flex
                items-center
                justify-center
                gap-2
                w-full
                mt-2.5
                bg-slate-900
                text-white
                py-2.5
                rounded-xl
                font-semibold
                text-sm
                shadow-sm
              "
            >
              <FaPhoneAlt className="text-teal-400 text-xs" />
              <span className="leading-snug">{t("navbar.callClinic")}</span>
            </a>

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
