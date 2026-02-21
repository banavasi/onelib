// Source: Sera UI (seraui.com)
"use client";
import React, { useRef, useState, useCallback } from "react";

export interface GalleryItem {
	id: number;
	src: string;
	alt: string;
}

export interface InfiniteDraggableGridProps {
	gallery?: GalleryItem[];
	columns?: number;
	itemWidth?: number;
	itemHeight?: number;
	gap?: number;
	className?: string;
}

const FALLBACK_GALLERY: GalleryItem[] = [
	{ id: 1, src: "https://picsum.photos/seed/grid1/400/300", alt: "Grid image 1" },
	{ id: 2, src: "https://picsum.photos/seed/grid2/400/300", alt: "Grid image 2" },
	{ id: 3, src: "https://picsum.photos/seed/grid3/400/300", alt: "Grid image 3" },
	{ id: 4, src: "https://picsum.photos/seed/grid4/400/300", alt: "Grid image 4" },
	{ id: 5, src: "https://picsum.photos/seed/grid5/400/300", alt: "Grid image 5" },
	{ id: 6, src: "https://picsum.photos/seed/grid6/400/300", alt: "Grid image 6" },
	{ id: 7, src: "https://picsum.photos/seed/grid7/400/300", alt: "Grid image 7" },
	{ id: 8, src: "https://picsum.photos/seed/grid8/400/300", alt: "Grid image 8" },
	{ id: 9, src: "https://picsum.photos/seed/grid9/400/300", alt: "Grid image 9" },
	{ id: 10, src: "https://picsum.photos/seed/grid10/400/300", alt: "Grid image 10" },
	{ id: 11, src: "https://picsum.photos/seed/grid11/400/300", alt: "Grid image 11" },
	{ id: 12, src: "https://picsum.photos/seed/grid12/400/300", alt: "Grid image 12" },
];

function InfiniteDraggableGrid({
	gallery = FALLBACK_GALLERY,
	columns = 4,
	itemWidth = 280,
	itemHeight = 200,
	gap = 16,
	className,
}: InfiniteDraggableGridProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const dragStart = useRef({ x: 0, y: 0 });
	const positionRef = useRef({ x: 0, y: 0 });

	const rows = Math.ceil(gallery.length / columns);
	const totalWidth = columns * (itemWidth + gap);
	const totalHeight = rows * (itemHeight + gap);

	const handlePointerDown = useCallback((e: React.PointerEvent) => {
		setIsDragging(true);
		dragStart.current = {
			x: e.clientX - positionRef.current.x,
			y: e.clientY - positionRef.current.y,
		};
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}, []);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (!isDragging) return;
			const newX = e.clientX - dragStart.current.x;
			const newY = e.clientY - dragStart.current.y;
			positionRef.current = { x: newX, y: newY };
			setPosition({ x: newX, y: newY });
		},
		[isDragging],
	);

	const handlePointerUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	const wrappedX = totalWidth > 0 ? ((position.x % totalWidth) + totalWidth) % totalWidth : 0;
	const wrappedY =
		totalHeight > 0 ? ((position.y % totalHeight) + totalHeight) % totalHeight : 0;

	const renderGrid = (offsetX: number, offsetY: number, keyPrefix: string) => (
		<div
			key={keyPrefix}
			className="absolute grid"
			style={{
				gridTemplateColumns: `repeat(${columns}, ${itemWidth}px)`,
				gap: `${gap}px`,
				left: `${offsetX}px`,
				top: `${offsetY}px`,
			}}
		>
			{gallery.map((item) => (
				<div
					key={`${keyPrefix}-${item.id}`}
					className="rounded-xl overflow-hidden bg-gray-800"
					style={{ width: itemWidth, height: itemHeight }}
				>
					<img
						src={item.src}
						alt={item.alt}
						className="w-full h-full object-cover pointer-events-none select-none"
						draggable={false}
					/>
				</div>
			))}
		</div>
	);

	const offsets = [
		[0, 0],
		[-totalWidth, 0],
		[totalWidth, 0],
		[0, -totalHeight],
		[0, totalHeight],
		[-totalWidth, -totalHeight],
		[totalWidth, -totalHeight],
		[-totalWidth, totalHeight],
		[totalWidth, totalHeight],
	];

	return (
		<div
			ref={containerRef}
			className={`relative w-full h-full overflow-hidden cursor-grab select-none ${isDragging ? "cursor-grabbing" : ""} ${className ?? ""}`}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerUp}
		>
			<div
				className="absolute"
				style={{
					transform: `translate(${wrappedX}px, ${wrappedY}px)`,
				}}
			>
				{offsets.map(([ox, oy], i) => renderGrid(ox, oy, `grid-${i}`))}
			</div>
		</div>
	);
}

export { InfiniteDraggableGrid, FALLBACK_GALLERY };
export default InfiniteDraggableGrid;
