import SectionHeader from "../common/SectionHeader";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FaUsers,
  FaStar,
  FaCalendarAlt,
  FaHeartbeat,
} from "react-icons/fa";

const statsData = [
  {
    icon: <FaUsers size={26} />,
    number: "2500+",
    titleKey: "googleRating.statHappyPatients",
  },
  {
    icon: <FaCalendarAlt size={26} />,
    number: "5+",
    titleKey: "googleRating.statYearsExperience",
  },
  {
    icon: <FaStar size={26} />,
    number: "4.7",
    titleKey: "googleRating.statGoogleRating",
  },
  {
    icon: <FaHeartbeat size={26} />,
    number: "5000+",
    titleKey: "googleRating.statSuccessfulTreatments",
  },
];

const AnimatedCounter = ({ value }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "0px 0px -30px 0px", amount: 0.1 });

  useEffect(() => {
    if (!isInView) {
      setDisplayValue("0");
      return;
    }
    const numericTarget = parseFloat(value.replace(/[^0-9.]/g, ""));
    const hasPlus = value.includes("+");
    const isDecimal = value.includes(".");

    if (isNaN(numericTarget)) {
      setDisplayValue(value);
      return;
    }

    let current = 0;
    const duration = 1200;
    const steps = 30;
    const increment = numericTarget / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericTarget) {
        setDisplayValue(
          isDecimal
            ? numericTarget.toFixed(1) + (hasPlus ? "+" : "")
            : Math.floor(numericTarget) + (hasPlus ? "+" : "")
        );
        clearInterval(timer);
      } else {
        setDisplayValue(
          isDecimal
            ? current.toFixed(1) + (hasPlus ? "+" : "")
            : Math.floor(current) + (hasPlus ? "+" : "")
        );
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{displayValue}</span>;
};

const GoogleRating = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-teal-50/30 py-8 sm:py-10 lg:py-14 border-y border-slate-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          badge={t("googleRating.badge")}
          title={t("googleRating.title")}
          subtitle={t("googleRating.subtitle")}
          className="mb-6 sm:mb-8"
        />

        {/* Equal Height Grid Cards */}
        <div className="grid grid-cols-2 grid-cols-2-preserve md:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-4 lg:gap-6 items-stretch">
          {statsData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              className="
                bg-white
                rounded-xl
                xs:rounded-2xl
                p-2.5
                xs:p-3.5
                sm:p-5
                lg:p-6
                border
                border-slate-100
                shadow-sm
                hover:shadow-md
                hover:border-teal-200/80
                transition-all
                duration-250
                flex
                flex-col
                items-center
                justify-center
                text-center
                h-full
                min-h-[110px]
                xs:min-h-[135px]
                sm:min-h-[160px]
              "
            >
              {/* Icon Container (36-44px) */}
              <div
                className={`w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-xl ${
                  index % 2 === 0
                    ? "bg-red-50 text-[#d71920]"
                    : "bg-teal-50 text-[#008272]"
                } flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-2.5 flex-shrink-0 text-sm xs:text-base sm:text-xl transition-colors`}
              >
                {item.icon}
              </div>

              {/* Stat Number (Strongest Element) */}
              <h3
                className={`text-lg xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold ${
                  index % 2 === 0 ? "text-[#b91c1c]" : "text-[#0f766e]"
                } tracking-tight flex items-center gap-0.5 sm:gap-1`}
              >
                <AnimatedCounter value={item.number} />
                {(item.number === "4.9" || item.number === "4.7") && <FaStar className="text-amber-400 text-xs xs:text-sm sm:text-xl ml-0.5 xs:ml-1 shrink-0" />}
              </h3>

              {/* Stat Label (12-14px) */}
              <p className="mt-0.5 xs:mt-1 text-[11px] xs:text-[13px] sm:text-sm font-semibold text-slate-600 leading-snug">
                {t(item.titleKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoogleRating;
