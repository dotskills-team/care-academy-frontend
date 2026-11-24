"use client";

import { useEffect, useRef, useState } from "react";

type Dir = "left" | "right" | "up" | "down" | "zoom";

// Slides/fades its children in when they scroll into view.
export default function Reveal({
  dir = "up",
  delay = 0,
  className = "",
  children,
}: {
  dir?: Dir;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal reveal-${dir} ${shown ? "reveal-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
