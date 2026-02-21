// Source: Sera UI (seraui.com)
"use client";
import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

const MailIcon = ({
	size = 12,
	className = "",
}: { size?: number; className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<rect width="20" height="16" x="2" y="4" rx="2" />
		<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
	</svg>
);

const BriefcaseIcon = ({
	size = 12,
	className = "",
}: { size?: number; className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
		<rect width="20" height="14" x="2" y="6" rx="2" />
	</svg>
);

const ChevronLeftIcon = ({
	size = 16,
	className = "",
}: { size?: number; className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="m15 18-6-6 6-6" />
	</svg>
);

const ChevronRightIcon = ({
	size = 16,
	className = "",
}: { size?: number; className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="m9 18 6-6-6-6" />
	</svg>
);

interface CarouselItem {
	id: number;
	title: string;
	subtitle: string;
	description: string;
	email: string;
	role: string;
	avatar: string;
	color: string;
}

const defaultItems: CarouselItem[] = [
	{
		id: 1,
		title: "Alex Chen",
		subtitle: "Senior Developer",
		description:
			"Full-stack engineer with expertise in React, Node.js, and cloud architecture. Passionate about building scalable applications.",
		email: "alex@example.com",
		role: "Engineering",
		avatar: "AC",
		color: "#6366F1",
	},
	{
		id: 2,
		title: "Sarah Kim",
		subtitle: "Product Designer",
		description:
			"UX/UI designer focused on creating intuitive and beautiful user experiences. Expert in Figma and design systems.",
		email: "sarah@example.com",
		role: "Design",
		avatar: "SK",
		color: "#EC4899",
	},
	{
		id: 3,
		title: "Marcus Johnson",
		subtitle: "DevOps Lead",
		description:
			"Infrastructure specialist managing CI/CD pipelines, Kubernetes clusters, and cloud deployments at scale.",
		email: "marcus@example.com",
		role: "Operations",
		avatar: "MJ",
		color: "#10B981",
	},
	{
		id: 4,
		title: "Emily Zhang",
		subtitle: "Data Scientist",
		description:
			"ML engineer working with large language models and data pipelines. Research background in NLP and computer vision.",
		email: "emily@example.com",
		role: "Data Science",
		avatar: "EZ",
		color: "#F59E0B",
	},
	{
		id: 5,
		title: "David Park",
		subtitle: "Tech Lead",
		description:
			"Engineering leader with 10+ years of experience building high-performance teams and distributed systems.",
		email: "david@example.com",
		role: "Engineering",
		avatar: "DP",
		color: "#8B5CF6",
	},
];

function OrbitCarousel() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [direction, setDirection] = useState(0);

	const next = useCallback(() => {
		setDirection(1);
		setActiveIndex((prev) => (prev + 1) % defaultItems.length);
	}, []);

	const prev = useCallback(() => {
		setDirection(-1);
		setActiveIndex(
			(prev) => (prev - 1 + defaultItems.length) % defaultItems.length,
		);
	}, []);

	const activeItem = defaultItems[activeIndex];

	const getOrbitPosition = (index: number) => {
		const total = defaultItems.length;
		const relativeIndex = ((index - activeIndex + total) % total) / total;
		const angle = relativeIndex * Math.PI * 2 - Math.PI / 2;
		const radiusX = 280;
		const radiusY = 120;
		const x = Math.cos(angle) * radiusX;
		const y = Math.sin(angle) * radiusY;
		const scale = 0.6 + 0.4 * ((Math.sin(angle) + 1) / 2);
		const zIndex = Math.round(scale * 10);
		const opacity = 0.3 + 0.7 * scale;

		return { x, y, scale, zIndex, opacity };
	};

	return (
		<div className="flex flex-col items-center gap-8 py-12 px-4 select-none">
			{/* Orbit visualization */}
			<div className="relative w-[600px] h-[300px]">
				{/* Orbit ring */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[240px] rounded-[50%] border border-white/5" />

				{/* Orbit items */}
				{defaultItems.map((item, index) => {
					const pos = getOrbitPosition(index);
					const isActive = index === activeIndex;

					return (
						<motion.button
							key={item.id}
							type="button"
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
							animate={{
								x: pos.x,
								y: pos.y,
								scale: isActive ? 1.2 : pos.scale,
								opacity: pos.opacity,
								zIndex: pos.zIndex,
							}}
							transition={{
								type: "spring",
								stiffness: 200,
								damping: 25,
							}}
							onClick={() => {
								setDirection(index > activeIndex ? 1 : -1);
								setActiveIndex(index);
							}}
						>
							<div
								className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition-shadow ${
									isActive ? "ring-2 ring-white/30 shadow-xl" : ""
								}`}
								style={{ backgroundColor: item.color }}
							>
								{item.avatar}
							</div>
						</motion.button>
					);
				})}
			</div>

			{/* Info card */}
			<div className="relative w-full max-w-md">
				<AnimatePresence mode="wait" custom={direction}>
					<motion.div
						key={activeItem.id}
						custom={direction}
						initial={{
							opacity: 0,
							x: direction > 0 ? 40 : -40,
						}}
						animate={{ opacity: 1, x: 0 }}
						exit={{
							opacity: 0,
							x: direction > 0 ? -40 : 40,
						}}
						transition={{ duration: 0.3 }}
						className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
					>
						<div className="flex items-start gap-4 mb-4">
							<div
								className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
								style={{
									backgroundColor: activeItem.color,
								}}
							>
								{activeItem.avatar}
							</div>
							<div className="min-w-0">
								<h3 className="text-lg font-semibold text-white truncate">
									{activeItem.title}
								</h3>
								<p className="text-sm text-gray-400">
									{activeItem.subtitle}
								</p>
							</div>
						</div>

						<p className="text-sm text-gray-300 mb-4 leading-relaxed">
							{activeItem.description}
						</p>

						<div className="flex items-center gap-4 text-xs text-gray-500">
							<span className="flex items-center gap-1">
								<MailIcon size={12} className="mr-1" />
								{activeItem.email}
							</span>
							<span className="flex items-center gap-1">
								<BriefcaseIcon size={12} className="mr-1" />
								{activeItem.role}
							</span>
						</div>
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Navigation */}
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={prev}
					className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors"
				>
					<ChevronLeftIcon size={16} />
				</button>

				<div className="flex items-center gap-2">
					{defaultItems.map((_, index) => (
						<button
							key={defaultItems[index].id}
							type="button"
							className={`w-2 h-2 rounded-full transition-all ${
								index === activeIndex
									? "bg-white w-6"
									: "bg-white/20 hover:bg-white/40"
							}`}
							onClick={() => {
								setDirection(index > activeIndex ? 1 : -1);
								setActiveIndex(index);
							}}
						/>
					))}
				</div>

				<button
					type="button"
					onClick={next}
					className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors"
				>
					<ChevronRightIcon size={16} />
				</button>
			</div>
		</div>
	);
}

export { OrbitCarousel };
export default OrbitCarousel;
