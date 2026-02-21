// Source: Sera UI (seraui.com)
"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface TextHighlighterRef {
  triggerHighlight: () => void;
  removeHighlight: () => void;
}

interface TextHighlighterProps {
  children: React.ReactNode;
  highlightColor?: string;
  direction?: "ltr" | "rtl";
  className?: string;
  triggerOnScroll?: boolean;
  threshold?: number;
  delay?: number;
  duration?: number;
}

const TextHighlighter = forwardRef<TextHighlighterRef, TextHighlighterProps>(
  (
    {
      children,
      highlightColor = "linear-gradient(120deg, #d4fc79, #96e6a1)",
      direction = "ltr",
      className,
      triggerOnScroll = true,
      threshold = 0.5,
      delay = 0,
      duration = 0.5,
    },
    ref,
  ) => {
    const [isHighlighted, setIsHighlighted] = useState(false);
    const elementRef = useRef<HTMLSpanElement>(null);

    const triggerHighlight = useCallback(() => {
      setIsHighlighted(true);
    }, []);

    const removeHighlight = useCallback(() => {
      setIsHighlighted(false);
    }, []);

    useImperativeHandle(ref, () => ({
      triggerHighlight,
      removeHighlight,
    }));

    useEffect(() => {
      if (!triggerOnScroll || !elementRef.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsHighlighted(true), delay * 1000);
            observer.disconnect();
          }
        },
        { threshold },
      );

      observer.observe(elementRef.current);
      return () => observer.disconnect();
    }, [triggerOnScroll, threshold, delay]);

    const backgroundPosition = direction === "rtl"
      ? isHighlighted ? "0 100%" : "200% 100%"
      : isHighlighted ? "0 100%" : "-200% 100%";

    return (
      <span
        ref={elementRef}
        className={cn("relative inline", className)}
        style={{
          backgroundImage: highlightColor,
          backgroundSize: isHighlighted ? "100% 40%" : "0% 40%",
          backgroundPosition: backgroundPosition,
          backgroundRepeat: "no-repeat",
          transition: `background-size ${duration}s ease, background-position ${duration}s ease`,
        }}
      >
        {children}
      </span>
    );
  },
);

TextHighlighter.displayName = "TextHighlighter";

export { TextHighlighter };
export default TextHighlighter;
