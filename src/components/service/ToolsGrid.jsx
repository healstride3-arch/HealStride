import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const toolsData = [
  {
    title: "Ultrasound Therapy Machine",
    image: "/tool1.jpg",
    description: "Uses sound waves to reduce pain and promote healing.",
  },
  {
    title: "TENS Machine",
    image: "/tool2.jpg",
    description: "Electrical stimulation device used for pain relief.",
  },
  {
    title: "IASTM Tools",
    image: "/tool3.webp",
    description: "Used for soft tissue mobilization and recovery.",
  },
  {
    title: "Cupping Therapy Set",
    image: "/tool4.jpg",
    description: "Improves blood circulation and reduces muscle tension.",
  },
  {
    title: "Resistance Bands",
    image: "/tool5.jpg",
    description: "Helpful for rehabilitation and strength training.",
  },
  {
    title: "Exercise Ball",
    image: "/tool6.webp",
    description: "Improves balance, posture, and core strength.",
  },
  {
    title: "Foam Roller",
    image: "/tool7.jpg",
    description:
      "Helps release muscle tightness, improve flexibility, and support recovery.",
  },
  {
    title: "Balance Board",
    image: "/tool8.webp",
    description:
      "Used for balance training, coordination improvement, and rehabilitation.",
  },
  {
    title: "Hot & Cold Therapy Pack",
    image: "/tool9.png",
    description:
      "Provides pain relief, reduces swelling, and promotes healing.",
  },
  {
    title: "Traction Unit",
    image: "/tool10.jpg",
    description:
      "Used to relieve pressure on the spine and improve mobility.",
  },
  {
    title: "Parallel Bars",
    image: "/tool11.jpg",
    description:
      "Supports gait training and balance rehabilitation exercises.",
  },
  {
    title: "Shoulder Pulley",
    image: "/tool12.jpg",
    description:
      "Helps improve shoulder mobility and range of motion.",
  },
  {
    title: "Therapy Table",
    image: "/tool13.webp",
    description:
      "Specialized treatment table used during physiotherapy sessions.",
  },
  {
    title: "Hand Exercise Trainer",
    image: "/tool14.jpg",
    description:
      "Improves grip strength, finger mobility, and hand rehabilitation.",
  },
  {
    title: "Stationary Exercise Bike",
    image: "/tool15.jpg",
    description:
      "Supports cardiovascular fitness and lower-limb rehabilitation.",
  },
  {
    title: "Treadmill Rehabilitation System",
    image: "/tool16.jpeg",
    description:
      "Used for gait training, endurance improvement, and recovery.",
  },
];

const ToolsGrid = () => {
  const { t } = useTranslation();

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-slate-50 border-b border-slate-100 min-h-[50vh] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            {t("toolsGrid.title")}
          </h2>

          <p className="mt-2.5 sm:mt-3 text-slate-600 text-xs sm:text-base leading-relaxed">
            {t("toolsGrid.subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {toolsData.map((tool, index) => (
            <motion.div
              key={index}
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
                  src={tool.image}
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