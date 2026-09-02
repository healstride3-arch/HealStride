import { useState, useEffect } from "react";
import  {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { handleGoogleAuth } from "../utils/googleAuth";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const res = await handleGoogleAuth();
      if (res) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
  if (!formData.email) {
    alert("Please enter your email address first.");
    return;
  }

  try {
    setLoading(true);

    await sendPasswordResetEmail(
      auth,
      formData.email
    );

    alert(
      "Password reset email sent. Please check your inbox."
    );
  } catch (error) {
    console.error("Password Reset Error:", error);

    alert(
      error.message ||
        "Unable to send password reset email."
    );
  } finally {
    setLoading(false);
  }
};
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      localStorage.setItem("role", "user");

      navigate("/");
    } catch (error) {
      alert(
        error.message ||
          "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-[600px]
        py-10
        sm:py-16
        lg:py-20
        relative
        flex
        items-center
        justify-center
        px-4
        bg-cover
        bg-center
      "
      style={{
        backgroundImage:
          "url('/login-bg.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Blur */}
      <div className="absolute top-10 left-10 w-52 h-52 bg-teal-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-cyan-500/20 blur-3xl rounded-full" />

      {/* Card */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          bg-white/95
          backdrop-blur-xl
          rounded-2xl
          sm:rounded-3xl
          shadow-2xl
          p-5
          sm:p-8
        "
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {t("auth.welcomeBack")}
          </h1>

          <p className="text-slate-500 mt-2">
            {t("auth.loginDesc")}
          </p>
        </div>

        {/* Email Login */}
<form
  onSubmit={handleEmailLogin}
  className="space-y-4"
>
  {/* Email Field */}
  <div>
    <label
      htmlFor="email"
      className="block text-sm font-medium text-slate-700 mb-2"
    >
      Email Address
    </label>

    <input
      id="email"
      type="email"
      name="email"
      autoComplete="username"
      placeholder={t("auth.emailPlaceholder")}
      required
      value={formData.email}
      onChange={(e) =>
        setFormData({
          ...formData,
          email: e.target.value,
        })
      }
      className="
        w-full
        border
        border-gray-300
        rounded-xl
        px-4
        py-3
        outline-none
        focus:ring-2
        focus:ring-teal-500
      "
    />
  </div>

  {/* Password Field */}
  <div>
    <label
      htmlFor="password"
      className="block text-sm font-medium text-slate-700 mb-2"
    >
      Password
    </label>

    <div className="relative">
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        name="password"
        autoComplete="current-password"
        placeholder={t("auth.passwordPlaceholder")}
        required
        value={formData.password}
        onChange={(e) =>
          setFormData({
            ...formData,
            password: e.target.value,
          })
        }
        className="
          w-full
          border
          border-gray-300
          rounded-xl
          px-4
          py-3
          pr-12
          outline-none
          focus:ring-2
          focus:ring-teal-500
        "
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-500
        "
        aria-label="Toggle password visibility"
      >
        {showPassword ? (
          <EyeOff size={20} />
        ) : (
          <Eye size={20} />
        )}
      </button>
    </div>

    {/* Forgot Password */}
    <div className="text-right mt-2">
      <button
        type="button"
        onClick={handleForgotPassword}
        className="
          text-sm
          text-teal-600
          font-medium
          hover:underline
        "
      >
        Forgot Password?
      </button>
    </div>
  </div>

  {/* Login Button */}
  <button
    type="submit"
    disabled={loading}
    className="
      w-full
      bg-teal-600
      hover:bg-teal-700
      text-white
      py-3
      rounded-xl
      transition
      disabled:opacity-60
      flex
      items-center
      justify-center
      gap-2
      font-medium
    "
  >
    {loading ? (
      <>
        <Loader2
          size={18}
          className="animate-spin"
        />
        {t("auth.loggingIn")}
      </>
    ) : (
      t("auth.loginBtn")
    )}
  </button>
</form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300" />

          <span className="text-gray-400 text-sm">
            {t("auth.or")}
          </span>

          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
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

          {loading
            ? t("auth.pleaseWait")
            : t("auth.googleLogin")}
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          {t("auth.secureNotice")}
        </p>

        <p className="text-center text-slate-600 mt-5">
          {t("auth.noAccount")}{" "}
          <Link
            to="/signup"
            className="
              text-teal-600
              font-semibold
              hover:underline
              ml-1
            "
          >
            {t("auth.signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;