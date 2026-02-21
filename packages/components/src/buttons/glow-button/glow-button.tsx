// Source: Sera UI (seraui.com)
"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// --- useTheme hook ---

function useTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mq.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return theme;
}

// --- Variants ---

type Variant = "blue" | "pink" | "green";

const variants: Record<Variant, {
  light: { glow: string; bg: string; text: string; border: string };
  dark: { glow: string; bg: string; text: string; border: string };
}> = {
  blue: {
    light: {
      glow: "rgba(59, 130, 246, 0.5)",
      bg: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)",
      text: "#1e40af",
      border: "rgba(59, 130, 246, 0.3)",
    },
    dark: {
      glow: "rgba(59, 130, 246, 0.6)",
      bg: "linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #2563eb 100%)",
      text: "#bfdbfe",
      border: "rgba(59, 130, 246, 0.4)",
    },
  },
  pink: {
    light: {
      glow: "rgba(236, 72, 153, 0.5)",
      bg: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)",
      text: "#9d174d",
      border: "rgba(236, 72, 153, 0.3)",
    },
    dark: {
      glow: "rgba(236, 72, 153, 0.6)",
      bg: "linear-gradient(135deg, #4a1942 0%, #831843 50%, #be185d 100%)",
      text: "#fbcfe8",
      border: "rgba(236, 72, 153, 0.4)",
    },
  },
  green: {
    light: {
      glow: "rgba(34, 197, 94, 0.5)",
      bg: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)",
      text: "#166534",
      border: "rgba(34, 197, 94, 0.3)",
    },
    dark: {
      glow: "rgba(34, 197, 94, 0.6)",
      bg: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)",
      text: "#bbf7d0",
      border: "rgba(34, 197, 94, 0.4)",
    },
  },
};

// --- GlowButton ---

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: Variant;
}

const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ children, variant = "blue", className, ...props }, ref) => {
    const theme = useTheme();
    const colors = variants[variant][theme];

    return (
      <div className="relative inline-flex group">
        {/* Glow effect */}
        <div
          className="absolute -inset-1 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: colors.glow }}
        />
        {/* Button */}
        <button
          ref={ref}
          className={cn(
            "relative inline-flex items-center justify-center px-8 py-3 text-sm font-semibold rounded-xl transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
            className
          )}
          style={{
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
          }}
          {...props}
        >
          {children ?? "Glow Button"}
        </button>
      </div>
    );
  }
);

GlowButton.displayName = "GlowButton";

export default GlowButton;
