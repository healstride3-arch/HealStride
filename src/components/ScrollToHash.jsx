import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace("#", "");
    const scrollToTarget = () => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return true;
      }
      return false;
    };

    if (!scrollToTarget()) {
      const timer = setTimeout(scrollToTarget, 100);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  return null;
};

export default ScrollToHash;