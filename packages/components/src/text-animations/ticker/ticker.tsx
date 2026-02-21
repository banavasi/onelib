// Source: Sera UI (seraui.com)
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface NumberTickerProps {
  value: number;
  duration?: number;
  delay?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  onComplete?: () => void;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

const NumberTicker = ({
  value,
  duration = 2000,
  delay = 0,
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
  className = "",
  onComplete,
}: NumberTickerProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const hasStarted = useRef(false);

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentValue = easedProgress * value;

      setDisplayValue(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        onComplete?.();
      }
    },
    [value, duration, onComplete],
  );

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const timeoutId = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, delay]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toFixed(decimalPlaces)}
      {suffix}
    </span>
  );
};

export { NumberTicker };
export default NumberTicker;
