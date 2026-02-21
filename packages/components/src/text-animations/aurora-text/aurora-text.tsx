// Source: Sera UI (seraui.com)
"use client";

import React from "react";

interface AuroraTextProps {
  children: React.ReactNode;
  colors?: string[];
  speed?: number;
  className?: string;
}

const AuroraText = ({
  children,
  colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
  speed = 5,
  className = "",
}: AuroraTextProps) => {
  const gradientColors = colors.join(", ");

  return (
    <>
      <style>
        {`
          @keyframes aurora {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-aurora {
            animation: aurora ${speed}s ease infinite;
            background-size: 200% auto;
          }
        `}
      </style>
      <span
        className={`animate-aurora bg-clip-text text-transparent ${className}`}
        style={{
          backgroundImage: `linear-gradient(90deg, ${gradientColors}, ${colors[0]})`,
        }}
      >
        {children}
      </span>
    </>
  );
};

export { AuroraText };
export default AuroraText;
