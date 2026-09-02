import { signInWithPopup, getAdditionalUserInfo } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { toast } from "react-hot-toast";
import i18n from "../i18n";

/**
 * Handles the Google Authentication flow for both Login and Signup.
 * 
 * @param {Function} [onSuccess] - Optional callback function triggered on successful authentication
 * @returns {Promise<{user: object, isNewUser: boolean}|null>} User info or null if process failed/cancelled
 */
export const handleGoogleAuth = async (onSuccess) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Determine if the authenticated user is new or existing
    const additionalUserInfo = getAdditionalUserInfo(result);
    const isNewUser = Boolean(additionalUserInfo?.isNewUser);

    if (isNewUser) {
      toast.success(
        i18n.t("auth.welcomeNewMsg", "Account created successfully! Welcome to HealStride.")
      );
    } else {
      toast.success(
        i18n.t("auth.welcomeBackMsg", "Welcome back! Signing you in...")
      );
    }

    localStorage.setItem("role", "user");

    if (typeof onSuccess === "function") {
      onSuccess(result.user, isNewUser);
    }

    return { user: result.user, isNewUser };
  } catch (error) {
    const errorCode = error?.code;

    // 1. Popup closed by user or cancelled popup request
    if (
      errorCode === "auth/popup-closed-by-user" ||
      errorCode === "auth/cancelled-popup-request"
    ) {
      // Do not display a confusing error message to the user
      return null;
    }

    // 2. Popup blocked by browser
    if (errorCode === "auth/popup-blocked") {
      toast.error(
        i18n.t("auth.popupBlocked", "Please allow popups to continue with Google.")
      );
      return null;
    }

    // 3. Email already registered with a different sign-in provider (e.g. Password)
    if (errorCode === "auth/account-exists-with-different-credential") {
      toast.error(
        i18n.t(
          "auth.accountExistsDiffCred",
          "An account already exists with this email. Please sign in using your existing login method."
        )
      );
      return null;
    }

    // 4. Other Firebase auth errors (no tokens or user objects logged)
    toast.error(
      error?.message || "Google sign-in failed. Please try again."
    );
    return null;
  }
};
