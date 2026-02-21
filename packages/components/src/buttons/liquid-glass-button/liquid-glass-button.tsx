// Source: Sera UI (seraui.com)
"use client";

import React, { useEffect, useState, useId } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- useDarkMode hook ---

function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDark;
}

// --- Glass Presets ---

const GLASS_PRESETS = {
  subtle: {
    blur: 8,
    saturation: 1.2,
    opacity: 0.4,
    borderOpacity: 0.15,
  },
  default: {
    blur: 16,
    saturation: 1.8,
    opacity: 0.6,
    borderOpacity: 0.25,
  },
  bold: {
    blur: 24,
    saturation: 2.2,
    opacity: 0.75,
    borderOpacity: 0.35,
  },
  ghost: {
    blur: 4,
    saturation: 1.0,
    opacity: 0.2,
    borderOpacity: 0.1,
  },
} as const;

type GlassPreset = keyof typeof GLASS_PRESETS;

// --- Glass Component ---

export interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  preset?: GlassPreset;
  intensity?: number;
}

const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  ({ children, className, preset = "default", intensity = 1, style, ...props }, ref) => {
    const isDark = useDarkMode();
    const filterId = useId();
    const config = GLASS_PRESETS[preset];

    const blur = config.blur * intensity;
    const saturation = config.saturation;
    const bgOpacity = config.opacity;
    const borderOp = config.borderOpacity;

    const bgColor = isDark
      ? `rgba(255, 255, 255, ${bgOpacity * 0.15})`
      : `rgba(255, 255, 255, ${bgOpacity})`;

    const borderColor = isDark
      ? `rgba(255, 255, 255, ${borderOp})`
      : `rgba(255, 255, 255, ${borderOp + 0.2})`;

    return (
      <>
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <filter id={filterId}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.01"
                numOctaves="3"
                seed="1"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={2 * intensity}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        <div
          ref={ref}
          className={cn(
            "relative rounded-2xl overflow-hidden transition-all duration-300",
            className
          )}
          style={{
            backdropFilter: `blur(${blur}px) saturate(${saturation}) url(#${filterId})`,
            WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation})`,
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
            boxShadow: isDark
              ? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
              : "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
            ...style,
          }}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);

Glass.displayName = "Glass";

// --- GlassButton variants ---

const glassButtonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      size: {
        sm: "h-8 px-3 text-sm rounded-lg",
        md: "h-10 px-4 text-base rounded-xl",
        lg: "h-12 px-6 text-lg rounded-2xl",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// --- GlassButton Component ---

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  variant?: GlassPreset;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ children, className, size, variant = "default", disabled, onClick, ...props }, ref) => {
    return (
      <Glass
        preset={variant}
        className={cn(
          glassButtonVariants({ size }),
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLDivElement>}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            (onClick as unknown as React.MouseEventHandler<HTMLDivElement>)?.(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        aria-disabled={disabled}
      >
        {children ?? "Glass Button"}
      </Glass>
    );
  }
);

GlassButton.displayName = "GlassButton";

export { Glass };
export default GlassButton;
