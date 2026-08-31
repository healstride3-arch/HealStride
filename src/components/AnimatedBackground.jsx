import { motion } from "framer-motion";
import {
  HeartPulse,
  Activity,
  Stethoscope,
  Cross,
} from "lucide-react";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating Heart Icon */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="hidden md:block absolute top-28 left-6 lg:left-12 text-teal-600/22"
      >
        <HeartPulse size={44} />
      </motion.div>

      {/* Floating Activity Icon */}
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="hidden md:block absolute top-44 right-8 lg:right-16 text-teal-600/22"
      >
        <Activity size={40} />
      </motion.div>

      {/* Floating Stethoscope */}
      <motion.div
        animate={{
          y: [0, -18, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="hidden lg:block absolute bottom-36 left-12 text-teal-600/22"
      >
        <Stethoscope size={50} />
      </motion.div>

      {/* Medical Cross */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="hidden lg:block absolute bottom-24 right-16 text-teal-600/22"
      >
        <Cross size={36} />
      </motion.div>

      {/* Subtle Soft Glow Circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="
          absolute
          top-1/3
          left-1/2
          w-72
          h-72
          -translate-x-1/2
          rounded-full
          bg-teal-200
          blur-3xl
          pointer-events-none
        "
      />
    </div>
  );
};

export default AnimatedBackground;