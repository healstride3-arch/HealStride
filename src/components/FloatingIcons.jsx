import { motion } from "framer-motion";
import { HeartPulse, Activity, Stethoscope } from "lucide-react";

const FloatingIcons = () => {
  return (
    <div className="pointer-events-none z-0 overflow-hidden">
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="hidden md:block absolute top-24 left-6 text-teal-500/15"
      >
        <HeartPulse size={36} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="hidden md:block absolute right-8 top-36 text-teal-400/15"
      >
        <Activity size={32} />
      </motion.div>
    </div>
  );
};

export default FloatingIcons;