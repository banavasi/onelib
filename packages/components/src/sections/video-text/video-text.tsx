// Source: Sera UI (seraui.com)
"use client";
import type { ReactNode } from "react";
import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface VideoTextProps {
	src: string;
	className?: string;
	autoPlay?: boolean;
	muted?: boolean;
	loop?: boolean;
	preload?: "auto" | "metadata" | "none";
	children: ReactNode;
	fontSize?: string | number;
	fontWeight?: string | number;
	fontFamily?: string;
	letterSpacing?: string | number;
	lineHeight?: string | number;
	textAnchor?: "start" | "middle" | "end";
	dominantBaseline?: "auto" | "middle" | "central" | "hanging" | "text-top";
	x?: string | number;
	y?: string | number;
}

function VideoText({
	src,
	className,
	autoPlay = true,
	muted = true,
	loop = true,
	preload = "auto",
	children,
	fontSize = "clamp(3rem, 15vw, 12rem)",
	fontWeight = 900,
	fontFamily = "system-ui, -apple-system, sans-serif",
	letterSpacing = "-0.02em",
	lineHeight,
	textAnchor = "middle",
	dominantBaseline = "central",
	x = "50%",
	y = "50%",
}: VideoTextProps) {
	const clipId = useId();

	return (
		<div className={cn("relative w-full h-full overflow-hidden", className)}>
			<svg
				className="absolute inset-0 w-full h-full"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<clipPath id={clipId}>
						<text
							x={x}
							y={y}
							textAnchor={textAnchor}
							dominantBaseline={dominantBaseline}
							style={{
								fontSize,
								fontWeight,
								fontFamily,
								letterSpacing,
								lineHeight,
							}}
						>
							{children}
						</text>
					</clipPath>
				</defs>
			</svg>
			<video
				className="absolute inset-0 w-full h-full object-cover"
				style={{ clipPath: `url(#${clipId})` }}
				autoPlay={autoPlay}
				muted={muted}
				loop={loop}
				preload={preload}
				playsInline
			>
				<source src={src} type="video/mp4" />
			</video>
		</div>
	);
}

export { VideoText };
export default VideoText;
