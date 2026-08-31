import { motion } from "framer-motion";
import logo from "../../assets/images/logo.png";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center">

        {/* Floating Ring */}
        <div className="absolute w-60 h-60 border border-teal-400/20 rounded-full animate-ping" />
        <div className="absolute w-72 h-72 border border-cyan-400/10 rounded-full animate-pulse" />

        {/* Logo */}
        <motion.img
          src={logo}
          alt="HealStride"
          className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 1.1, 1],
            opacity: 1,
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-4xl md:text-6xl font-bold text-white"
        >
          HealStride
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-teal-200 tracking-widest text-sm md:text-base"
        >
          Recover • Restore • Revive
        </motion.p>

        {/* Progress Bar */}
        <div className="w-64 md:w-80 h-2 bg-white/10 rounded-full overflow-hidden mt-8">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-green-400 shadow-[0_0_20px_rgba(45,212,191,0.8)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 0.95,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="mt-4 text-sm text-gray-300"
        >
          Loading your recovery journey...
        </motion.p>

      </div>
    </div>
  );
};

export default LoadingScreen;