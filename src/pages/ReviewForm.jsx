import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { sendReviewNotification } from "../services/bookingNotificationService";

const ReviewForm = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    review: "",
    rating: 5,
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "rating"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await sendReviewNotification(formData);

      setSuccess(true);

      setFormData({
        name: "",
        designation: "",
        review: "",
        rating: 5,
      });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error(error);
      alert(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="
        relative
        min-h-[600px]
        bg-cover
        bg-center
        bg-no-repeat
        overflow-hidden
        py-10
        sm:py-16
        lg:py-20
      "
      style={{
        backgroundImage: "url('/review-bg.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/75" />

      {/* Blur Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-teal-500/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
        >
          <span
            className="
              inline-block
              px-4
              py-1.5
              rounded-full
              bg-teal-500/20
              border
              border-teal-400/30
              text-teal-300
              font-semibold
              uppercase
              tracking-wider
              text-xs
              backdrop-blur-md
            "
          >
            {t("reviewForm.badge")}
          </span>

          <h2
            className="
              mt-2
              text-2xl
              sm:text-3xl
              lg:text-4xl
              font-bold
              text-white
              leading-tight
            "
          >
            {t("reviewForm.title")}
          </h2>

          <p
            className="
              mt-2.5
              sm:mt-3
              text-slate-200
              max-w-2xl
              mx-auto
              text-xs
              sm:text-base
              leading-relaxed
            "
          >
            {t("reviewForm.subtitle")}
          </p>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              mb-6
              bg-green-500/20
              backdrop-blur-md
              border
              border-green-400/30
              text-white
              px-4
              sm:px-5
              py-3.5
              sm:py-4
              rounded-xl
              sm:rounded-2xl
              text-sm
              sm:text-base
            "
          >
            {t("reviewForm.successMsg")}
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="
            max-w-3xl
            mx-auto
            bg-white/10
            backdrop-blur-xl
            border
            border-white/20
            rounded-2xl
            shadow-xl
            p-5
            sm:p-8
            lg:p-10
          "
        >
          <div className="space-y-4 sm:space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="review-name" className="block text-white mb-1.5 sm:mb-2 font-medium text-sm sm:text-base">
                {t("reviewForm.fullNameLabel")}
              </label>

              <input
                id="review-name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder={t(
                  "reviewForm.fullNamePlaceholder"
                )}
                required
                value={formData.name}
                onChange={handleChange}
                className="
                  w-full
                  bg-white/10
                  border
                  border-white/20
                  rounded-xl
                  px-3.5
                  py-2.5
                  sm:px-4
                  sm:py-3
                  text-white
                  placeholder:text-gray-300
                  outline-none
                  focus:ring-2
                  focus:ring-teal-400
                  text-sm
                  sm:text-base
                "
              />
            </div>

            {/* Occupation */}
            <div>
              <label htmlFor="review-designation" className="block text-white mb-1.5 sm:mb-2 font-medium text-sm sm:text-base">
                {t("reviewForm.occupationLabel")}
              </label>

              <input
                id="review-designation"
                type="text"
                name="designation"
                autoComplete="organization-title"
                placeholder={t(
                  "reviewForm.occupationPlaceholder"
                )}
                value={formData.designation}
                onChange={handleChange}
                className="
                  w-full
                  bg-white/10
                  border
                  border-white/20
                  rounded-xl
                  px-3.5
                  py-2.5
                  sm:px-4
                  sm:py-3
                  text-white
                  placeholder:text-gray-300
                  outline-none
                  focus:ring-2
                  focus:ring-teal-400
                  text-sm
                  sm:text-base
                "
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-white mb-2 sm:mb-3 font-medium text-sm sm:text-base">
                {t("reviewForm.ratingLabel")}
              </label>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        rating: star,
                      })
                    }
                    aria-label={`Rate ${star} stars`}
                  >
                    <FaStar
                      className={
                        (star <= formData.rating
                          ? "text-yellow-400"
                          : "text-gray-300") +
                        " text-xl sm:text-2xl"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review */}
            <div>
              <label htmlFor="review-text" className="block text-white mb-1.5 sm:mb-2 font-medium text-sm sm:text-base">
                {t("reviewForm.feedbackLabel")}
              </label>

              <textarea
                id="review-text"
                name="review"
                autoComplete="off"
                rows="4"
                required
                placeholder={t(
                  "reviewForm.feedbackPlaceholder"
                )}
                value={formData.review}
                onChange={handleChange}
                className="
                  w-full
                  bg-white/10
                  border
                  border-white/20
                  rounded-xl
                  px-3.5
                  py-2.5
                  sm:px-4
                  sm:py-3
                  text-white
                  placeholder:text-gray-300
                  resize-none
                  outline-none
                  focus:ring-2
                  focus:ring-teal-400
                  text-sm
                  sm:text-base
                "
              />
            </div>

            {/* Note */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-3 sm:p-4">
              <p className="text-gray-200 text-xs sm:text-sm">
                {t("reviewForm.verificationNote")}
              </p>
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-gradient-to-r
                from-teal-500
                to-cyan-500
                hover:from-teal-600
                hover:to-cyan-600
                text-white
                py-3.5
                sm:py-4
                rounded-xl
                font-semibold
                shadow-lg
                shadow-teal-500/30
                transition-all
                duration-300
                disabled:opacity-50
                disabled:cursor-not-allowed
                text-sm
                sm:text-base
              "
            >
              {loading
                ? t("reviewForm.submitting")
                : t("reviewForm.submitBtn")}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </section>
  );
};

export default ReviewForm;
