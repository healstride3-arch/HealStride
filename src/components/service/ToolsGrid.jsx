import SectionHeader from "../common/SectionHeader";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { toolsData as staticToolsData } from "../../data/toolsData";

const ToolsGrid = () => {
  const { t } = useTranslation();
  const { items: tools } = useFirestoreCollection("tools", {
    fallback: staticToolsData,
  });

  const activeTools = (tools || []).filter((tool) => tool.active !== false);

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-slate-50 border-b border-slate-100 min-h-[50vh] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <SectionHeader
          badge={t("toolsGrid.badge", "Modern Rehabilitation")}
          title={t("toolsGrid.title", "Advanced Tools & Clinical Equipment")}
          subtitle={t("toolsGrid.subtitle", "State-of-the-art rehabilitation technology engineered for fast, lasting musculoskeletal recovery.")}
        />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {activeTools.map((tool, index) => (
            <motion.div
              key={tool.id || tool.title || index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
              }}
              whileHover={{ y: -4 }}
              className="
                group
                flex
                flex-col
                h-full
                bg-white
                rounded-2xl
                overflow-hidden
                border
                border-slate-100
                shadow-sm
                hover:shadow-xl
                hover:border-teal-200
                transition-all
                duration-300
              "
            >
              {/* Image */}
              <div className="h-48 sm:h-52 overflow-hidden w-full flex-shrink-0">
                <img
                  src={tool.imageUrl || tool.image}
                  alt={tool.title}
                  className="
                    w-full
                    h-full
                    object-cover
                    group-hover:scale-105
                    transition-transform
                    duration-300
                  "
                />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  {tool.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsGrid;
