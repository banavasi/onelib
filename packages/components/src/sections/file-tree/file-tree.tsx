// Source: Sera UI (seraui.com)
"use client";
import React, { useState } from "react";

export interface FileTreeItem {
	name: string;
	type: "folder" | "file";
	icon?: React.ComponentType;
	children?: FileTreeItem[];
}

const FileIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
		<path d="M14 2v4a2 2 0 0 0 2 2h4" />
	</svg>
);

const JsIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
	>
		<rect width="24" height="24" rx="4" fill="#F7DF1E" />
		<text x="6" y="18" fontSize="14" fontWeight="bold" fill="#000">
			JS
		</text>
	</svg>
);

const HtmlIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
	>
		<rect width="24" height="24" rx="4" fill="#E44D26" />
		<text x="2" y="17" fontSize="10" fontWeight="bold" fill="#fff">
			HTML
		</text>
	</svg>
);

const CssIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
	>
		<rect width="24" height="24" rx="4" fill="#1572B6" />
		<text x="3" y="17" fontSize="11" fontWeight="bold" fill="#fff">
			CSS
		</text>
	</svg>
);

const ReactIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
	>
		<rect width="24" height="24" rx="4" fill="#20232A" />
		<circle cx="12" cy="12" r="2" fill="#61DAFB" />
		<ellipse
			cx="12"
			cy="12"
			rx="10"
			ry="4"
			stroke="#61DAFB"
			strokeWidth="1"
			fill="none"
		/>
		<ellipse
			cx="12"
			cy="12"
			rx="10"
			ry="4"
			stroke="#61DAFB"
			strokeWidth="1"
			fill="none"
			transform="rotate(60 12 12)"
		/>
		<ellipse
			cx="12"
			cy="12"
			rx="10"
			ry="4"
			stroke="#61DAFB"
			strokeWidth="1"
			fill="none"
			transform="rotate(120 12 12)"
		/>
	</svg>
);

const FolderIcon = ({ isOpen }: { isOpen: boolean }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		{isOpen ? (
			<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
		) : (
			<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
		)}
	</svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
	>
		<path d="m9 18 6-6-6-6" />
	</svg>
);

function TreeIcon({ item }: { item: FileTreeItem }) {
	if (item.icon) {
		const Icon = item.icon;
		return <Icon />;
	}

	const ext = item.name.split(".").pop()?.toLowerCase();
	switch (ext) {
		case "js":
			return <JsIcon />;
		case "jsx":
			return <ReactIcon />;
		case "ts":
		case "tsx":
			return <ReactIcon />;
		case "html":
			return <HtmlIcon />;
		case "css":
			return <CssIcon />;
		default:
			return <FileIcon />;
	}
}

export function TreeNode({
	item,
	level = 0,
	selectedFile,
	onSelectFile,
}: {
	item: FileTreeItem;
	level?: number;
	selectedFile: string;
	onSelectFile: (name: string) => void;
}) {
	const [isOpen, setIsOpen] = useState(level < 1);

	if (item.type === "folder") {
		return (
			<div>
				<button
					type="button"
					className="flex items-center gap-1.5 w-full px-2 py-1 rounded-md hover:bg-white/5 text-gray-300 hover:text-white transition-colors text-sm"
					style={{ paddingLeft: `${level * 16 + 8}px` }}
					onClick={() => setIsOpen(!isOpen)}
				>
					<ChevronIcon isOpen={isOpen} />
					<FolderIcon isOpen={isOpen} />
					<span>{item.name}</span>
				</button>
				{isOpen && item.children && (
					<div>
						{item.children.map((child) => (
							<TreeNode
								key={child.name}
								item={child}
								level={level + 1}
								selectedFile={selectedFile}
								onSelectFile={onSelectFile}
							/>
						))}
					</div>
				)}
			</div>
		);
	}

	return (
		<button
			type="button"
			className={`flex items-center gap-1.5 w-full px-2 py-1 rounded-md text-sm transition-colors ${
				selectedFile === item.name
					? "bg-indigo-500/20 text-indigo-300"
					: "text-gray-400 hover:bg-white/5 hover:text-gray-200"
			}`}
			style={{ paddingLeft: `${level * 16 + 28}px` }}
			onClick={() => onSelectFile(item.name)}
		>
			<TreeIcon item={item} />
			<span>{item.name}</span>
		</button>
	);
}

const fileTreeData: FileTreeItem[] = [
	{
		name: "src",
		type: "folder",
		children: [
			{
				name: "components",
				type: "folder",
				children: [
					{ name: "App.jsx", type: "file" },
					{ name: "Header.tsx", type: "file" },
					{ name: "Footer.tsx", type: "file" },
				],
			},
			{
				name: "styles",
				type: "folder",
				children: [
					{ name: "global.css", type: "file" },
					{ name: "theme.css", type: "file" },
				],
			},
			{ name: "index.ts", type: "file" },
			{ name: "main.tsx", type: "file" },
		],
	},
	{
		name: "public",
		type: "folder",
		children: [
			{ name: "index.html", type: "file" },
			{ name: "favicon.ico", type: "file" },
		],
	},
	{ name: "package.json", type: "file" },
	{ name: "tsconfig.json", type: "file" },
];

function FileTree({ data = fileTreeData }: { data?: FileTreeItem[] }) {
	const [selectedFile, setSelectedFile] = useState("App.jsx");

	return (
		<div className="w-72 bg-gray-950 border border-white/10 rounded-xl p-3 font-mono">
			<div className="flex items-center gap-2 px-2 py-1.5 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
				</svg>
				Explorer
			</div>
			{data.map((item) => (
				<TreeNode
					key={item.name}
					item={item}
					selectedFile={selectedFile}
					onSelectFile={setSelectedFile}
				/>
			))}
		</div>
	);
}

export { FileTree, TreeNode };
export default FileTree;
