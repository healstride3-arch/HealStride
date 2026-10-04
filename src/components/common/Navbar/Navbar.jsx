import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaPhoneAlt, FaChevronDown } from "react-icons/fa";
import { MapPin, Clock, Phone, Stethoscope, Activity, ShieldCheck, HeartPulse, Zap, ChevronRight, Wrench, CalendarCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { NAVIGATION } from "../../../constants/navigation";
import logo from "../../../assets/images/logo.png";
import LanguageSwitcher from "../../LanguageSwitcher";
import BrandName from "../BrandName";

// Exact 15 Services categorized with Heal Stride Logo Theme
const SERVICES_DROPDOWN_COLUMNS = [
  {
    title: "Spine & Joint Care",
    badge: "Specialized",
    icon: Activity,
    iconColor: "text-[#d71920] bg-red-50",
    items: [
      { name: "Chiropractic Treatment", slug: "chiropractic-treatment" },
      { name: "Spinal Decompression", slug: "spinal-decompression-therapy" },
      { name: "Posture Correction", slug: "posture-correction-therapy" },
      { name: "Ultrasound Therapy", slug: "ultrasound-therapy" },
    ],
  },
  {
    title: "Advanced Therapies",
    badge: "Clinical",
    icon: ShieldCheck,
    iconColor: "text-[#008272] bg-teal-50",
    items: [
      { name: "Cupping Therapy", slug: "cupping-therapy" },
      { name: "Cranio Sacral Therapy", slug: "cranio-sacral-therapy" },
      { name: "Cryo Therapy", slug: "cryo-therapy" },
      { name: "Laser Therapy", slug: "laser-therapy" },
    ],
  },
  {
    title: "Rehab & Recovery",
    badge: "Personalized",
    icon: HeartPulse,
    iconColor: "text-emerald-700 bg-emerald-50",
    items: [
      { name: "Physiotherapy", slug: "physiotherapy" },
      { name: "Home Physiotherapy", slug: "home-physiotherapy" },
      { name: "Sports Injury Rehab", slug: "sports-injury-rehab" },
      { name: "Stroke Rehab", slug: "stroke-rehab" },
    ],
  },
  {
    title: "Electro & Modern Tech",
    badge: "High-Tech",
    icon: Zap,
    iconColor: "text-amber-600 bg-amber-50",
    items: [
      { name: "Interferential Therapy", slug: "interferential-therapy" },
      { name: "Shockwave Therapy", slug: "shockwave-therapy" },
      { name: "Red Light Therapy", slug: "red-light-therapy" },
    ],
  },
];

const ALL_SERVICES_FLAT = SERVICES_DROPDOWN_COLUMNS.flatMap((col) => col.items);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [servicesHovered, setServicesHovered] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const hoverTimeoutRef = useRef(null);

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

  // Close menus on route change
  useEffect(() => {
    setServicesHovered(false);
    setOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  const handleBookAppointment = () => {
    navigate("/booking");
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setServicesHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setServicesHovered(false);
    }, 180);
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${servicesHovered
          ? "bg-white border-b border-slate-100"
          : scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100/80"
            : "bg-white border-b border-slate-100 shadow-sm"
        }`}
    >
      {/* Top Announcement Marquee */}
      <div className="bg-gradient-to-r from-slate-950 via-[#008272] to-[#d71920] text-white py-1 sm:py-1.5 overflow-hidden text-[11px] sm:text-xs font-semibold tracking-wide border-b border-white/10 select-none shadow-xs">
        <div className="overflow-hidden w-full">
          <div className="animate-hs-marquee flex items-center">
            {[1, 2].map((repeatIndex) => (
              <div key={repeatIndex} className="flex items-center shrink-0">
                <span className="mx-4 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Welcome to Heal Stride Physiotherapy &amp; Wellness Centre Bhopal</span>
                </span>
                <span className="text-white/40">•</span>
                <span className="mx-4 flex items-center gap-1.5">
                  <MapPin size={13} className="text-amber-300 shrink-0" />
                  <span>LIG 85, Raisen Rd, New Subhash Nagar, Bhopal</span>
                </span>
                <span className="text-white/40">•</span>
                <span className="mx-4 flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-300 shrink-0" />
                  <span>Clinic Timings: Mon - Sat 9:00 AM - 9:00 PM</span>
                </span>
                <span className="text-white/40">•</span>
                <span className="mx-4 flex items-center gap-1.5">
                  <Phone size={13} className="text-amber-300 shrink-0" />
                  <span>Call / WhatsApp: +91 88094 91380 / +91 82525 80389</span>
                </span>
                <span className="text-white/40">•</span>
                <span className="mx-4 flex items-center gap-1.5">
                  <Stethoscope size={13} className="text-amber-300 shrink-0" />
                  <span>Specializing in Non-Surgical Pain Relief, Cupping, Dry Needling &amp; Sports Rehab</span>
                </span>
                <span className="text-white/40">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

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
              const isServices = item.path === "/services";

              if (isServices) {
                return (
                  <li
                    key={item.id}
                    className="static"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setServicesHovered(false)}
                      className={`
                        px-3.5 py-2.5 lg:px-4 xl:px-4.5 min-h-[40px] rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 inline-flex items-center justify-center gap-1.5 whitespace-nowrap
                        ${active || servicesHovered
                          ? "bg-gradient-to-r from-[#d71920] to-[#008272] text-white shadow-sm"
                          : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
                        }
                      `}
                    >
                      <span>{getNavigationLabel(item)}</span>
                      <FaChevronDown
                        className={`text-[9px] transition-transform duration-200 ${servicesHovered ? "rotate-180" : ""
                          }`}
                      />
                    </Link>

                    {/* Services Hover Dropdown Menu - Full-Width Pure White Matching Navbar */}
                    <AnimatePresence>
                      {servicesHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          className="
                            absolute left-0 w-full top-full z-[9999]
                            bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)]
                            border-b border-slate-200/90
                          "
                        >
                          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* 4 Categorized Columns Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-6 gap-6 sm:gap-8 bg-white">
                              {SERVICES_DROPDOWN_COLUMNS.map((col, colIdx) => (
                                <div
                                  key={colIdx}
                                  className={`flex flex-col ${colIdx !== 0 ? "lg:border-l lg:border-slate-100 lg:pl-6" : ""
                                    }`}
                                >
                                  {/* Column Category Header */}
                                  <div className="flex items-center gap-2.5 pb-2.5 mb-2 border-b border-slate-100">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${col.iconColor}`}>
                                      <col.icon size={15} />
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                                        {col.title}
                                      </h4>
                                      <span className="text-[10px] font-semibold text-slate-400">
                                        {col.badge}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Items List */}
                                  <div className="flex flex-col space-y-0.5">
                                    {col.items.map((subItem) => (
                                      <Link
                                        key={subItem.slug}
                                        to={`/services/${subItem.slug}`}
                                        onClick={() => setServicesHovered(false)}
                                        className="
                                          py-2 px-2.5 rounded-xl text-[13px] font-semibold text-slate-700
                                          hover:text-[#008272] hover:bg-teal-50/70 transition-all duration-150
                                          flex items-center gap-2 group
                                        "
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#008272] transition-colors shrink-0" />
                                        <span className="group-hover:translate-x-0.5 transition-transform duration-150 truncate">
                                          {subItem.name}
                                        </span>
                                      </Link>
                                    ))}

                                    {/* Col 4 featured highlight for Tools & Equipment */}
                                    {colIdx === 3 && (
                                      <Link
                                        to="/services/tools-equipment"
                                        onClick={() => setServicesHovered(false)}
                                        className="mt-2 p-2 rounded-xl bg-teal-50/60 border border-teal-200/70 hover:border-teal-400 transition-all flex items-center justify-between group shadow-xs"
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 rounded-lg bg-[#008272] text-white flex items-center justify-center shrink-0">
                                            <Wrench size={12} />
                                          </div>
                                          <div>
                                            <p className="text-xs font-bold text-slate-900 group-hover:text-[#008272] transition-colors leading-tight">
                                              Modern Equipment
                                            </p>
                                            <p className="text-[10px] text-slate-500 leading-tight">
                                              Rehab machines &amp; tools →
                                            </p>
                                          </div>
                                        </div>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Bottom Quick Action Bar - Pure White Matching Navbar */}
                            <div className="border-t border-slate-100 bg-white py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2 text-slate-700">
                                <span className="w-2 h-2 rounded-full bg-[#d71920] animate-pulse shrink-0" />
                                <span className="font-medium text-slate-600">
                                  Explore all 15+ clinical therapies:
                                </span>
                                <Link
                                  to="/services"
                                  onClick={() => setServicesHovered(false)}
                                  className="font-bold text-[#008272] hover:text-[#d71920] underline transition-colors"
                                >
                                  View All Services →
                                </Link>
                              </div>

                              <div className="flex items-center gap-3">
                                <Link
                                  to="/services/tools-equipment"
                                  onClick={() => setServicesHovered(false)}
                                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#008272] font-semibold transition-colors"
                                >
                                  <Wrench size={13} className="text-[#008272]" />
                                  <span>Advanced Equipment</span>
                                </Link>
                                <Link
                                  to="/booking"
                                  onClick={() => setServicesHovered(false)}
                                  className="bg-gradient-to-r from-[#d71920] to-[#008272] hover:opacity-95 text-white font-bold px-4 py-2 min-h-[36px] rounded-xl text-xs shadow-sm transition"
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    <CalendarCheck size={13} className="shrink-0" />
                                    <span>{t("navbar.bookAppointment", "Book Appointment")}</span>
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              return (
                <motion.li
                  key={item.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={item.path}
                    className={`
                      px-3.5 py-2.5 lg:px-4 xl:px-4.5 min-h-[40px] rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 inline-flex items-center justify-center whitespace-nowrap
                      ${active
                        ? "bg-gradient-to-r from-[#d71920] to-[#008272] text-white shadow-sm"
                        : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
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
                inline-flex
                items-center
                justify-center
                gap-1.5
                bg-gradient-to-r from-[#d71920] to-[#008272]
                text-white
                px-3.5
                py-2.5
                lg:px-4
                xl:px-4.5
                xl:py-2.5
                min-h-[40px]
                rounded-xl
                hover:from-[#b91c1c] hover:to-[#0f766e]
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
                cursor-pointer
              "
            >
              <CalendarCheck size={14} className="shrink-0" />
              <span>{t("navbar.bookAppointment")}</span>
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
                inline-flex
                items-center
                justify-center
                gap-1.5
                bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e]
                text-white
                px-4
                py-2.5
                min-h-[38px]
                rounded-xl
                text-xs
                font-semibold
                cursor-pointer
              "
            >
              <CalendarCheck size={13} className="shrink-0" />
              <span>{t("navbar.bookAppointment")}</span>
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
                const isServices = item.path === "/services";

                if (isServices) {
                  return (
                    <li key={item.id} className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <Link
                          to={item.path}
                          onClick={() => setOpen(false)}
                          className={`
                            flex-1 py-3 px-3.5 min-h-[44px] flex items-center rounded-xl font-semibold text-sm transition-all duration-200
                            ${active
                              ? "bg-gradient-to-r from-[#d71920] to-[#008272] text-white shadow-sm"
                              : "text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                            }
                          `}
                        >
                          {getNavigationLabel(item)}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className="p-2.5 text-slate-500 hover:text-teal-700 text-xs flex items-center gap-1 font-semibold"
                          aria-label="Toggle Services List"
                        >
                          <span>Treatments</span>
                          <FaChevronDown
                            className={`transition-transform duration-200 text-[10px] ${mobileServicesOpen ? "rotate-180 text-teal-600" : ""
                              }`}
                          />
                        </button>
                      </div>

                      {/* Mobile Accordion of Services */}
                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-2 pr-1 py-2 bg-slate-50 rounded-xl my-1 border border-slate-100"
                          >
                            <div className="max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100 text-xs">
                              {ALL_SERVICES_FLAT.map((svc) => (
                                <Link
                                  key={svc.slug}
                                  to={`/services/${svc.slug}`}
                                  onClick={() => {
                                    setOpen(false);
                                    setMobileServicesOpen(false);
                                  }}
                                  className="block py-2 px-2.5 text-slate-700 hover:text-teal-700 hover:bg-white rounded font-medium transition"
                                >
                                  {svc.name}
                                </Link>
                              ))}
                            </div>
                            <Link
                              to="/services"
                              onClick={() => {
                                setOpen(false);
                                setMobileServicesOpen(false);
                              }}
                              className="block text-center py-2 text-xs font-bold text-teal-700 hover:underline border-t border-slate-200 mt-2"
                            >
                              View All 20+ Treatments →
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }

                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={`
                        block py-3 px-3.5 min-h-[44px] flex items-center rounded-xl font-semibold text-sm transition-all duration-200
                        ${active
                          ? "bg-gradient-to-r from-[#d71920] to-[#008272] text-white shadow-sm"
                          : "text-gray-700 hover:bg-teal-50 hover:text-teal-700"
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
                inline-flex
                items-center
                justify-center
                gap-2
                bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e]
                text-white
                py-2.5
                rounded-xl
                font-semibold
                text-sm
                cursor-pointer
              "
            >
              <CalendarCheck size={16} className="shrink-0" />
              <span>{t("navbar.bookAppointment")}</span>
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
              <img src="/call.png" alt="Call" className="w-3.5 h-3.5 object-contain shrink-0" />
              <span className="leading-snug">{t("navbar.callClinic")}</span>
            </a>

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
