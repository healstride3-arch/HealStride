import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Lightweight dynamic SEO component for React SPA.
 * Dynamically updates document.title, meta description, and canonical link
 * so Google, social crawlers, and users get accurate, page-specific SEO.
 */
const SEO = ({
  title,
  description,
  canonical,
  keywords,
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Title
    const baseTitle = "Heal Stride | Physiotherapy & Wellness Centre";
    document.title = title ? `${title} | Heal Stride Bhopal` : baseTitle;

    // 2. Update Meta Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
    }

    // 3. Update Meta Keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }

    // 4. Update Canonical Link
    const currentUrl = canonical || `https://healstride.in${location.pathname}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", currentUrl);

    // 5. Update OpenGraph URL & Title
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", currentUrl);
    }
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) {
      ogTitle.setAttribute("content", `${title} | Heal Stride Bhopal`);
    }
  }, [title, description, canonical, keywords, location.pathname]);

  return null;
};

export default SEO;
