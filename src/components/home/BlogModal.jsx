import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, CheckCircle2, Phone, CalendarCheck, Sparkles, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../assets/images/logo.png";
import BrandName from "../common/BrandName";

const BlogModal = ({ blog, isOpen, onClose }) => {
  const { t } = useTranslation();
  if (!isOpen || !blog) return null;

  const blogTitle = t(`blogsList.blog${blog.id}.title`, { defaultValue: blog.title });
  const blogDesc = t(`blogsList.blog${blog.id}.desc`, { defaultValue: blog.description });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-teal-500 overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Top Sticky Header */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 sm:py-4 bg-slate-900 text-white border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-teal-300 uppercase">
                {t("blogModal.headerTitle", "HealStride Health Article")}
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Article Body */}
          <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-slate-700">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-semibold border border-teal-200">
                <User className="w-3.5 h-3.5" />
                <span>{t("blogSection.authorBadge", "HealStride Physiotherapy")}</span>
              </span>

              <span className="inline-flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  {blog.createdAt?.seconds
                    ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString()
                    : blog.date || "August 2026"}
                </span>
              </span>
            </div>

            {/* Article Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              {blogTitle}
            </h1>

            {/* Featured Image */}
            <div className="w-full h-56 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              <img
                src={blog.coverImage || blog.image}
                alt={blogTitle}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Short Description Box */}
            {blog.description && (
              <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-950 font-medium text-xs sm:text-sm sm:leading-relaxed flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">{t("blogModal.summary", "Summary")}:</span> {blogDesc}
                </div>
              </div>
            )}

            {/* Article Content / Paragraphs */}
            {Array.isArray(blog.content) ? (
              <div className="space-y-6 pt-2">
                {blog.content.map((sec, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 space-y-2">
                    {sec.heading && (
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span>{sec.heading}</span>
                      </h3>
                    )}
                    {sec.text && (
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-6">
                        {sec.text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : typeof blog.content === "string" ? (
              <div className="whitespace-pre-line text-slate-700 text-sm sm:text-base leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
                {blog.content}
              </div>
            ) : null}

            {/* Author / Clinic Verification Banner */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-teal-500/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-teal-100 p-1.5 flex items-center justify-center shadow-sm flex-shrink-0">
                  <img src={logo} alt="Heal Stride Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-0.5">{t("blogModal.writtenBy", "Written & Clinically Verified By")}</p>
                  <BrandName variant="light" size="xs" showSubtitle={true} />
                </div>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to="/booking"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#d71920] to-[#008272] hover:from-[#b91c1c] hover:to-[#0f766e] active:scale-95 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>{t("navbar.bookAppointment", "Book Appointment")}</span>
                </Link>
                <a
                  href="tel:+918809491380"
                  className="inline-flex items-center justify-center gap-1.5 bg-white border border-teal-300 text-teal-700 hover:bg-teal-50 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-colors shadow-sm"
                >
                  <img src="/call.png" alt="Call" className="w-3.5 h-3.5 object-contain" />
                  <span>{t("blogModal.callUs", "Call Us")}</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BlogModal;
