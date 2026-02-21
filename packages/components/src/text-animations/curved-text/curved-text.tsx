// Source: Sera UI (seraui.com)
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface CanvasCurvedLoopProps {
  text?: string;
  speed?: number;
  curveHeight?: number;
  direction?: "left" | "right";
  interactive?: boolean;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  height?: number;
  gap?: number;
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";
}

const easingFunctions: Record<string, (t: number) => number> = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

const CanvasCurvedLoop = ({
  text = "A helpful UI library for design engineers. Use cool animations with just a copy and paste.",
  speed = 1,
  curveHeight = 40,
  direction = "left",
  interactive = true,
  fontSize = 48,
  fontFamily = "sans-serif",
  fontWeight = "bold",
  height = 200,
  gap = 50,
  easing = "linear",
}: CanvasCurvedLoopProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const mouseXRef = useRef<number | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);

  const easingFn = easingFunctions[easing] || easingFunctions.linear;

  const drawCurvedText = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      textToDraw: string,
      startX: number,
      width: number,
      canvasHeight: number,
    ) => {
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = "currentColor";

      const chars = textToDraw.split("");
      let totalWidth = 0;
      const charWidths = chars.map((char) => {
        const w = ctx.measureText(char).width;
        totalWidth += w;
        return w;
      });

      let x = startX;
      for (let i = 0; i < chars.length; i++) {
        const charX = x + charWidths[i] / 2;
        const normalizedX = ((charX % width) + width) % width;
        const t = normalizedX / width;
        const easedT = easingFn(t <= 0.5 ? t * 2 : 2 - t * 2);
        const y = canvasHeight / 2 - easedT * curveHeight;

        let interactiveOffset = 0;
        if (interactive && mouseXRef.current !== null) {
          const dist = Math.abs(charX - mouseXRef.current);
          if (dist < 100) {
            interactiveOffset = (1 - dist / 100) * -20;
          }
        }

        ctx.save();
        ctx.translate(charX, y + interactiveOffset);
        ctx.fillText(chars[i], -charWidths[i] / 2, 0);
        ctx.restore();

        x += charWidths[i];
      }

      return totalWidth;
    },
    [fontSize, fontFamily, fontWeight, curveHeight, interactive, easingFn],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setCanvasWidth(width);
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    });

    resizeObserver.observe(canvas.parentElement || canvas);
    return () => resizeObserver.disconnect();
  }, [height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio;
    const textWithGap = text + " ".repeat(Math.ceil(gap / fontSize));

    const animate = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvasWidth, height);

      const singleWidth = drawCurvedText(
        ctx,
        textWithGap,
        -99999,
        canvasWidth,
        height,
      );

      ctx.clearRect(0, 0, canvasWidth, height);

      if (singleWidth > 0) {
        const repetitions = Math.ceil((canvasWidth * 2) / singleWidth) + 2;
        const dirMult = direction === "right" ? 1 : -1;
        const baseOffset =
          ((offsetRef.current * dirMult) % singleWidth + singleWidth) %
          singleWidth;

        for (let r = -1; r < repetitions; r++) {
          drawCurvedText(
            ctx,
            textWithGap,
            baseOffset + r * singleWidth - singleWidth,
            canvasWidth,
            height,
          );
        }
      }

      ctx.restore();
      offsetRef.current += speed;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [
    canvasWidth,
    text,
    speed,
    curveHeight,
    direction,
    height,
    gap,
    fontSize,
    drawCurvedText,
  ]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!interactive) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mouseXRef.current = e.clientX - rect.left;
    },
    [interactive],
  );

  const handleMouseLeave = useCallback(() => {
    mouseXRef.current = null;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: "100%", height: `${height}px`, color: "inherit" }}
    />
  );
};

export { CanvasCurvedLoop };
export default CanvasCurvedLoop;
