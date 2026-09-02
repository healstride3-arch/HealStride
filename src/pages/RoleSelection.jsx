import { motion } from "framer-motion";
import { UserRound, ShieldCheck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background Decorative Elements */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl" />

      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl"
      >

        {/* Header */}
        <div className="text-center mb-10">

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-700 text-white shadow-lg mb-5"
          >
            <ShieldCheck size={34} />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Welcome to HealStride
          </h1>

          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Please select how you would like to continue
          </p>

        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* User Card */}
          <motion.button
            type="button"
            onClick={() => navigate("/login")}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="group text-left bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-teal-300 transition-all duration-300"
          >

            <div className="flex items-center justify-between mb-6">

              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-all duration-300">
                <UserRound size={30} />
              </div>

              <span className="text-teal-700 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Continue →
              </span>

            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              User
            </h2>

            <p className="text-slate-600 leading-relaxed">
              Login as a patient to access your account, book appointments,
              manage your profile, and use HealStride services.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 text-teal-700 font-semibold">
              Continue as User
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>

          </motion.button>

          {/* Admin Card */}
          <motion.button
            type="button"
            onClick={() => navigate("/adminlogin")}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="group text-left bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-lg hover:shadow-2xl hover:border-teal-300 transition-all duration-300"
          >

            <div className="flex items-center justify-between mb-6">

              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-all duration-300">
                <ShieldCheck size={30} />
              </div>

              <span className="text-teal-700 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Continue →
              </span>

            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Admin
            </h2>

            <p className="text-slate-600 leading-relaxed">
              Login as an administrator to access the HealStride management
              dashboard and manage clinic operations.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 text-teal-700 font-semibold">
              Continue as Admin
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>

          </motion.button>

        </div>

        {/* Back Button */}
        <div className="text-center mt-8">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to HealStride
          </button>

        </div>

      </motion.div>

    </div>
  );
};

export default RoleSelection;