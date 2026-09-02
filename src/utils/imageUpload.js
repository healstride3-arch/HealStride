import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";

/**
 * Compresses an image file and converts it to a Base64 data URL.
 */
export const compressToBase64 = (file, maxWidth = 1000, quality = 0.75) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }
    if (typeof file === "string") {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(event.target.result || "");
      };
    };
    reader.onerror = () => {
      resolve("");
    };
  });
};

/**
 * Uploads an image file safely without throwing storage errors.
 * Strategy:
 * 1. Convert/compress image to Base64 data URL
 * 2. Upload to ImageKit REST API (using VITE_IMAGEKIT_PRIVATE_KEY)
 * 3. Fallback to Firebase Storage if ImageKit fails
 * 4. Fallback to Base64 data URL (100% offline & storage error proof)
 */
export const uploadImage = async (file, folder = "uploads") => {
  if (!file) return "";

  // If already a hosted URL (http:// or https://), return as is
  if (typeof file === "string" && (file.startsWith("http://") || file.startsWith("https://"))) {
    return file;
  }

  // Convert/Compress file to base64
  const base64Data = typeof file === "string" ? file : await compressToBase64(file);

  const privateKey =
    import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY ||
    "private_Hv3zD0erqaqgXfjIaRdiWsYza+U=";

  // 1. ImageKit API Upload
  if (privateKey && base64Data) {
    try {
      const formData = new FormData();
      formData.append("file", base64Data);
      formData.append("fileName", (typeof file !== "string" && file.name) ? file.name : `img_${Date.now()}.jpg`);
      formData.append("useUniqueFileName", "true");
      formData.append("folder", `/${folder}`);

      const authHeader = "Basic " + btoa(privateKey + ":");

      const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.url) {
          return data.url;
        }
      } else {
        console.warn("ImageKit upload warning status:", response.status);
      }
    } catch (err) {
      console.warn("ImageKit upload request failed:", err?.message || err);
    }
  }

  // 2. Firebase Storage Fallback (silent)
  if (typeof file !== "string" && storage && storage.app && storage.app.options && storage.app.options.storageBucket) {
    try {
      const newPath = `${folder}/${Date.now()}-${file.name || "file"}`;
      const storageRef = ref(storage, newPath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      if (downloadURL) {
        return downloadURL;
      }
    } catch (err) {
      console.warn("Firebase Storage skipped:", err?.message || err);
    }
  }

  // 3. Complete Fallback: Base64 string
  return base64Data;
};
