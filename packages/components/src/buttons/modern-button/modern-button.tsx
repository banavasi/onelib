// Source: Sera UI (seraui.com)
"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

// --- Icon Components ---

const Check: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const Copy: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const X: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const Download: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

// --- Base Button ---

interface ButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 h-9 px-4 py-2 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
ButtonBase.displayName = "ButtonBase";

// --- CopyButton ---

export interface CopyButtonProps {
  textToCopy: string;
  successDuration?: number;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  successDuration = 2000,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isJiggling, setIsJiggling] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setIsJiggling(true);

      setTimeout(() => setIsJiggling(false), 500);
      setTimeout(() => setIsCopied(false), successDuration);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }, [textToCopy, successDuration]);

  const jiggleCss = `
    @keyframes jiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-10deg); }
      50% { transform: rotate(10deg); }
      75% { transform: rotate(-5deg); }
    }
    .animate-jiggle {
      animation: jiggle 0.5s ease-in-out;
    }
  `;

  return (
    <>
      <style>{jiggleCss}</style>
      <ButtonBase
        onClick={handleCopy}
        className={cn(
          "relative transition-all duration-300",
          isJiggling && "animate-jiggle"
        )}
        aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
      >
        <span
          className={cn(
            "transition-all duration-300",
            isCopied ? "scale-0 opacity-0" : "scale-100 opacity-100"
          )}
        >
          <Copy className="h-4 w-4" />
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300",
            isCopied ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )}
        >
          <Check className="h-4 w-4 text-green-500" />
        </span>
      </ButtonBase>
    </>
  );
};

CopyButton.displayName = "CopyButton";

// --- ProcessingButton ---

export type ProcessingState = "idle" | "processing" | "success" | "error";

export interface ProcessingButtonProps {
  onProcess: () => Promise<void>;
  children?: React.ReactNode;
}

const ProcessingButton: React.FC<ProcessingButtonProps> = ({
  onProcess,
  children,
}) => {
  const [state, setState] = useState<ProcessingState>("idle");

  const handleClick = useCallback(async () => {
    if (state !== "idle") return;

    setState("processing");
    try {
      await onProcess();
      setState("success");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }, [state, onProcess]);

  const scaleCss = `
    @keyframes scale-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .animate-scale-pulse {
      animation: scale-pulse 0.3s ease-in-out;
    }
  `;

  const stateConfig = {
    idle: {
      icon: <Download className="h-4 w-4" />,
      text: children ?? "Process",
      className: "",
    },
    processing: {
      icon: (
        <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ),
      text: "Processing...",
      className: "opacity-80 cursor-not-allowed",
    },
    success: {
      icon: <Check className="h-4 w-4 text-green-500" />,
      text: "Success!",
      className: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 animate-scale-pulse",
    },
    error: {
      icon: <X className="h-4 w-4 text-red-500" />,
      text: "Error",
      className: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 animate-scale-pulse",
    },
  };

  const current = stateConfig[state];

  return (
    <>
      <style>{scaleCss}</style>
      <ButtonBase
        onClick={handleClick}
        disabled={state === "processing"}
        className={cn("transition-all duration-300", current.className)}
      >
        {current.icon}
        <span>{current.text}</span>
      </ButtonBase>
    </>
  );
};

ProcessingButton.displayName = "ProcessingButton";

export { CopyButton, ProcessingButton };
export default CopyButton;
