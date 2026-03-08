import { useState, useEffect, useRef, useCallback, type RefObject, type ReactNode } from "react";

/* ─── Types ─── */
type IconType = "pulse" | "clipboard" | "pill" | "flask" | "user" | "calendar" | "alert" | "ruler";

interface DataPairOutput {
  label: string;
  value: string;
  icon: IconType;
}

interface DataPair {
  paper: string[];
  output: DataPairOutput;
}

interface PaperItem {
  id: number;
  lines: string[];
  restX: number;
  y: number;
  rot: number;
  duration: number;
}

interface OutputItem {
  id: number;
  label: string;
  value: string;
  icon: IconType;
  restX: number;
  y: number;
  duration: number;
}

interface AnimationStyle {
  left: string;
  opacity: number;
  transform: string;
}

/* ─── Color tokens (override via CSS custom properties) ─── */
const BLUE = "var(--hikma-blue, #2f51b3)";
const BLUE_GLOW = "var(--hikma-blue-glow, rgba(47, 81, 179, 0.4))";
const BLUE_SUBTLE = "var(--hikma-blue-subtle, rgba(47, 81, 179, 0.08))";
const BLUE_BORDER = "var(--hikma-blue-border, rgba(47, 81, 179, 0.2))";
const BG = "var(--hikma-bg, #09090B)";
const TEXT = "var(--hikma-text, #F4F4F5)";
const TEXT_DIM = "var(--hikma-text-dim, #71717A)";
const BORDER = "var(--hikma-border, rgba(255, 255, 255, 0.06))";

/* ─── Inject Google Font + reduced-motion styles once ─── */
const STYLE_ID = "hikma-hero-styles";
function ensureStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600&display=swap');

    @keyframes portalPulse {
      0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) rotate(45deg) scale(1); }
      50% { opacity: 1; transform: translate(-50%, -50%) rotate(45deg) scale(1.4); }
    }

    @media (prefers-reduced-motion: reduce) {
      .hikma-hero-animated * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(style);
}

/* ─── Matched pairs: paper → structured output ─── */
const dataPairs: DataPair[] = [
  {
    paper: ["Patient: J. Mwangi", "Age: 34  Sex: F", "Date: 12/03/24"],
    output: {
      label: "Patient",
      value: "J. Mwangi · F · 34y · 12 Mar 2024",
      icon: "user",
    },
  },
  {
    paper: ["BP: 140/90  HR: 88", "Temp: 38.7°C", "SpO2: 96%"],
    output: {
      label: "Vital Signs",
      value: "BP 140/90 · HR 88 · T 38.7°C · SpO2 96%",
      icon: "pulse",
    },
  },
  {
    paper: ["Dx: Malaria (suspected)", "RDT: Positive (+)"],
    output: {
      label: "Diagnosis",
      value: "Malaria (P. falciparum) — RDT confirmed",
      icon: "clipboard",
    },
  },
  {
    paper: ["Rx: Artemether 20mg", "Qty: x6  Duration: 3d"],
    output: {
      label: "Medication",
      value: "Artemether 20mg — 6 doses, 3 days",
      icon: "pill",
    },
  },
  {
    paper: ["Wt: 54kg  Ht: 162cm", "BMI: 20.6"],
    output: {
      label: "Anthropometry",
      value: "54kg · 162cm · BMI 20.6",
      icon: "ruler",
    },
  },
  {
    paper: ["Follow-up: 2 weeks", "Return if fever persists"],
    output: {
      label: "Follow-up",
      value: "Scheduled: 14 days — fever watch",
      icon: "calendar",
    },
  },
  {
    paper: ["Allergies: Penicillin", "Noted by: Dr. Osei"],
    output: {
      label: "Allergy Alert",
      value: "Penicillin — confirmed (Dr. Osei)",
      icon: "alert",
    },
  },
  {
    paper: ["Hb: 9.2 g/dL", "WBC: 11,200", "Plt: 98,000"],
    output: {
      label: "CBC Panel",
      value: "Hb 9.2 ↓ · WBC 11.2k · Plt 98k",
      icon: "flask",
    },
  },
  {
    paper: ["Complaint: cough x 3d", "Onset: gradual", "Severity: moderate"],
    output: {
      label: "Symptoms",
      value: "Cough — 3 days, gradual, moderate",
      icon: "clipboard",
    },
  },
  {
    paper: ["FHx: DM (mother)", "HTN (father)"],
    output: {
      label: "Family History",
      value: "DM (maternal) · HTN (paternal)",
      icon: "user",
    },
  },
  {
    paper: ["Rx: ORS + Zinc", "Counseled on fluids"],
    output: {
      label: "Treatment",
      value: "ORS + Zinc — fluid counseling given",
      icon: "pill",
    },
  },
  {
    paper: ["Urine dip: protein +", "Glucose: negative"],
    output: {
      label: "Urinalysis",
      value: "Protein + · Glucose neg",
      icon: "flask",
    },
  },
  {
    paper: ["Patient: A. Hassan", "Age: 7  Sex: M", "Guardian: F. Hassan"],
    output: {
      label: "Patient",
      value: "A. Hassan · M · 7y · Guardian: F. Hassan",
      icon: "user",
    },
  },
  {
    paper: ["Pain: 4/10 (abdomen)", "Duration: 2 days", "Vomiting: Yes x3"],
    output: {
      label: "Symptoms",
      value: "Abdominal pain 4/10 · 2d · vomiting x3",
      icon: "clipboard",
    },
  },
];

/* ─── SVG icons ─── */
function MiniIcon({ type }: { type: IconType }) {
  const props = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: BLUE,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<IconType, ReactNode> = {
    pulse: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    clipboard: (
      <>
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      </>
    ),
    pill: (
      <>
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
        <path d="m8.5 8.5 7 7" />
      </>
    ),
    flask: (
      <path d="M9 3h6M12 3v7.4c0 .3.1.6.3.8l5.4 6.8c.8 1 .1 2.5-1.2 2.5H7.5c-1.3 0-2-1.5-1.2-2.5l5.4-6.8c.2-.2.3-.5.3-.8V3" />
    ),
    user: (
      <>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    calendar: (
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </>
    ),
    alert: (
      <>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" x2="12" y1="9" y2="13" />
        <line x1="12" x2="12.01" y1="17" y2="17" />
      </>
    ),
    ruler: (
      <>
        <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
        <path d="m14.5 12.5 2-2" />
        <path d="m11.5 9.5 2-2" />
        <path d="m8.5 6.5 2-2" />
      </>
    ),
  };
  return <svg {...props}>{paths[type]}</svg>;
}

/* ─── Helpers ─── */
let _id = 0;
function uid(): number {
  return ++_id;
}
function rand(a: number, b: number): number {
  return Math.random() * (b - a) + a;
}

/* ─── Y-position collision avoidance ─── */
const MIN_Y_GAP = 14; // minimum % gap between items

function pickY(activeYs: number[]): number {
  // Try up to 20 times to find a non-overlapping y
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = rand(12, 75);
    const collision = activeYs.some((y) => Math.abs(y - candidate) < MIN_Y_GAP);
    if (!collision) return candidate;
  }
  // Fallback: use least-crowded region
  const sorted = [...activeYs].sort((a, b) => a - b);
  if (sorted.length === 0) return rand(12, 75);

  let bestGap = 0;
  let bestMid = 45;

  // Check gap before first
  if (sorted[0] > 12 + MIN_Y_GAP) {
    const gap = sorted[0] - 12;
    if (gap > bestGap) {
      bestGap = gap;
      bestMid = 12 + gap / 2;
    }
  }
  // Check gaps between items
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = sorted[i + 1] - sorted[i];
    if (gap > bestGap) {
      bestGap = gap;
      bestMid = sorted[i] + gap / 2;
    }
  }
  // Check gap after last
  if (75 - sorted[sorted.length - 1] > MIN_Y_GAP) {
    const gap = 75 - sorted[sorted.length - 1];
    if (gap > bestGap) {
      bestGap = gap;
      bestMid = sorted[sorted.length - 1] + gap / 2;
    }
  }

  return Math.max(12, Math.min(75, bestMid));
}

/* ─── Dot grid ─── */
function DotGrid(): ReactNode {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        maskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 75%)",
      }}
    />
  );
}

/* ─── Gradient portal ─── */
function Portal(): ReactNode {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 120,
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-20px -60px",
          background: `radial-gradient(ellipse at center, ${BLUE_GLOW} 0%, transparent 70%)`,
          filter: "blur(40px)",
          opacity: 0.25,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "50%",
          background: `linear-gradient(to right, transparent, ${BG} 30%, rgba(59,130,246,0.03))`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "8%",
          bottom: "12%",
          left: "50%",
          width: 2,
          transform: "translateX(-50%)",
          background: `linear-gradient(to bottom, transparent, ${BLUE}, ${BLUE}, transparent)`,
          opacity: 0.5,
          boxShadow: `0 0 12px ${BLUE_GLOW}, 0 0 40px ${BLUE_GLOW}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: "50%",
          background: `linear-gradient(to left, transparent, ${BG} 30%, rgba(59,130,246,0.03))`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 8,
          height: 8,
          transform: "translate(-50%, -50%) rotate(45deg)",
          background: BLUE,
          boxShadow: `0 0 16px ${BLUE_GLOW}, 0 0 40px ${BLUE_GLOW}`,
          borderRadius: 2,
          animation: "portalPulse 2s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ─── Static fallback for prefers-reduced-motion ─── */
function StaticFallback(): ReactNode {
  const leftPair = dataPairs[0];
  const rightPair = dataPairs[0];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 40,
        padding: "0 32px",
      }}
    >
      {/* Paper side */}
      <div
        style={{
          background: "#FFF9F0",
          borderRadius: 3,
          padding: "10px 14px 10px 30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          border: "1px solid #E8DFD0",
          position: "relative",
          minWidth: 150,
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 18px, #E8DFD0 18px, #E8DFD0 19px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 22,
            width: 1,
            background: "#E8B4B4",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 7,
            width: 6,
            height: 6,
            borderRadius: "50%",
            border: "1px solid #D4C9B8",
            background: "#F0E8DA",
          }}
        />
        {leftPair.paper.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: 12,
              lineHeight: "19px",
              color: "#3D3529",
              fontFamily: '"Caveat", cursive',
              fontWeight: 500,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Arrow */}
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <path
          d="M0 10h32M26 4l8 6-8 6"
          stroke={BLUE}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Output side */}
      <div
        style={{
          padding: "10px 16px",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${BLUE_BORDER}`,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: BLUE_SUBTLE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MiniIcon type={rightPair.output.icon} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEXT }}>
            {rightPair.output.label}
          </div>
          <div style={{ fontSize: 10, color: TEXT_DIM }}>
            {rightPair.output.value}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Paper snippet ─── */
function PaperSnippet({ item, onDone }: { item: PaperItem; onDone: () => void }) {
  const [stage, setStage] = useState<"entering" | "drifting" | "exiting">("entering");

  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setStage("drifting")),
    );
    const t2 = setTimeout(() => setStage("exiting"), item.duration * 0.6);
    const t3 = setTimeout(onDone, item.duration + 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const getStyle = (): AnimationStyle => {
    switch (stage) {
      case "entering":
        return {
          left: "-22%",
          opacity: 0,
          transform: `rotate(${item.rot}deg) scale(0.9)`,
        };
      case "drifting":
        return {
          left: `${item.restX}%`,
          opacity: 0.95,
          transform: `rotate(${item.rot}deg) scale(1)`,
        };
      case "exiting":
        return {
          left: "42%",
          opacity: 0,
          transform: "rotate(0deg) scale(0.6)",
        };
    }
  };

  const s = getStyle();

  return (
    <div
      style={{
        position: "absolute",
        left: s.left,
        top: `${item.y}%`,
        transform: s.transform,
        opacity: s.opacity,
        transition:
          stage === "drifting"
            ? `all ${item.duration * 0.45}ms cubic-bezier(0.25, 1, 0.5, 1)`
            : `all ${item.duration * 0.4}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <div
        style={{
          background: "#FFF9F0",
          borderRadius: 3,
          padding: "8px 12px 8px 28px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)",
          border: "1px solid #E8DFD0",
          position: "relative",
          minWidth: 140,
          maxWidth: 185,
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 18px, #E8DFD0 18px, #E8DFD0 19px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 20,
            width: 1,
            background: "#E8B4B4",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 6,
            width: 6,
            height: 6,
            borderRadius: "50%",
            border: "1px solid #D4C9B8",
            background: "#F0E8DA",
          }}
        />
        {item.lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: 11,
              lineHeight: "19px",
              color: "#3D3529",
              fontFamily: '"Caveat", "Segoe Script", cursive',
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Structured output card ─── */
function OutputCard({ item, onDone }: { item: OutputItem; onDone: () => void }) {
  const [stage, setStage] = useState<"entering" | "resting" | "exiting">("entering");

  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setStage("resting")),
    );
    const t2 = setTimeout(() => setStage("exiting"), item.duration * 0.7);
    const t3 = setTimeout(onDone, item.duration + 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const getStyle = (): AnimationStyle => {
    switch (stage) {
      case "entering":
        return { left: "54%", opacity: 0, transform: "scale(0.6)" };
      case "resting":
        return { left: `${item.restX}%`, opacity: 0.92, transform: "scale(1)" };
      case "exiting":
        return { left: "105%", opacity: 0, transform: "scale(0.95)" };
    }
  };

  const s = getStyle();

  return (
    <div
      style={{
        position: "absolute",
        left: s.left,
        top: `${item.y}%`,
        transform: s.transform,
        opacity: s.opacity,
        transition:
          stage === "resting"
            ? `all ${item.duration * 0.35}ms cubic-bezier(0.16, 1, 0.3, 1)`
            : `all ${item.duration * 0.35}ms cubic-bezier(0.4, 0, 0.6, 1)`,
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 2,
      }}
    >
      <div
        style={{
          padding: "8px 14px",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: `1px solid ${BLUE_BORDER}`,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: `0 0 20px rgba(59,130,246,0.05), 0 2px 8px rgba(0,0,0,0.3)`,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: BLUE_SUBTLE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MiniIcon type={item.icon} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: TEXT }}>
            {item.label}
          </span>
          <span style={{ fontSize: 9.5, color: TEXT_DIM }}>{item.value}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Column labels ─── */
function ColumnLabels(): ReactNode {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 20,
          fontSize: 10,
          fontWeight: 600,
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          zIndex: 5,
        }}
      >
        Paper Records
      </div>
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 20,
          fontSize: 10,
          fontWeight: 600,
          color: BLUE,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: 0.5,
          zIndex: 5,
        }}
      >
        Structured Data
      </div>
    </>
  );
}

/* ─── useReducedMotion hook ─── */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/* ─── useContainerWidth hook for responsive behavior ─── */
function useContainerWidth(ref: RefObject<HTMLDivElement | null>): number {
  const [width, setWidth] = useState(750);
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

/* ─── Main component ─── */
export default function HikmaHeroStream() {
  const [papers, setPapers] = useState<PaperItem[]>([]);
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const pairIndexRef = useRef(0);
  const activeYsRef = useRef<number[]>([]);
  const spawnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerWidth = useContainerWidth(containerRef);

  const isCompact = containerWidth < 500;

  // Track active y positions
  const registerY = useCallback((y: number) => {
    activeYsRef.current.push(y);
  }, []);

  const unregisterY = useCallback((y: number) => {
    const idx = activeYsRef.current.indexOf(y);
    if (idx > -1) activeYsRef.current.splice(idx, 1);
  }, []);

  const spawnPair = useCallback(() => {
    const pairIdx = pairIndexRef.current % dataPairs.length;
    pairIndexRef.current++;
    const pair = dataPairs[pairIdx];

    const y = pickY(activeYsRef.current);
    registerY(y);

    const duration = rand(3200, 4200);
    const paperId = uid();
    const outputId = uid();

    setPapers((prev) => [
      ...prev,
      {
        id: paperId,
        lines: pair.paper,
        restX: rand(4, 22),
        y,
        rot: rand(-10, 10),
        duration,
      },
    ]);

    // Output appears after paper passes through portal
    setTimeout(() => {
      setOutputs((prev) => [
        ...prev,
        {
          id: outputId,
          ...pair.output,
          restX: rand(58, 74),
          y: y + rand(-3, 3),
          duration,
        },
      ]);
    }, duration * 0.75);

    // Unregister y after pair is fully done
    setTimeout(() => unregisterY(y), duration + 500);

    // Schedule next spawn (recursive setTimeout for clean varying intervals)
    spawnTimerRef.current = setTimeout(() => spawnPair(), rand(1000, 1600));
  }, [registerY, unregisterY]);

  const removePaper = useCallback((id: number) => {
    setPapers((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const removeOutput = useCallback((id: number) => {
    setOutputs((prev) => prev.filter((o) => o.id !== id));
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    ensureStyles();

    // Staggered initial burst
    const initTimers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < 4; i++) {
      initTimers.push(
        setTimeout(() => {
          if (i === 0) {
            // First spawn kicks off the recursive chain
            spawnPair();
          } else {
            // Additional initial items — one-off spawns
            const pairIdx = pairIndexRef.current % dataPairs.length;
            pairIndexRef.current++;
            const pair = dataPairs[pairIdx];
            const y = pickY(activeYsRef.current);
            registerY(y);
            const duration = rand(3200, 4200);
            const paperId = uid();
            const outputId = uid();

            setPapers((prev) => [
              ...prev,
              {
                id: paperId,
                lines: pair.paper,
                restX: rand(4, 22),
                y,
                rot: rand(-10, 10),
                duration,
              },
            ]);

            setTimeout(() => {
              setOutputs((prev) => [
                ...prev,
                {
                  id: outputId,
                  ...pair.output,
                  restX: rand(58, 74),
                  y: y + rand(-3, 3),
                  duration,
                },
              ]);
            }, duration * 0.75);

            setTimeout(() => unregisterY(y), duration + 500);
          }
        }, i * 600),
      );
    }

    return () => {
      initTimers.forEach(clearTimeout);
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
    };
  }, [reducedMotion, spawnPair, registerY, unregisterY]);

  // Responsive: height scales down on small screens
  const containerHeight = isCompact ? 300 : 420;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: isCompact ? "24px 12px" : "48px 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
      }}
    >
      <div
        ref={containerRef}
        className="hikma-hero-animated"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 750,
          height: containerHeight,
          background: BG,
          borderRadius: isCompact ? 14 : 20,
          overflow: "hidden",
          border: `1px solid ${BORDER}`,
          boxShadow: `0 0 80px ${BLUE_SUBTLE}, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        <DotGrid />

        {reducedMotion ? (
          <StaticFallback />
        ) : (
          <>
            <Portal />
            <ColumnLabels />
            {papers.map((item) => (
              <PaperSnippet
                key={item.id}
                item={item}
                onDone={() => removePaper(item.id)}
              />
            ))}
            {outputs.map((item) => (
              <OutputCard
                key={item.id}
                item={item}
                onDone={() => removeOutput(item.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
