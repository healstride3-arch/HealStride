import { UserRound } from "lucide-react";
import { staff } from "../data/team";

const Staff = () => {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-100 min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
          <p className="text-teal-600 uppercase tracking-wider text-xs sm:text-sm font-semibold mb-2">
            Meet Our Team
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            Our Staff
          </h1>

          <p className="mt-2.5 sm:mt-3 text-slate-600 text-xs sm:text-base leading-relaxed">
            Meet the dedicated professionals who manage our clinic and
            provide quality care to every patient.
          </p>
        </div>

        {/* Staff Cards Container */}
        {staff.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm">
              No staff members available.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-stretch gap-6 lg:gap-8">
            {staff.map((member) => (
              <div
                key={member.id}
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
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <UserRound size={64} />
                    </div>
                  )}
                </div>

                {/* Only Name */}
                <div className="p-4 sm:p-5 text-center bg-white border-t border-slate-100">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {member.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Staff;
