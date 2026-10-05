/**
 * Booking Notification Service
 * Sends website leads to the clinic owner email.
 */

const OWNER_EMAIL = "healstride3@gmail.com";
const EMAIL_WEBHOOK_URL = import.meta.env.VITE_EMAIL_WEBHOOK_URL || "https://formsubmit.co/ajax/healstride3@gmail.com";

const sendEmailLead = async (payload) => {
  try {
    const response = await fetch(EMAIL_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...payload,
        clinicEmail: OWNER_EMAIL,
        clinicLocation: "LIG 85 New Subhash Nagar Near Gurudwara-Raisen Road  Bhopal 462023",
        submittedAt: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
        _template: "table",
        _captcha: "false",
      }),
    });

    if (!response.ok) {
      console.warn("Email webhook responded with status:", response.status);
    }
  } catch (error) {
    console.warn("Booking notification service warning (non-fatal):", error);
  }
};

export const sendBookingNotification = (bookingData) =>
  sendEmailLead({
    leadType: "Appointment Booking",
    patientName: bookingData.name,
    patientPhone: bookingData.phone,
    selectedDoctor: bookingData.doctor,
    condition: bookingData.condition,
    appointmentDate: bookingData.date,
    appointmentTime: bookingData.time,
    message: bookingData.message || "Consultation Requested",
    source: "website-booking-form",
    _subject: `New Appointment Lead: ${bookingData.name} (${bookingData.condition})`,
  });

export const sendReviewNotification = (reviewData) =>
  sendEmailLead({
    leadType: "Patient Review",
    patientName: reviewData.name,
    occupation: reviewData.designation || "Not provided",
    rating: reviewData.rating,
    review: reviewData.review,
    source: "website-review-form",
    _subject: `New Patient Review: ${reviewData.name} (${reviewData.rating}/5)`,
  });

export const sendQuestionNotification = (questionData) =>
  sendEmailLead({
    leadType: "Patient Question",
    name: questionData.name,
    email: questionData.email,
    question: questionData.question,
    source: "website-faq-form",
    _subject: `New Website Question: ${questionData.name}`,
  });

export const sendCallbackNotification = (callbackData) =>
  sendEmailLead({
    leadType: "Urgent Callback Request",
    patientName: callbackData.name || "Quick Callback Request",
    patientPhone: callbackData.phone,
    service: callbackData.service || "Urgent Callback Request",
    appointmentTime: callbackData.preferredTime || "Immediate Callback",
    message: callbackData.notes || `Immediate callback requested by user at phone +91 ${callbackData.phone}`,
    source: callbackData.source || "Landing Page Hero Callback Box",
    _subject: `🚨 Urgent Callback Request: +91 ${callbackData.phone} (Heal Stride Website)`,
  });
