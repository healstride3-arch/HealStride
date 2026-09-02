import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { handleGoogleAuth } from "../utils/googleAuth";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      alert(t("auth.accountCreated"));

      navigate("/login");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[600px] py-10 sm:py-16 lg:py-20 relative flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/login-bg.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-md bg-white/95 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {t("auth.createAccount")}
          </h1>

          <p className="text-slate-500 mt-2">
            {t("auth.signupDesc")}
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="signup-name" className="sr-only">Full Name</label>
            <input
              id="signup-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder={t("auth.fullNamePlaceholder")}
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="sr-only">Email Address</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder={t("auth.emailPlaceholder")}
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="sr-only">Password</label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder={t("auth.passwordPlaceholder")}
                required
                className="w-full border rounded-xl px-4 py-3 pr-12"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 font-medium transition disabled:opacity-50"
          >
            {loading ? t("auth.creatingAccount") : t("auth.signUp")}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-400 text-sm">{t("auth.or")}</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google Signup */}
        <button
          type="button"
          onClick={async () => {
            try {
              setLoading(true);
              const res = await handleGoogleAuth();
              if (res) {
                navigate("/");
              }
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            border
            border-gray-300
            py-3
            rounded-xl
            hover:bg-gray-50
            transition
            font-medium
            disabled:opacity-60
          "
        >
          <FcGoogle size={24} />
          {loading ? t("auth.pleaseWait") : t("auth.googleLogin")}
        </button>

        <p className="text-center mt-6 text-slate-600">
          {t("auth.haveAccount")}{" "}
          <Link
            to="/login"
            className="text-teal-600 font-semibold hover:underline ml-1"
          >
            {t("auth.loginBtn")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;