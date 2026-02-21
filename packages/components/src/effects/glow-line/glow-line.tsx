// Source: Sera UI (seraui.com)
"use client";

import React from "react";

// --- Color Schemes ---

const COLOR_SCHEMES = {
  purple: {
    primary: "#a855f7",
    secondary: "#7c3aed",
    glow: "rgba(168, 85, 247, 0.4)",
  },
  blue: {
    primary: "#3b82f6",
    secondary: "#2563eb",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  green: {
    primary: "#22c55e",
    secondary: "#16a34a",
    glow: "rgba(34, 197, 94, 0.4)",
  },
  red: {
    primary: "#ef4444",
    secondary: "#dc2626",
    glow: "rgba(239, 68, 68, 0.4)",
  },
} as const;

type GlowColor = keyof typeof COLOR_SCHEMES;

// --- GlowLine Component ---

export interface GlowLineProps {
  orientation?: "horizontal" | "vertical";
  position?: string;
  color?: GlowColor;
  className?: string;
}

const GlowLine: React.FC<GlowLineProps> = ({
  orientation = "horizontal",
  position = "50%",
  color = "purple",
  className,
}) => {
  const colors = COLOR_SCHEMES[color];
  const isHorizontal = orientation === "horizontal";

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    ...(isHorizontal
      ? {
          top: position,
          left: 0,
          right: 0,
          height: "1px",
          transform: "translateY(-50%)",
        }
      : {
          left: position,
          top: 0,
          bottom: 0,
          width: "1px",
          transform: "translateX(-50%)",
        }),
  };

  const glowStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    ...(isHorizontal
      ? {
          height: "20px",
          top: "-10px",
          background: `linear-gradient(90deg, transparent, ${colors.glow}, transparent)`,
          filter: "blur(10px)",
        }
      : {
          width: "20px",
          left: "-10px",
          background: `linear-gradient(180deg, transparent, ${colors.glow}, transparent)`,
          filter: "blur(10px)",
        }),
  };

  const lineStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: isHorizontal
      ? `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.secondary}, ${colors.primary}, transparent)`
      : `linear-gradient(180deg, transparent, ${colors.primary}, ${colors.secondary}, ${colors.primary}, transparent)`,
  };

  const brightGlowStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    ...(isHorizontal
      ? {
          height: "4px",
          top: "-1.5px",
          background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
          filter: "blur(2px)",
          opacity: 0.8,
        }
      : {
          width: "4px",
          left: "-1.5px",
          background: `linear-gradient(180deg, transparent, ${colors.primary}, transparent)`,
          filter: "blur(2px)",
          opacity: 0.8,
        }),
  };

  return (
    <div style={containerStyle} className={className}>
      {/* Outer glow */}
      <div style={glowStyle} />
      {/* Core line */}
      <div style={lineStyle} />
      {/* Bright inner glow */}
      <div style={brightGlowStyle} />
    </div>
  );
};

GlowLine.displayName = "GlowLine";

export default GlowLine;
