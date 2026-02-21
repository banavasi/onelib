// Source: Sera UI (seraui.com)
"use client";
import React, { useEffect, useRef, FC, ReactNode } from "react";

interface NoiseCardProps {
  width?: string;
  height?: string;
  children: ReactNode;
  className?: string;
  animated?: boolean;
  noiseOpacity?: number;
  grainSize?: number;
  bgColor?: string;
}

const NoiseCard: FC<NoiseCardProps> = ({
  width = "w-80",
  height = "h-48",
  children,
  className = "",
  animated = true,
  noiseOpacity = 0.15,
  grainSize = 1,
  bgColor = "bg-black",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    const generateNoise = () => {
      const { width: w, height: h } = canvas;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4 * grainSize) {
        const value = Math.random() * 255;
        for (let g = 0; g < grainSize && i + g * 4 < data.length; g++) {
          const idx = i + g * 4;
          data[idx] = value;
          data[idx + 1] = value;
          data[idx + 2] = value;
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const animate = () => {
      generateNoise();
      if (animated) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    resizeCanvas();
    animate();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      if (!animated) generateNoise();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [animated, grainSize]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${bgColor} ${width} ${height} ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: noiseOpacity, mixBlendMode: "overlay" }}
      />
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white p-6">
        {children}
      </div>
    </div>
  );
};

export default NoiseCard;
