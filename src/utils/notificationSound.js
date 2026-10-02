/**
 * Notification Sound & Web Notification Utility
 * Synthesizes a crisp, clear 2-tone clinic chime using Web Audio API (zero external assets needed)
 * and triggers desktop browser notifications.
 */

let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

/**
 * Plays a pleasant, high-definition clinic bell chime.
 * Tone 1: 587.33 Hz (D5) -> Tone 2: 880.00 Hz (A5)
 */
export const playNotificationSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Helper to play a single pleasant bell tone with smooth attack and decay
    const playTone = (freq, startTime, duration, gainVal = 0.25) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      // Add slight shimmer/harmonic overtone
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(gainVal, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // First bell tone (D5)
    playTone(587.33, now, 0.4, 0.25);
    // Second higher bell tone (A5)
    playTone(880.0, now + 0.12, 0.7, 0.3);
    // Soft harmonic chime for rich acoustic feel (E6)
    playTone(1318.51, now + 0.14, 0.5, 0.1);
  } catch (err) {
    console.warn("Audio chime playback error:", err);
  }
};

/**
 * Requests browser desktop notification permissions
 */
export const requestNotificationPermission = async () => {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "default") {
      try {
        return await Notification.requestPermission();
      } catch (e) {
        return "denied";
      }
    }
    return Notification.permission;
  }
  return "denied";
};

/**
 * Shows a native OS/Browser notification if permitted
 */
export const triggerBrowserNotification = (title, options = {}) => {
  try {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        const notif = new Notification(title, {
          icon: "/logo.png",
          badge: "/logo.png",
          vibrate: [200, 100, 200],
          ...options,
        });

        if (options.onClick) {
          notif.onclick = () => {
            window.focus();
            options.onClick();
            notif.close();
          };
        }
      }
    }
  } catch (err) {
    console.warn("Desktop notification error:", err);
  }
};
