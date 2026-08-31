import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { staff } from "../../data/team";

const StaffSection = () => {
  const navigate = useNavigate();

  if (staff.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Heading */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-[0.25em] text-teal-600 uppercase mb-3">
            Meet Our Team
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Staff
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            Meet the dedicated professionals who help manage our clinic
            and provide quality care to every patient.
          </p>
        </div>

        {/* Staff Cards */}
        <div className="flex flex-wrap justify-center items-stretch gap-6 lg:gap-8">
          {staff.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="
                w-full
                max-w-[320px]
                sm:max-w-[350px]
                bg-white
                rounded-2xl
                border
                border-teal-500
                overflow-hidden
                flex
                flex-col
                transition-all
                duration-200
              "
            >
              {/* Image */}
              <div className="w-full h-80 sm:h-96 md:h-[400px] bg-slate-50 overflow-hidden flex items-center justify-center">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                    No Image
                  </div>
                )}
              </div>

              {/* Only Name */}
              <div className="p-4 sm:p-5 text-center bg-white border-t border-slate-100">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {member.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate("/staff")}
          className="px-8 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition shadow-sm"
        >
          View More →
        </button>
      </div>
    </section>
  );
};

export default StaffSection;
