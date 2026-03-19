import { useState, useEffect, useRef, type RefObject, type ReactNode } from "react";

/* ─── Color tokens ─── */
const BLUE = "#2f51b3";
const BG = "#09090B";
const TEXT = "#f4f4f5";
const TEXT_DIM = "#71717a";
const BORDER = "rgba(255, 255, 255, 0.06)";
const CARD_BG = "rgba(255, 255, 255, 0.03)";
const CARD_BORDER = "rgba(47, 81, 179, 0.2)";

/* ─── Style injection ─── */
const STYLE_ID = "platform-overview-styles";
function ensureStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes marchingAnts {
      to { stroke-dashoffset: -20; }
    }
    @media (prefers-reduced-motion: reduce) {
      .platform-overview-animated * {
        animation-duration: 0.01ms !important;
        animation-play-state: paused !important;
      }
    }
  `;
  document.head.appendChild(style);
}

/* ─── Hooks ─── */
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

function useContainerWidth(ref: RefObject<HTMLDivElement | null>): number {
  const [width, setWidth] = useState(800);
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

/* ─── SVG Icons (24x24, stroke only) ─── */
function SmartphoneIcon(): ReactNode {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function DesktopIcon(): ReactNode {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function HubIcon(): ReactNode {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function ServerIcon(): ReactNode {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function DatabaseIcon(): ReactNode {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

/* ─── Node card component ─── */
interface NodeData {
  title: string;
  subtitle: string;
  icon: ReactNode;
}

function NodeCard({ node, compact }: { node: NodeData; compact?: boolean }): ReactNode {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 10,
        padding: compact ? "10px 14px" : "14px 18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        zIndex: 2,
        position: "relative",
        minWidth: compact ? 100 : 120,
      }}
    >
      <div
        style={{
          width: compact ? 36 : 44,
          height: compact ? 36 : 44,
          borderRadius: 10,
          background: "rgba(47, 81, 179, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {node.icon}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: compact ? 12 : 13, fontWeight: 600, color: TEXT, lineHeight: "1.3" }}>
          {node.title}
        </div>
        <div style={{ fontSize: compact ? 10 : 11, color: TEXT_DIM, marginTop: 1, lineHeight: "1.3" }}>
          {node.subtitle}
        </div>
      </div>
    </div>
  );
}

/* ─── Connection lines (desktop layout) ─── */
function DesktopConnections({ reducedMotion }: { reducedMotion: boolean }): ReactNode {
  const animStyle = reducedMotion ? {} : { animation: "marchingAnts 0.8s linear infinite" };

  // Layout positions (percentages):
  // Left column (clients): Mobile at ~14%, 28%  Desktop at ~14%, 72%
  // Center: Hub at ~46%, 50%
  // Right column: Server at ~80%, 28%  Database at ~80%, 72%
  //
  // Connections:
  // Mobile -> Hub, Mobile -> Server (cloud)
  // Desktop -> Hub, Desktop -> Server (cloud)
  // Hub -> Server (cloud)
  // Server -> Database

  const lines = [
    // Mobile -> Hub
    { x1: "21%", y1: "28%", x2: "41%", y2: "50%" },
    // Mobile -> Server (cloud)
    { x1: "21%", y1: "20%", x2: "79%", y2: "20%" },
    // Desktop -> Hub
    { x1: "21%", y1: "76%", x2: "41%", y2: "50%" },
    // Desktop -> Server (cloud)
    { x1: "21%", y1: "82%", x2: "79%", y2: "82%" },
    // Hub -> Server
    { x1: "59%", y1: "50%", x2: "79%", y2: "50%" },
    // Server -> Database
    { x1: "87%", y1: "44%", x2: "87%", y2: "60%" },
  ];

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    >
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={BLUE}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          strokeOpacity={0.4}
          style={animStyle}
        />
      ))}
    </svg>
  );
}

/* ─── Connection lines (mobile/vertical layout) ─── */
function VerticalConnections({ reducedMotion }: { reducedMotion: boolean }): ReactNode {
  const animStyle = reducedMotion ? {} : { animation: "marchingAnts 0.8s linear infinite" };

  // Vertical layout: Clients row -> Hub -> Cloud row (Server + DB)
  const lines = [
    // Mobile -> Hub
    { x1: "30%", y1: "22%", x2: "50%", y2: "40%" },
    // Desktop -> Hub
    { x1: "70%", y1: "22%", x2: "50%", y2: "40%" },
    // Hub -> Server
    { x1: "50%", y1: "58%", x2: "30%", y2: "76%" },
    // Hub -> Database
    { x1: "50%", y1: "58%", x2: "70%", y2: "76%" },
    // Server -> Database
    { x1: "38%", y1: "82%", x2: "62%", y2: "82%" },
  ];

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    >
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={BLUE}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          strokeOpacity={0.4}
          style={animStyle}
        />
      ))}
    </svg>
  );
}

/* ─── Column label ─── */
function ColLabel({ children, style }: { children: string; style: React.CSSProperties }): ReactNode {
  return (
    <div
      style={{
        position: "absolute",
        fontSize: 9,
        fontWeight: 600,
        color: "rgba(255,255,255,0.25)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        zIndex: 5,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Desktop layout ─── */
function DesktopLayout({ reducedMotion }: { reducedMotion: boolean }): ReactNode {
  const mobileNode: NodeData = { title: "Mobile App", subtitle: "React Native", icon: <SmartphoneIcon /> };
  const desktopNode: NodeData = { title: "Desktop App", subtitle: "Rust & Tauri", icon: <DesktopIcon /> };
  const hubNode: NodeData = { title: "Local Sync Hub", subtitle: "Rust", icon: <HubIcon /> };
  const serverNode: NodeData = { title: "Server & Admin", subtitle: "TypeScript + TanStack", icon: <ServerIcon /> };
  const dbNode: NodeData = { title: "Database", subtitle: "PostgreSQL", icon: <DatabaseIcon /> };

  return (
    <>
      <DesktopConnections reducedMotion={reducedMotion} />

      <ColLabel style={{ top: 10, left: 20 }}>Devices</ColLabel>
      <ColLabel style={{ top: 10, left: "50%", transform: "translateX(-50%)" }}>Local Hub</ColLabel>
      <ColLabel style={{ top: 10, right: 20 }}>Cloud</ColLabel>

      {/* Left column: client devices */}
      <div style={{ position: "absolute", left: "4%", top: "12%", zIndex: 2 }}>
        <NodeCard node={mobileNode} />
      </div>
      <div style={{ position: "absolute", left: "4%", bottom: "8%", zIndex: 2 }}>
        <NodeCard node={desktopNode} />
      </div>

      {/* Center: hub */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 2 }}>
        <NodeCard node={hubNode} />
      </div>

      {/* Right column: cloud */}
      <div style={{ position: "absolute", right: "4%", top: "12%", zIndex: 2 }}>
        <NodeCard node={serverNode} />
      </div>
      <div style={{ position: "absolute", right: "4%", bottom: "8%", zIndex: 2 }}>
        <NodeCard node={dbNode} />
      </div>
    </>
  );
}

/* ─── Mobile/vertical layout ─── */
function MobileLayout({ reducedMotion }: { reducedMotion: boolean }): ReactNode {
  const mobileNode: NodeData = { title: "Mobile App", subtitle: "React Native", icon: <SmartphoneIcon /> };
  const desktopNode: NodeData = { title: "Desktop App", subtitle: "Rust & Tauri", icon: <DesktopIcon /> };
  const hubNode: NodeData = { title: "Local Sync Hub", subtitle: "Rust", icon: <HubIcon /> };
  const serverNode: NodeData = { title: "Server & Admin", subtitle: "TS + TanStack", icon: <ServerIcon /> };
  const dbNode: NodeData = { title: "Database", subtitle: "PostgreSQL", icon: <DatabaseIcon /> };

  return (
    <>
      <VerticalConnections reducedMotion={reducedMotion} />

      {/* Top row: devices */}
      <div style={{ position: "absolute", top: "6%", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 16, zIndex: 2 }}>
        <NodeCard node={mobileNode} compact />
        <NodeCard node={desktopNode} compact />
      </div>

      {/* Middle: hub */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 2 }}>
        <NodeCard node={hubNode} compact />
      </div>

      {/* Bottom row: cloud */}
      <div style={{ position: "absolute", bottom: "6%", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 16, zIndex: 2 }}>
        <NodeCard node={serverNode} compact />
        <NodeCard node={dbNode} compact />
      </div>
    </>
  );
}

/* ─── Main component ─── */
export default function PlatformOverview() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerWidth = useContainerWidth(containerRef);
  const reducedMotion = useReducedMotion();

  const isVertical = containerWidth < 580;

  useEffect(() => {
    ensureStyles();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
      }}
    >
      <div
        ref={containerRef}
        className="platform-overview-animated"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 800,
          height: isVertical ? 440 : 340,
          background: BG,
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid ${BORDER}`,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
        }}
      >
        {isVertical ? (
          <MobileLayout reducedMotion={reducedMotion} />
        ) : (
          <DesktopLayout reducedMotion={reducedMotion} />
        )}
      </div>
    </div>
  );
}
