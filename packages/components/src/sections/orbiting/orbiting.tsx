// Source: Sera UI (seraui.com)
"use client";
import React from "react";

const techIcons = {
	react: (
		<svg viewBox="0 0 24 24" className="w-6 h-6" fill="#61DAFB">
			<circle cx="12" cy="12" r="2.139" />
			<path
				fill="none"
				stroke="#61DAFB"
				strokeWidth="1"
				d="M12 6.042A17.95 17.95 0 0 1 17.5 5c1.5 0 2.7.3 3.2.8s.5 1.3.1 2.4A17.95 17.95 0 0 1 18 12a17.95 17.95 0 0 1 2.8 3.8c.4 1.1.4 1.9-.1 2.4s-1.7.8-3.2.8A17.95 17.95 0 0 1 12 18a17.95 17.95 0 0 1-5.5 1c-1.5 0-2.7-.3-3.2-.8s-.5-1.3-.1-2.4A17.95 17.95 0 0 1 6 12a17.95 17.95 0 0 1-2.8-3.8c-.4-1.1-.4-1.9.1-2.4S5 5 6.5 5A17.95 17.95 0 0 1 12 6.042Z"
			/>
		</svg>
	),
	typescript: (
		<svg viewBox="0 0 24 24" className="w-6 h-6" fill="#3178C6">
			<rect width="24" height="24" rx="4" />
			<text x="4" y="18" fontSize="12" fontWeight="bold" fill="#fff">
				TS
			</text>
		</svg>
	),
	node: (
		<svg viewBox="0 0 24 24" className="w-6 h-6" fill="#339933">
			<path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2L18.8 7.8v8.4L12 19.8 5.2 16.2V7.8L12 4.2z" />
			<text x="7" y="16" fontSize="8" fontWeight="bold" fill="#fff">
				N
			</text>
		</svg>
	),
	tailwind: (
		<svg viewBox="0 0 24 24" className="w-6 h-6" fill="#06B6D4">
			<path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C13.3 10.74 14.42 12 17 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.7 7.26 14.58 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.3 16.74 9.42 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.7 13.26 9.58 12 7 12z" />
		</svg>
	),
	nextjs: (
		<svg viewBox="0 0 24 24" className="w-6 h-6">
			<circle cx="12" cy="12" r="11" fill="#000" stroke="#fff" strokeWidth="1" />
			<text x="6" y="16" fontSize="9" fontWeight="bold" fill="#fff">
				N
			</text>
		</svg>
	),
	git: (
		<svg viewBox="0 0 24 24" className="w-6 h-6" fill="#F05032">
			<path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.66 2.66a1.838 1.838 0 1 1-1.103 1.06l-2.48-2.48v6.53a1.838 1.838 0 1 1-1.513-.036V8.73a1.838 1.838 0 0 1-.998-2.41L7.617 3.576.454 10.74a1.55 1.55 0 0 0 0 2.188l10.48 10.477a1.55 1.55 0 0 0 2.186 0l10.426-10.43a1.55 1.55 0 0 0 0-2.045z" />
		</svg>
	),
};

interface OrbitItem {
	icon: React.ReactNode;
	label: string;
}

const innerOrbit: OrbitItem[] = [
	{ icon: techIcons.react, label: "React" },
	{ icon: techIcons.typescript, label: "TypeScript" },
	{ icon: techIcons.tailwind, label: "Tailwind" },
];

const outerOrbit: OrbitItem[] = [
	{ icon: techIcons.node, label: "Node.js" },
	{ icon: techIcons.nextjs, label: "Next.js" },
	{ icon: techIcons.git, label: "Git" },
];

function OrbitingSkills() {
	return (
		<div className="relative w-[400px] h-[400px]">
			{/* Center element */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
				<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
					<svg
						viewBox="0 0 24 24"
						className="w-8 h-8"
						fill="none"
						stroke="#fff"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="16 18 22 12 16 6" />
						<polyline points="8 6 2 12 8 18" />
					</svg>
				</div>
			</div>

			{/* Inner orbit ring */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-white/10" />

			{/* Inner orbit items */}
			<div
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px]"
				style={{ animation: "orbit-spin 20s linear infinite" }}
			>
				{innerOrbit.map((item, i) => {
					const angle = (360 / innerOrbit.length) * i;
					return (
						<div
							key={item.label}
							className="absolute top-1/2 left-1/2"
							style={{
								transform: `rotate(${angle}deg) translateX(100px) rotate(-${angle}deg)`,
								marginLeft: "-20px",
								marginTop: "-20px",
								animation: "orbit-counter-spin 20s linear infinite",
							}}
						>
							<div className="w-10 h-10 rounded-xl bg-gray-800/80 border border-white/10 flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform">
								{item.icon}
							</div>
						</div>
					);
				})}
			</div>

			{/* Outer orbit ring */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-white/5" />

			{/* Outer orbit items */}
			<div
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px]"
				style={{ animation: "orbit-spin 30s linear infinite reverse" }}
			>
				{outerOrbit.map((item, i) => {
					const angle = (360 / outerOrbit.length) * i;
					return (
						<div
							key={item.label}
							className="absolute top-1/2 left-1/2"
							style={{
								transform: `rotate(${angle}deg) translateX(170px) rotate(-${angle}deg)`,
								marginLeft: "-20px",
								marginTop: "-20px",
								animation: "orbit-spin 30s linear infinite",
							}}
						>
							<div className="w-10 h-10 rounded-xl bg-gray-800/80 border border-white/10 flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform">
								{item.icon}
							</div>
						</div>
					);
				})}
			</div>

			{/* Keyframes */}
			<style>{`
				@keyframes orbit-spin {
					from { transform: translate(-50%, -50%) rotate(0deg); }
					to { transform: translate(-50%, -50%) rotate(360deg); }
				}
				@keyframes orbit-counter-spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(-360deg); }
				}
			`}</style>
		</div>
	);
}

export { OrbitingSkills };
export default OrbitingSkills;
