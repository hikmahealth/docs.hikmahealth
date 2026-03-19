import { useState, useEffect, useRef, type RefObject } from "react";

/* ─── Style injection (CSS keyframes + responsive grid) ─── */
const STYLE_ID = "hikma-pillars-styles";
function ensureStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes pillarWifiPulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }

    @keyframes pillarClipboardFill {
      0%, 100% { transform: scaleY(0); }
      40%, 60% { transform: scaleY(1); }
    }

    @keyframes pillarHeartBeat {
      0%, 100% { transform: scale(1); }
      15% { transform: scale(1.15); }
      30% { transform: scale(1); }
      45% { transform: scale(1.1); }
      60% { transform: scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      .hikma-pillars-animated * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
      }
    }
  `;
  document.head.appendChild(style);
}

/* ─── useContainerWidth hook ─── */
function useContainerWidth(ref: RefObject<HTMLDivElement | null>): number {
  const [width, setWidth] = useState(900);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

/* ─── SVG Icons ─── */
const ICON_COLOR = "#2f51b3";

function WifiIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      {/* Outer arc */}
      <path
        d="M1.5 8.5c5.8-5.8 15.2-5.8 21 0"
        stroke={ICON_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          animation: "pillarWifiPulse 2.4s ease-in-out infinite",
          animationDelay: "0s",
        }}
      />
      {/* Middle arc */}
      <path
        d="M5.5 12.5c3.6-3.6 9.4-3.6 13 0"
        stroke={ICON_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          animation: "pillarWifiPulse 2.4s ease-in-out infinite",
          animationDelay: "0.3s",
        }}
      />
      {/* Inner arc */}
      <path
        d="M9 16c1.7-1.7 4.3-1.7 6 0"
        stroke={ICON_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          animation: "pillarWifiPulse 2.4s ease-in-out infinite",
          animationDelay: "0.6s",
        }}
      />
      {/* Dot */}
      <circle cx="12" cy="20" r="1.5" fill={ICON_COLOR} />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      {/* Clipboard body */}
      <rect
        x="5"
        y="4"
        width="14"
        height="18"
        rx="2"
        stroke={ICON_COLOR}
        strokeWidth="1.5"
      />
      {/* Clipboard tab */}
      <rect
        x="8"
        y="2"
        width="8"
        height="4"
        rx="1"
        stroke={ICON_COLOR}
        strokeWidth="1.5"
        fill="none"
      />
      {/* Animated fill area (lines appearing) */}
      <g>
        <rect
          x="8"
          y="10"
          width="8"
          height="2"
          rx="0.5"
          fill={ICON_COLOR}
          opacity="0.6"
          style={{
            transformOrigin: "8px 11px",
            animation: "pillarClipboardFill 3s ease-in-out infinite",
            animationDelay: "0s",
          }}
        />
        <rect
          x="8"
          y="14"
          width="6"
          height="2"
          rx="0.5"
          fill={ICON_COLOR}
          opacity="0.6"
          style={{
            transformOrigin: "8px 15px",
            animation: "pillarClipboardFill 3s ease-in-out infinite",
            animationDelay: "0.3s",
          }}
        />
        <rect
          x="8"
          y="18"
          width="5"
          height="2"
          rx="0.5"
          fill={ICON_COLOR}
          opacity="0.6"
          style={{
            transformOrigin: "8px 19px",
            animation: "pillarClipboardFill 3s ease-in-out infinite",
            animationDelay: "0.6s",
          }}
        />
      </g>
    </svg>
  );
}

function HeartCodeIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "pillarHeartBeat 2s ease-in-out infinite" }}
    >
      {/* Heart shape */}
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={ICON_COLOR}
        opacity="0.85"
      />
      {/* Code brackets overlay */}
      <path
        d="M9 10l-2 2 2 2"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 10l2 2-2 2"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Pillar data ─── */
interface Pillar {
  title: string;
  description: string;
  icon: () => JSX.Element;
}

const pillars: Pillar[] = [
  {
    title: "Offline-First EHR",
    description:
      "Capture patient data with under 10 clicks. Works without internet, syncs when connectivity returns.",
    icon: WifiIcon,
  },
  {
    title: "Customizable Forms",
    description:
      "Build dynamic clinical forms through the admin portal. No code changes required.",
    icon: ClipboardIcon,
  },
  {
    title: "Open Source",
    description: "Free forever. Built for the communities that need it most.",
    icon: HeartCodeIcon,
  },
];

/* ─── Pillar card ─── */
function PillarCard({ pillar }: { pillar: Pillar }) {
  const [hovered, setHovered] = useState(false);
  const Icon = pillar.icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "24px",
        borderRadius: 12,
        border: `1px solid ${hovered ? "rgba(47, 81, 179, 0.35)" : "rgba(47, 81, 179, 0.15)"}`,
        background: "transparent",
        transition:
          "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 24px rgba(47, 81, 179, 0.1)"
          : "0 0 0 transparent",
        cursor: "default",
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: "rgba(47, 81, 179, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Icon />
      </div>

      {/* Title */}
      <div
        style={{
          fontWeight: 600,
          fontSize: 16,
          marginBottom: 8,
        }}
        className="pillar-title"
      >
        {pillar.title}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.6,
        }}
        className="pillar-desc"
      >
        {pillar.description}
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function PlatformPillars() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerWidth = useContainerWidth(containerRef);

  useEffect(() => {
    ensureStyles();

    // Inject dark mode styles for text colors
    const darkStyleId = "hikma-pillars-dark";
    if (
      typeof document !== "undefined" &&
      !document.getElementById(darkStyleId)
    ) {
      const darkStyle = document.createElement("style");
      darkStyle.id = darkStyleId;
      darkStyle.textContent = `
        .pillar-title { color: #111827; }
        .pillar-desc { color: #6b7280; }

        .dark .pillar-title { color: #f3f4f6; }
        .dark .pillar-desc { color: #9ca3af; }
      `;
      document.head.appendChild(darkStyle);
    }
  }, []);

  const isDesktop = containerWidth >= 768;

  return (
    <div
      ref={containerRef}
      className="hikma-pillars-animated"
      style={{
        width: "100%",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr",
          gap: 20,
        }}
      >
        {pillars.map((pillar) => (
          <PillarCard key={pillar.title} pillar={pillar} />
        ))}
      </div>
    </div>
  );
}
