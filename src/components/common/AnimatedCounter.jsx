import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const AnimatedCounter = ({
  target = 0,
  prefix = "",
  suffix = "",
  duration = 1.3,
  className = "",
}) => {
  const ref = useRef(null);
  // Trigger on both scroll UP and scroll DOWN whenever entering the viewport
  const isInView = useInView(ref, { once: false, margin: "0px 0px -30px 0px", amount: 0.1 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animationFrame;
    if (isInView) {
      let startTime = null;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) / (duration * 1000);
        const progress = Math.min(elapsed, 1);
        // Smooth cubic ease-out
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(easeOut * target));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };
      animationFrame = requestAnimationFrame(step);
    } else {
      // Reset to 0 when scrolled out of view so it re-triggers on scroll back
      setCount(0);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={`inline-block tabular-nums ${className}`}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
