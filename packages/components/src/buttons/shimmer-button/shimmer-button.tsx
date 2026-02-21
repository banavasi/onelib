// Source: Sera UI (seraui.com)
"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
	({ children, className, ...props }, ref) => {
		const customCss = `
    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    @keyframes shimmer-spin {
      to {
        --angle: 360deg;
      }
    }
  `;

		return (
			<div className="flex items-center justify-center font-sans">
				<style>{customCss}</style>
				<button
					ref={ref}
					className={cn(
						"relative inline-flex items-center justify-center p-[1.5px] bg-gray-300 dark:bg-black rounded-full overflow-hidden group",
						className,
					)}
					{...props}
				>
					<div
						className="absolute inset-0"
						style={{
							background:
								"conic-gradient(from var(--angle), transparent 25%, #06b6d4, transparent 50%)",
							animation: "shimmer-spin 2.5s linear infinite",
						}}
					/>
					<span className="relative z-10 inline-flex items-center justify-center w-full h-full px-8 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-900 rounded-full group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors duration-300">
						{children ?? "Shimmer Button"}
					</span>
				</button>
			</div>
		);
	},
);

ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
export default ShimmerButton;
