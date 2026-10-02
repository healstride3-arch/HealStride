import React from "react";

/**
 * BrandName Component
 * Matches the official Heal Stride logo color palette and typographic design:
 * - "Heal" in bold royal blue gradient
 * - "Stride" in bold fresh green gradient
 * - "Physiotherapy & Wellness" in clearly legible, elegant slate/grey font
 *
 * Designed with high contrast visibility for both light and dark backgrounds.
 */
export const BrandName = ({
  variant = "light", // "light" | "dark"
  size = "md", // "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  showSubtitle = true,
  subtitleText = "Physiotherapy & Wellness Centre",
  className = "",
  centered = false,
}) => {
  const isDark = variant === "dark";

  // Responsive font sizes for the brand title with tight line-height
  const titleSizes = {
    xs: "text-sm sm:text-base leading-none",
    sm: "text-base sm:text-lg leading-none",
    md: "text-[15px] xs:text-base sm:text-lg md:text-[20px] leading-none",
    lg: "text-lg sm:text-xl md:text-2xl leading-none",
    xl: "text-2xl sm:text-3xl md:text-4xl leading-none",
    "2xl": "text-3xl sm:text-5xl md:text-6xl leading-none",
  };

  // Responsive font sizes for the subtitle (refined, smaller, perfectly proportional)
  const subtitleSizes = {
    xs: "text-[7.5px] xs:text-[8px]",
    sm: "text-[8px] xs:text-[8.5px] sm:text-[9px]",
    md: "text-[7.5px] xs:text-[8px] sm:text-[9px] md:text-[10px]",
    lg: "text-[8.5px] sm:text-[9.5px] md:text-[11px]",
    xl: "text-[10px] sm:text-xs md:text-sm",
    "2xl": "text-xs sm:text-sm md:text-base",
  };

  return (
    <div
      className={`inline-flex flex-col leading-none ${
        centered ? "items-center text-center justify-center" : "items-start text-left"
      } ${className}`}
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* Brand Title: Heal Stride */}
      <span
        className={`font-extrabold tracking-tight inline-flex items-center gap-[0.22em] leading-none ${
          centered ? "justify-center" : ""
        } ${titleSizes[size] || titleSizes.md}`}
      >
        <span
          className={`select-none ${
            isDark
              ? "bg-gradient-to-b from-[#f87171] to-[#dc2626] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
              : "bg-gradient-to-b from-[#dc2626] to-[#b91c1c] bg-clip-text text-transparent"
          }`}
          style={{
            // High visibility fallback
            color: isDark ? "#ef4444" : "#d71920",
          }}
        >
          Heal
        </span>
        <span
          className={`select-none ${
            isDark
              ? "bg-gradient-to-b from-[#2dd4bf] to-[#0d9488] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
              : "bg-gradient-to-b from-[#008272] to-[#0f766e] bg-clip-text text-transparent"
          }`}
          style={{
            // High visibility fallback
            color: isDark ? "#2dd4bf" : "#008272",
          }}
        >
          Stride
        </span>
      </span>

      {/* Subtitle: Physiotherapy & Wellness */}
      {showSubtitle && (
        <span
          className={`font-medium tracking-[0.02em] mt-[2px] select-none leading-none w-full ${
            centered ? "text-center" : "text-left"
          } ${subtitleSizes[size] || subtitleSizes.md} ${
            isDark
              ? "text-slate-300/90 font-medium drop-shadow-sm"
              : "text-slate-500 font-medium"
          }`}
        >
          {subtitleText}
        </span>
      )}
    </div>
  );
};

export default BrandName;
