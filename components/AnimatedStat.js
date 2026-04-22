"use client";
import { useEffect, useRef, useState } from "react";

function formatNum(n, locale = "fr") {
  // Formatage avec espace insécable comme séparateur de milliers (style français)
  return n.toLocaleString(locale === "en" ? "en-US" : "fr-FR");
}

export default function AnimatedStat({ target, prefix = "", suffix = "", duration = 1800, locale = "fr" }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubique
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}{formatNum(value, locale)}{suffix}
    </span>
  );
}
