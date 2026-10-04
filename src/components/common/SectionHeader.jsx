import { motion } from "framer-motion";

const SectionHeader = ({
  badge,
  title,
  subtitle,
  className = "",
  align = "center",
  light = false,
  animate = true,
}) => {
  const isLeft = align === "left";
  const alignClasses = isLeft ? "text-left" : "text-center mx-auto";
  const subtitleClasses = isLeft ? "" : "mx-auto";
  const hasCustomMargin = className.includes("mb-") || className.includes("my-") || className.includes("pb-");

  const content = (
    <div className={`max-w-3xl ${alignClasses} ${hasCustomMargin ? "" : "mb-6 sm:mb-10"} ${className}`}>
      {badge && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50/80 border border-teal-200/80 shadow-xs mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d71920] animate-pulse" />
          <span
            className={`uppercase tracking-wider font-bold text-[11px] sm:text-xs ${
              light ? "text-teal-300" : "text-teal-800"
            }`}
          >
            {badge}
          </span>
        </div>
      )}

      {title && (
        <h2
          className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight pb-1 ${
            light
              ? "bg-gradient-to-r from-red-300 via-rose-100 to-teal-300 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-[#d71920] to-[#008272] bg-clip-text text-transparent"
          }`}
        >
          {title}
        </h2>
      )}

      {subtitle && (
        <p
          className={`mt-2.5 sm:mt-3 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl sm:max-w-3xl ${subtitleClasses} ${
            light ? "text-slate-200" : "text-slate-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default SectionHeader;
