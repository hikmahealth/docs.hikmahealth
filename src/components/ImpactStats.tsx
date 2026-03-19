import { useState, useEffect, useRef, useCallback } from "react";

interface StatConfig {
  end: number;
  suffix: string;
  label: string;
  formatWithCommas: boolean;
}

const STATS: StatConfig[] = [
  { end: 18, suffix: "", label: "Countries", formatWithCommas: false },
  { end: 20, suffix: "+", label: "Partner Organizations", formatWithCommas: false },
  { end: 500000, suffix: "+", label: "Patients Served", formatWithCommas: true },
];

const ANIMATION_DURATION = 2000;

function formatNumber(n: number, withCommas: boolean): string {
  if (!withCommas) return String(n);
  return n.toLocaleString("en-US");
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function AnimatedNumber({ end, suffix, formatWithCommas, animate }: StatConfig & { animate: boolean }) {
  const [display, setDisplay] = useState(animate ? "0" : formatNumber(end, formatWithCommas));
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animate || hasAnimated.current) return;
    hasAnimated.current = true;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(formatNumber(end, formatWithCommas));
      return;
    }

    let start: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.round(easedProgress * end);
      setDisplay(formatNumber(current, formatWithCommas));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [animate, end, formatWithCommas]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

export default function ImpactStats() {
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setAnimate(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dividerStyle: React.CSSProperties = {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "#e5e7eb",
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
        padding: "2rem 1rem",
        flexWrap: "wrap",
      }}
    >
      {STATS.map((stat, i) => (
        <div key={stat.label} style={{ display: "contents" }}>
          {i > 0 && (
            <div
              style={dividerStyle}
              className="impact-stats-divider"
            />
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 120,
            }}
          >
            <span
              style={{
                fontSize: "2.25rem",
                fontWeight: 700,
                lineHeight: 1.2,
                color: "#2f51b3",
              }}
            >
              <AnimatedNumber {...stat} animate={animate} />
            </span>
            <span
              className="impact-stats-label"
              style={{
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                color: "#6b7280",
              }}
            >
              {stat.label}
            </span>
          </div>
        </div>
      ))}
      <style>{`
        @media (prefers-color-scheme: dark) {
          .impact-stats-label { color: #9ca3af !important; }
          .impact-stats-divider { background-color: #374151 !important; }
        }
      `}</style>
    </div>
  );
}
