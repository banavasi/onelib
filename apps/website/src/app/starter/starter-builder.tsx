"use client";

import { useMemo, useState } from "react";
import type { CatalogComponent, DraftPage, LayoutOption, ThemeOption } from "@/lib/starter-types";

interface StarterBuilderProps {
	components: CatalogComponent[];
	layouts: LayoutOption[];
	themes: ThemeOption[];
}

const DEFAULT_PAGE: DraftPage = {
	name: "Home",
	route: "/",
	layout: "marketing",
	components: [],
	title: "Home",
};

export function StarterBuilder({ components, layouts, themes }: StarterBuilderProps) {
	const [siteName, setSiteName] = useState("CEO Demo Site");
	const [rootLayout, setRootLayout] = useState(layouts[0]?.id ?? "blank");
	const [theme, setTheme] = useState(themes[0]?.id ?? "default");
	const [pages, setPages] = useState<DraftPage[]>([DEFAULT_PAGE]);
	const [selectedPage, setSelectedPage] = useState(0);
	const [copied, setCopied] = useState(false);

	const byCategory = useMemo(() => {
		const map = new Map<string, CatalogComponent[]>();
		for (const component of components) {
			const list = map.get(component.category) ?? [];
			list.push(component);
			map.set(component.category, list);
		}
		return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
	}, [components]);

	const blueprint = useMemo(
		() => ({
			$schema: "https://banavasi.dev/onelib/blueprint-v1",
			name: siteName,
			rootLayout,
			theme,
			pages: pages.map((page) => ({
				name: page.name,
				route: page.route,
				layout: page.layout,
				components: page.components,
				title: page.title,
			})),
		}),
		[siteName, rootLayout, theme, pages],
	);

	const blueprintJson = useMemo(() => JSON.stringify(blueprint, null, 2), [blueprint]);

	function updatePage(index: number, patch: Partial<DraftPage>) {
		setPages((current) => current.map((page, i) => (i === index ? { ...page, ...patch } : page)));
	}

	function toggleComponent(component: string) {
		setPages((current) =>
			current.map((page, index) => {
				if (index !== selectedPage) return page;
				const exists = page.components.includes(component);
				return {
					...page,
					components: exists
						? page.components.filter((item) => item !== component)
						: [...page.components, component],
				};
			}),
		);
	}

	async function copyBlueprint() {
		await navigator.clipboard.writeText(blueprintJson);
		setCopied(true);
		setTimeout(() => setCopied(false), 1200);
	}

	return (
		<div className="card section">
			<h2 className="section-title">Starter Blueprint Builder</h2>
			<p className="subtitle">
				Choose theme, layout, pages, and components. Copy JSON into
				 <code>onelib.blueprint.json</code> in your generated app and run
				 <code>pnpm onelib:blueprint:apply</code>.
			</p>

			<div className="builder-grid">
				<div className="builder-column">
					<label className="field-label">Site Name</label>
					<input
						className="field-input"
						value={siteName}
						onChange={(event) => setSiteName(event.target.value)}
					/>

					<label className="field-label">Root Layout</label>
					<select
						className="field-input"
						value={rootLayout}
						onChange={(event) => setRootLayout(event.target.value)}
					>
						{layouts.map((layout) => (
							<option key={layout.id} value={layout.id}>
								{layout.label}
							</option>
						))}
					</select>

					<label className="field-label">Theme</label>
					<select className="field-input" value={theme} onChange={(event) => setTheme(event.target.value)}>
						{themes.map((item) => (
							<option key={item.id} value={item.id}>
								{item.label}
							</option>
						))}
					</select>

					<div className="page-toolbar">
						<strong>Pages</strong>
						<button
							type="button"
							onClick={() => {
								setPages((current) => [
									...current,
									{ name: `Page ${current.length + 1}`, route: `/page-${current.length + 1}`, layout: rootLayout, components: [], title: `Page ${current.length + 1}` },
								]);
								setSelectedPage(pages.length);
							}}
						>
							+ Add
						</button>
					</div>

					<div className="chips">
						{pages.map((page, index) => (
							<button
								type="button"
								key={`${page.route}-${index}`}
								className={index === selectedPage ? "chip active" : "chip"}
								onClick={() => setSelectedPage(index)}
							>
								{page.name}
							</button>
						))}
					</div>

					{pages[selectedPage] ? (
						<>
							<label className="field-label">Page Name</label>
							<input
								className="field-input"
								value={pages[selectedPage].name}
								onChange={(event) => updatePage(selectedPage, { name: event.target.value })}
							/>

							<label className="field-label">Route</label>
							<input
								className="field-input"
								value={pages[selectedPage].route}
								onChange={(event) => updatePage(selectedPage, { route: event.target.value })}
							/>

							<label className="field-label">Page Layout</label>
							<select
								className="field-input"
								value={pages[selectedPage].layout}
								onChange={(event) => updatePage(selectedPage, { layout: event.target.value })}
							>
								{layouts.map((layout) => (
									<option key={layout.id} value={layout.id}>
										{layout.label}
									</option>
								))}
							</select>
						</>
					) : null}
				</div>

				<div className="builder-column">
					<strong>Components (registry IDs)</strong>
					<p className="subtitle">Select components for the active page.</p>
					<div className="component-list">
						{byCategory.map(([category, items]) => (
							<div key={category} className="component-group">
								<h3>{category}</h3>
								{items.map((item) => {
									const checked = pages[selectedPage]?.components.includes(item.name) ?? false;
									return (
										<label key={item.name} className="component-row">
											<input
												type="checkbox"
												checked={checked}
												onChange={() => toggleComponent(item.name)}
											/>
											<span>
												<strong>{item.displayName}</strong>
												<code>{item.name}</code>
											</span>
										</label>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="section">
				<div className="page-toolbar">
					<strong>Blueprint JSON</strong>
					<button type="button" onClick={copyBlueprint}>{copied ? "Copied" : "Copy JSON"}</button>
				</div>
				<pre className="terminal">{blueprintJson}</pre>
			</div>
		</div>
	);
}
