import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaPhoneAlt, FaChevronDown, FaMapMarkerAlt, FaCopy, FaCheck, FaDirections, FaExternalLinkAlt } from "react-icons/fa";
import { MapPin, Clock, Phone, Stethoscope, Activity, ShieldCheck, HeartPulse, Zap, ChevronRight, Wrench, CalendarCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { NAVIGATION } from "../../../constants/navigation";
import logo from "../../../assets/images/logo.png";
import LanguageSwitcher from "../../LanguageSwitcher";
import BrandName from "../BrandName";
import { NAVBAR_TREATMENTS_COLUMNS } from "../../../data/treatmentsData";
import { useTreatments } from "../../../hooks/useTreatments";
import { useClinicSettings, DEFAULT_CLINIC_SETTINGS } from "../../../hooks/useClinicSettings";

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
      { name: "Cranio Sacral Therapy", slug: "cranio-sacral-therapy" },
    ],
  },
  {
    title: "Advanced Therapies",
    badge: "Clinical",
    icon: ShieldCheck,
    iconColor: "text-[#008272] bg-teal-50",
    items: [
      { name: "Cupping Therapy", slug: "cupping-therapy" },
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
      { name: "Ultrasound Therapy", slug: "ultrasound-therapy" },
    ],
  },
];

const ALL_SERVICES_FLAT = SERVICES_DROPDOWN_COLUMNS.flatMap((col) => col.items);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [servicesHovered, setServicesHovered] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const [treatmentsHovered, setTreatmentsHovered] = useState(false);
  const [mobileTreatmentsOpen, setMobileTreatmentsOpen] = useState(false);
  const treatmentsHoverTimeoutRef = useRef(null);

  const [branchesHovered, setBranchesHovered] = useState(false);
  const [mobileBranchesOpen, setMobileBranchesOpen] = useState(false);
  const [branchesModalOpen, setBranchesModalOpen] = useState(false);
  const [copiedAddressId, setCopiedAddressId] = useState(null);
  const branchesHoverTimeoutRef = useRef(null);

  const { data: settings } = useClinicSettings();
  const clinic1Address = settings.address || DEFAULT_CLINIC_SETTINGS.address;
  const clinic2Address = settings.address2 || DEFAULT_CLINIC_SETTINGS.address2;

  const branches = [
    {
      id: 1,
      badge: "Clinic 1 • Main Branch",
      name: "Subhash Nagar Clinic",
      address: clinic1Address,
      hours: "Mon - Sat: 9:00 AM - 12:00 PM | 5:00 PM - 9:00 PM",
      phone: settings.phone || "+91 88094 91380",
      mapUrl: `https://maps.google.com/?q=${encodeURIComponent(`Heal Stride Physiotherapy ${clinic1Address}`)}`,
      bookingQuery: "1",
    },
    {
      id: 2,
      badge: "Clinic 2 • Second Clinic",
      name: "Charbatti Chouraha Clinic",
      address: clinic2Address,
      hours: "Mon - Sat: 9:00 AM - 12:00 PM | 5:00 PM - 9:00 PM",
      phone: settings.phone || "+91 88094 91380",
      mapUrl: `https://maps.google.com/?q=${encodeURIComponent(clinic2Address)}`,
      bookingQuery: "2",
    },
  ];

  const { navbarColumns } = useTreatments();
  const treatmentColumns = navbarColumns || NAVBAR_TREATMENTS_COLUMNS;

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
    setTreatmentsHovered(false);
    setBranchesHovered(false);
    setOpen(false);
    setMobileServicesOpen(false);
    setMobileTreatmentsOpen(false);
    setMobileBranchesOpen(false);
  }, [location.pathname]);

  const handleBookAppointment = () => {
    navigate("/booking");
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setTreatmentsHovered(false);
    setBranchesHovered(false);
    setServicesHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setServicesHovered(false);
    }, 180);
  };

  const handleTreatmentsMouseEnter = () => {
    if (treatmentsHoverTimeoutRef.current) {
      clearTimeout(treatmentsHoverTimeoutRef.current);
    }
    setServicesHovered(false);
    setBranchesHovered(false);
    setTreatmentsHovered(true);
  };

  const handleTreatmentsMouseLeave = () => {
    treatmentsHoverTimeoutRef.current = setTimeout(() => {
      setTreatmentsHovered(false);
    }, 180);
  };

  const handleBranchesMouseEnter = () => {
    if (branchesHoverTimeoutRef.current) {
      clearTimeout(branchesHoverTimeoutRef.current);
    }
    setServicesHovered(false);
    setTreatmentsHovered(false);
    setBranchesHovered(true);
  };

  const handleBranchesMouseLeave = () => {
    branchesHoverTimeoutRef.current = setTimeout(() => {
      setBranchesHovered(false);
    }, 180);
  };

  const handleCopy = (text, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedAddressId(id);
      setTimeout(() => setCopiedAddressId(null), 2000);
    }
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    if (path === "/branches") {
      return location.pathname === "/branches" || (location.pathname === "/contact" && location.hash === "#locations");
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

      case "/treatments":
        return t("navbar.treatments", "Treatments");

      case "/branches":
        return t("navbar.branches", "Branches");

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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${servicesHovered || treatmentsHovered
          ? "bg-white border-b border-slate-100 shadow-md"
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
                  <span>Clinic 1: LIG 85 New Subhash Nagar (462023) | Clinic 2: Charbatti Chouraha, Chataipura (462001), Bhopal</span>
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
          <ul className="hidden lg:flex items-center gap-1.5 lg:gap-2 xl:gap-3.5 2xl:gap-6">
            {NAVIGATION.map((item) => {
              const active = isActive(item.path);
              const isServices = item.path === "/services";
              const isTreatments = item.path === "/treatments";
              const isBranches = item.path === "/branches" || item.key === "navbar.branches";

              if (isBranches) {
                return (
                  <li
                    key={item.id}
                    className="relative"
                    onMouseEnter={handleBranchesMouseEnter}
                    onMouseLeave={handleBranchesMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setBranchesHovered(false);
                        setBranchesModalOpen(true);
                      }}
                      className={`
                        px-2.5 py-2 lg:px-3 xl:px-3.5 min-h-[40px] rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer
                        ${active || branchesHovered
                          ? "bg-gradient-to-r from-[#d71920] to-[#008272] text-white shadow-sm"
                          : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
                        }
                      `}
                    >
                      <MapPin size={13} className={active || branchesHovered ? "text-white" : "text-teal-600"} />
                      <span>{getNavigationLabel(item)}</span>
                      <FaChevronDown
                        className={`text-[9px] transition-transform duration-200 ${
                          branchesHovered ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Branches Hover Dropdown Menu */}
                    <AnimatePresence>
                      {branchesHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          onMouseEnter={handleBranchesMouseEnter}
                          onMouseLeave={handleBranchesMouseLeave}
                          className="
                            absolute left-1/2 -translate-x-1/2 top-full mt-2 z-[9999]
                            w-[640px] max-w-[95vw]
                            bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
                            border border-slate-200/90 overflow-hidden text-left
                          "
                        >
                          {/* Dropdown Header */}
                          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="font-bold text-xs sm:text-sm tracking-wide">
                                Heal Stride Clinic Branches
                              </span>
                              <span className="text-[10px] bg-slate-800 text-teal-300 font-semibold px-2 py-0.5 rounded-full border border-teal-500/30">
                                2 Clinics in Bhopal
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setBranchesHovered(false);
                                setBranchesModalOpen(true);
                              }}
                              className="text-xs font-semibold text-teal-300 hover:text-teal-200 underline transition cursor-pointer"
                            >
                              View Both Addresses →
                            </button>
                          </div>

                          {/* 2 Branch Cards Grid */}
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50/60">
                            {branches.map((b) => (
                              <div
                                key={b.id}
                                onClick={() => {
                                  setBranchesHovered(false);
                                  setBranchesModalOpen(true);
                                }}
                                className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between cursor-pointer group"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1 mb-1.5">
                                    <span
                                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                        b.id === 1
                                          ? "bg-teal-100 text-teal-800"
                                          : "bg-rose-100 text-rose-800"
                                      }`}
                                    >
                                      {b.badge}
                                    </span>
                                  </div>

                                  <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5 group-hover:text-teal-700 transition-colors">
                                    <FaMapMarkerAlt
                                      className={`text-xs ${
                                        b.id === 1 ? "text-teal-600" : "text-rose-600"
                                      }`}
                                    />
                                    <span>{b.name}</span>
                                  </h4>

                                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-2">
                                    {b.address}
                                  </p>

                                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-3 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                    <Clock size={12} className="text-teal-600 shrink-0" />
                                    <span className="truncate">{b.hours}</span>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                                  <a
                                    href={b.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-teal-700 transition"
                                  >
                                    <FaDirections className="text-teal-600" />
                                    <span>Directions</span>
                                    <FaExternalLinkAlt className="text-[9px] text-slate-400" />
                                  </a>

                                  <Link
                                    to={`/booking?clinic=${b.bookingQuery}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setBranchesHovered(false);
                                    }}
                                    className="inline-flex items-center gap-1 bg-gradient-to-r from-[#d71920] to-[#008272] hover:opacity-95 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-xs transition"
                                  >
                                    <span>Book Here</span>
                                    <ChevronRight size={11} />
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Dropdown Footer */}
                          <div className="bg-white border-t border-slate-100 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
                            <span className="text-[11px] text-slate-500">
                              Helpline: <strong className="text-slate-800">{settings.phone || "+91 88094 91380"}</strong>
                            </span>

                            <Link
                              to="/contact#locations"
                              onClick={() => setBranchesHovered(false)}
                              className="text-[11px] font-bold text-teal-700 hover:underline inline-flex items-center gap-1"
                            >
                              <span>Explore Interactive Maps</span>
                              <ChevronRight size={12} />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              if (isTreatments) {
                return (
                  <li
                    key={item.id}
                    className="static"
                    onMouseEnter={handleTreatmentsMouseEnter}
                    onMouseLeave={handleTreatmentsMouseLeave}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setTreatmentsHovered(false)}
                      className={`
                        px-3.5 py-2.5 lg:px-4 xl:px-4.5 min-h-[40px] rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 inline-flex items-center justify-center gap-1.5 whitespace-nowrap
                        ${active || treatmentsHovered
                          ? "bg-gradient-to-r from-[#d71920] to-[#008272] text-white shadow-sm"
                          : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
                        }
                      `}
                    >
                      <span>{getNavigationLabel(item)}</span>
                      <FaChevronDown
                        className={`text-[9px] transition-transform duration-200 ${treatmentsHovered ? "rotate-180" : ""
                          }`}
                      />
                    </Link>

                    {/* Treatments Hover Dropdown Menu */}
                    <AnimatePresence>
                      {treatmentsHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          onMouseEnter={handleTreatmentsMouseEnter}
                          onMouseLeave={handleTreatmentsMouseLeave}
                          className="
                            absolute left-0 w-full top-full z-[9999]
                            bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
                            border-b border-slate-200/90
                          "
                          style={{ backgroundColor: "#ffffff" }}
                        >
                          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white" style={{ backgroundColor: "#ffffff" }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-6 gap-6 sm:gap-8 bg-white">
                              {treatmentColumns.map((col, colIdx) => (
                                <div
                                  key={colIdx}
                                  className={`flex flex-col ${
                                    colIdx !== 0 ? "lg:border-l lg:border-slate-100 lg:pl-6" : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-2 pb-2.5 mb-2 border-b border-slate-100">
                                    <span className="w-2 h-2 rounded-full bg-[#008272]" />
                                    <h4 className="text-xs font-bold text-slate-900 leading-tight uppercase tracking-wider truncate">
                                      {col.title}
                                    </h4>
                                    <span className="text-[10px] font-semibold text-slate-400 ml-auto bg-slate-100 px-1.5 py-0.5 rounded-full">
                                      {col.items.length}
                                    </span>
                                  </div>

                                  <div className="flex flex-col space-y-0.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                                    {col.items.map((subItem) => (
                                      <Link
                                        key={subItem.slug}
                                        to={`/treatments/${subItem.slug}`}
                                        onClick={() => setTreatmentsHovered(false)}
                                        className="
                                          py-1.5 px-2 rounded-lg text-[13px] font-semibold text-slate-700
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
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Bottom Quick Action Bar matching user screenshot */}
                            <div className="border-t border-slate-100 bg-slate-50/90 py-3.5 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2 text-slate-700">
                                <span className="w-2 h-2 rounded-full bg-[#d71920] animate-pulse shrink-0" />
                                <span className="font-medium text-slate-600">
                                  Offering 80+ evidence-based, non-surgical pain treatments in Bhopal
                                </span>
                              </div>

                              <Link
                                to="/treatments"
                                onClick={() => setTreatmentsHovered(false)}
                                className="
                                  inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
                                  bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e]
                                  text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition active:scale-95
                                "
                              >
                                <span>VIEW ALL TREATMENTS</span>
                                <ChevronRight size={14} />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

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
                            bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
                            border-b border-slate-200/90
                          "
                          style={{ backgroundColor: "#ffffff" }}
                        >
                          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white" style={{ backgroundColor: "#ffffff" }}>
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
                const isTreatments = item.path === "/treatments";
                const isBranches = item.path === "/branches" || item.key === "navbar.branches";

                if (isBranches) {
                  return (
                    <li key={item.id} className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setMobileBranchesOpen(!mobileBranchesOpen)}
                          className={`
                            flex-1 py-3 px-3.5 min-h-[44px] flex items-center justify-between rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer text-left
                            ${active
                              ? "bg-gradient-to-r from-[#d71920] to-[#008272] text-white shadow-sm"
                              : "text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                            }
                          `}
                        >
                          <span className="flex items-center gap-2">
                            <MapPin size={15} className="text-teal-600 shrink-0" />
                            <span>{getNavigationLabel(item)}</span>
                          </span>
                          <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                            2 Clinics
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobileBranchesOpen(!mobileBranchesOpen)}
                          className="p-2.5 text-slate-500 hover:text-teal-700 text-xs flex items-center font-semibold"
                          aria-label="Toggle Branches List"
                        >
                          <FaChevronDown
                            className={`transition-transform duration-200 text-[10px] ${
                              mobileBranchesOpen ? "rotate-180 text-teal-600" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Mobile Accordion of Branches */}
                      <AnimatePresence>
                        {mobileBranchesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden p-2.5 bg-slate-50 rounded-xl my-1 border border-slate-100 space-y-2.5"
                          >
                            {branches.map((b) => (
                              <div
                                key={b.id}
                                className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-left"
                              >
                                <span
                                  className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md mb-1 ${
                                    b.id === 1 ? "bg-teal-100 text-teal-800" : "bg-rose-100 text-rose-800"
                                  }`}
                                >
                                  {b.badge}
                                </span>
                                <h5 className="font-bold text-slate-900 text-xs mb-1">
                                  {b.name}
                                </h5>
                                <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                                  {b.address}
                                </p>
                                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                                  <a
                                    href={b.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center py-1.5 px-2 bg-slate-100 text-slate-800 rounded font-semibold text-[11px]"
                                  >
                                    Directions
                                  </a>
                                  <Link
                                    to={`/booking?clinic=${b.bookingQuery}`}
                                    onClick={() => setOpen(false)}
                                    className="flex-1 text-center py-1.5 px-2 bg-gradient-to-r from-[#d71920] to-[#008272] text-white rounded font-bold text-[11px]"
                                  >
                                    Book Here
                                  </Link>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                setOpen(false);
                                setBranchesModalOpen(true);
                              }}
                              className="w-full text-center py-2 text-xs font-bold text-teal-700 hover:underline border-t border-slate-200 mt-1 uppercase tracking-wide"
                            >
                              VIEW COMPLETE BRANCH ADDRESSES →
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }

                if (isTreatments) {
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
                          onClick={() => setMobileTreatmentsOpen(!mobileTreatmentsOpen)}
                          className="p-2.5 text-slate-500 hover:text-teal-700 text-xs flex items-center gap-1 font-semibold"
                          aria-label="Toggle Treatments List"
                        >
                          <span>Conditions</span>
                          <FaChevronDown
                            className={`transition-transform duration-200 text-[10px] ${mobileTreatmentsOpen ? "rotate-180 text-teal-600" : ""
                              }`}
                          />
                        </button>
                      </div>

                      {/* Mobile Accordion of Treatments */}
                      <AnimatePresence>
                        {mobileTreatmentsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-2 pr-1 py-2 bg-slate-50 rounded-xl my-1 border border-slate-100"
                          >
                            <div className="max-h-64 overflow-y-auto pr-1 divide-y divide-slate-100 text-xs custom-scrollbar">
                              {treatmentColumns.flatMap(col => col.items).map((tItem) => (
                                <Link
                                  key={tItem.slug}
                                  to={`/treatments/${tItem.slug}`}
                                  onClick={() => {
                                    setOpen(false);
                                    setMobileTreatmentsOpen(false);
                                  }}
                                  className="block py-2 px-2.5 text-slate-700 hover:text-teal-700 hover:bg-white rounded font-medium transition"
                                >
                                  {tItem.name}
                                </Link>
                              ))}
                            </div>
                            <Link
                              to="/treatments"
                              onClick={() => {
                                setOpen(false);
                                setMobileTreatmentsOpen(false);
                              }}
                              className="block text-center py-2.5 text-xs font-bold text-teal-700 hover:underline border-t border-slate-200 mt-2 uppercase tracking-wide"
                            >
                              VIEW ALL 80+ TREATMENTS →
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }

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

      {/* Branches Address Modal */}
      <AnimatePresence>
        {branchesModalOpen && (
          <div
            className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 xs:p-4"
            onClick={() => setBranchesModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-left"
            >
              {/* Modal Header */}
              <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white leading-tight">
                      Heal Stride Clinic Locations &amp; Addresses
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">
                      Both branches in Bhopal, Madhya Pradesh
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setBranchesModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer text-base"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body - Addresses of Clinic 1 and Clinic 2 */}
              <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className={`rounded-2xl p-4 sm:p-5 border-2 transition-all ${
                      b.id === 1
                        ? "bg-teal-50/40 border-teal-200"
                        : "bg-rose-50/40 border-rose-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          b.id === 1
                            ? "bg-teal-100 text-teal-900"
                            : "bg-rose-100 text-rose-900"
                        }`}
                      >
                        <FaMapMarkerAlt />
                        {b.badge}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleCopy(b.address, b.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
                        title="Copy address to clipboard"
                      >
                        {copiedAddressId === b.id ? (
                          <>
                            <FaCheck className="text-emerald-600 text-xs" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <FaCopy className="text-slate-400 text-xs" />
                            <span>Copy Address</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-1.5">
                      {b.name}
                    </h4>

                    {/* Complete Address Highlighted */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed mb-3 font-medium">
                      {b.address}
                    </div>

                    {/* Timings & Helpline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-teal-600 shrink-0" />
                        <span>{b.hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-teal-600 shrink-0" />
                        <span>Helpline: {b.phone}</span>
                      </div>
                    </div>

                    {/* Action Buttons for this Branch */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80">
                      <a
                        href={b.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-xs transition"
                      >
                        <FaDirections className="text-teal-600" />
                        <span>Get Directions on Google Maps</span>
                        <FaExternalLinkAlt className="text-[10px] text-slate-400" />
                      </a>

                      <Link
                        to={`/booking?clinic=${b.bookingQuery}`}
                        onClick={() => setBranchesModalOpen(false)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#d71920] to-[#008272] hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-xs transition"
                      >
                        <CalendarCheck size={13} />
                        <span>Book Appointment at {b.id === 1 ? "Clinic 1" : "Clinic 2"}</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-5 sm:px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Dedicated one-on-one care at both clinic locations in Bhopal</span>
                <button
                  type="button"
                  onClick={() => setBranchesModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
