import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const WhatsAppFloat = () => {
  const phoneNumber = "918809491380";

  const message = encodeURIComponent(
    "Hello! Thank you for contacting HealStride Physiotherapy & Wellness Centre. We're here to help you with your physiotherapy concerns, appointments, or any questions you may have. Please let us know how we can assist you."
  );

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.8,
      }}
      className="fixed bottom-14 right-4 sm:bottom-16 sm:right-6 z-40 max-w-[calc(100vw-32px)]"
    >
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with HealStride on WhatsApp"
        className="group flex items-center"
      >
        {/* Text Bubble */}
        <div
          className="
            hidden md:flex
            mr-2.5
            px-3.5
            py-1.5
            rounded-full
            bg-white
            shadow-lg
            border
            border-slate-100
            text-slate-800
            text-xs
            font-semibold
            opacity-0
            translate-x-3
            group-hover:opacity-100
            group-hover:translate-x-0
            transition-all
            duration-250
            whitespace-nowrap
          "
        >
          Chat with us
        </div>

        {/* Button Wrapper */}
        <div className="relative">
          {/* Pulse Ring */}
          <span
            className="
              absolute
              inset-0
              rounded-full
              bg-emerald-500
              animate-ping
              opacity-25
            "
          />

          {/* Outer Ring */}
          <span
            className="
              absolute
              -inset-1
              rounded-full
              border-2
              border-emerald-400
              opacity-30
            "
          />

          {/* Main WhatsApp Button */}
          <motion.div
            whileHover={{
              scale: 1.08,
              rotate: 5,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="
              relative
              flex
              items-center
              justify-center
              w-12
              h-12
              sm:w-14
              sm:h-14
              rounded-full
              bg-gradient-to-r
              from-emerald-500
              to-emerald-600
              text-white
              shadow-lg
              hover:shadow-emerald-500/30
            "
          >
            <img
              src="/whatsapp.png"
              alt="WhatsApp"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow"
            />
          </motion.div>
        </div>
      </a>
    </motion.div>
  );
};

export default WhatsAppFloat;