// Source: Sera UI (seraui.com)
"use client";

import { motion } from "motion/react";

interface BlurInTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

const BlurInText = ({
  text,
  className = "",
  delay = 0.2,
  duration = 0.5,
}: BlurInTextProps) => {
  const characters = text.split("");

  return (
    <span className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            delay: delay + index * 0.04,
            duration: duration,
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export { BlurInText };
export default BlurInText;
