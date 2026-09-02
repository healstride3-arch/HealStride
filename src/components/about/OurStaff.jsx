import { UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { staff as defaultStaff } from "../../data/team";
import { useFirestoreCollection, where } from "../../hooks/useFirestoreCollection";

const OurStaff = () => {
  const { items: staff } = useFirestoreCollection("staff", {
    constraints: [where("active", "!=", false)],
    fallback: defaultStaff,
  });

  if (staff.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[#0f766e] font-semibold uppercase tracking-wider text-sm mb-3">
            Our Staff
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Meet Our Dedicated Team
          </h2>

          <p className="text-gray-600 mt-4 leading-relaxed">
            Our clinic is supported by a dedicated team of healthcare
            professionals committed to providing quality care and a
            comfortable experience for every patient.
          </p>
        </div>

        {/* Staff Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staff.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="h-72 bg-gray-100 overflow-hidden">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserRound
                      size={80}
                      className="text-gray-400"
                    />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {member.name}
                </h3>

                <p className="text-[#0f766e] font-semibold mt-1">
                  {member.role}
                </p>

                {member.bio && (
                  <p className="text-gray-600 text-sm leading-relaxed mt-4">
                    {member.bio}
                  </p>
                )}

                {member.certifications && (
                  <div className="mt-5">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Qualifications & Certifications
                    </h4>

                    <ul className="space-y-2">
                      {member.certifications
                        .split("\n")
                        .filter((item) => item.trim())
                        .map((certification, certificationIndex) => (
                          <li
                            key={certificationIndex}
                            className="flex gap-2 text-sm text-gray-600"
                          >
                            <span className="text-[#0f766e] mt-1">
                              •
                            </span>

                            <span>{certification.trim()}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurStaff;
