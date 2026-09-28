import { useFirestoreDoc } from "./useFirestoreDoc";

export const DEFAULT_CLINIC_SETTINGS = {
  address: "LIG 85 New Subhash Nagar Near Gurudwara-Raisen Road  Bhopal 462023",
  phone: "+91 88094 91380",
  whatsapp: "+91 82525 80389",
  email: "healstride3@gmail.com",
  hours: "Morning 9:00 AM - 12:00 PM\nEvening 5:00 PM - 9:00 PM",
  instagram: "https://www.instagram.com/healstride.physio/",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
};

/**
 * useClinicSettings
 * Single source of truth hook for clinic settings (address, phone, email, hours, socials).
 * Subscribes in real-time to Firestore ('settings/clinic').
 * Whatever the admin updates in the Admin Panel immediately updates everywhere across the site.
 */
export const useClinicSettings = () => {
  return useFirestoreDoc("settings", "clinic", DEFAULT_CLINIC_SETTINGS);
};

export default useClinicSettings;
