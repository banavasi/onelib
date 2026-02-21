// Source: Sera UI (seraui.com)
"use client";

import { motion } from "motion/react";

interface TextRevealProps {
  text?: string;
  className?: string;
}

const TextReveal = ({
  text = "Don't wait for the perfect moment. Take the moment and make it perfect.",
  className = "",
}: TextRevealProps) => {
  const words = text.split(" ");

  return (
    <div className={`flex flex-wrap justify-center gap-x-2 gap-y-1 ${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: index * 0.1,
            duration: 0.6,
            ease: "easeOut",
          }}
          className="inline-block text-2xl font-semibold"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

export { TextReveal };
export default TextReveal;
