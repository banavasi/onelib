"use client";

import { useMemo, useState } from "react";
import type { CatalogComponent, LayoutOption, ThemeOption } from "@/lib/starter-types";

interface StarterBuilderProps {
	components: CatalogComponent[];
	layouts: LayoutOption[];
	themes: ThemeOption[];
}

interface ZipFile {
	name: string;
	content: string;
}

interface SupabaseEnv {
	url: string;
	anonKey: string;
	serviceRoleKey: string;
	databaseUrl: string;
	siteUrl: string;
	openAiApiKey: string;
	stripeSecretKey: string;
	stripeWebhookSecret: string;
	resendApiKey: string;
}

const PAGE_OPTIONS = [
	{ id: "home", label: "Home", route: "/" },
	{ id: "about", label: "About", route: "/about" },
	{ id: "pricing", label: "Pricing", route: "/pricing" },
	{ id: "features", label: "Features", route: "/features" },
	{ id: "contact", label: "Contact", route: "/contact" },
	{ id: "blog", label: "Blog", route: "/blog" },
	{ id: "docs", label: "Docs", route: "/docs" },
	{ id: "faq", label: "FAQ", route: "/faq" },
] as const;

const BUSINESS_TYPES = ["SaaS", "Agency", "Ecommerce", "Portfolio", "Community", "AI Product"] as const;
const PRIMARY_GOALS = [
	"Lead generation",
	"Product signups",
	"Sales conversion",
	"Content authority",
	"Investor demo",
	"Hiring and branding",
] as const;
const VOICE_OPTIONS = ["Bold", "Clean", "Playful", "Corporate", "Technical"] as const;
const REFINEMENT_MODES = ["balanced", "speed", "quality", "conversion"] as const;
const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;

function toTitle(value: string): string {
	return value
		.split("-")
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(" ");
}

function inferSuggestedComponents(components: CatalogComponent[], intent: string, businessType: string): string[] {
	const text = `${intent} ${businessType}`.toLowerCase();
	const scored = components.map((component) => {
		const haystack = `${component.name} ${component.displayName} ${component.description} ${component.category}`.toLowerCase();
		let score = 0;
		for (const token of text.split(/\s+/).filter(Boolean)) {
			if (token.length < 3) continue;
			if (haystack.includes(token)) score += 2;
		}
		if (component.category === "buttons") score += 1;
		if (component.category === "sections") score += 1;
		if (component.category === "hero" || component.name.includes("hero")) score += 2;
		return { component, score };
	});

	const ranked = scored
		.sort((a, b) => b.score - a.score || a.component.name.localeCompare(b.component.name))
		.filter((entry) => entry.score > 0)
		.slice(0, 16)
		.map((entry) => entry.component.name);

	if (ranked.length > 0) return ranked;
	return components.slice(0, 8).map((component) => component.name);
}

function withFallback<T>(items: T[], fallback: T[]): T[] {
	return items.length > 0 ? items : fallback;
}

function refineDirective(mode: (typeof REFINEMENT_MODES)[number]): string {
	switch (mode) {
		case "speed":
			return "Optimize for delivery speed. Prefer fewer abstractions and complete the MVP in one pass.";
		case "quality":
			return "Optimize for production quality. Prioritize accessibility, SEO depth, and polish over speed.";
		case "conversion":
			return "Optimize for conversion. Strengthen CTA hierarchy, proof sections, and objection-handling copy.";
		case "balanced":
		default:
			return "Balance speed and quality with pragmatic production defaults.";
	}
}

function createCrc32Table(): Uint32Array {
	const table = new Uint32Array(256);
	for (let i = 0; i < 256; i++) {
		let c = i;
		for (let j = 0; j < 8; j++) {
			c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		}
		table[i] = c >>> 0;
	}
	return table;
}

const CRC32_TABLE = createCrc32Table();

function crc32(data: Uint8Array): number {
	let crc = 0xffffffff;
	for (const byte of data) {
		crc = (CRC32_TABLE[(crc ^ byte) & 0xff] ?? 0) ^ (crc >>> 8);
	}
	return (crc ^ 0xffffffff) >>> 0;
}

function uint16(value: number): Uint8Array {
	return new Uint8Array([value & 0xff, (value >>> 8) & 0xff]);
}

function uint32(value: number): Uint8Array {
	return new Uint8Array([
		value & 0xff,
		(value >>> 8) & 0xff,
		(value >>> 16) & 0xff,
		(value >>> 24) & 0xff,
	]);
}

function concatBytes(chunks: Uint8Array[]): Uint8Array {
	const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
	const out = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		out.set(chunk, offset);
		offset += chunk.length;
	}
	return out;
}

function createZip(files: ZipFile[]): Uint8Array {
	const encoder = new TextEncoder();
	const localParts: Uint8Array[] = [];
	const centralParts: Uint8Array[] = [];
	let offset = 0;

	for (const file of files) {
		const nameBytes = encoder.encode(file.name);
		const dataBytes = encoder.encode(file.content);
		const checksum = crc32(dataBytes);
		const size = dataBytes.length;

		const localHeader = concatBytes([
			uint32(0x04034b50),
			uint16(20),
			uint16(0x0800),
			uint16(0),
			uint16(0),
			uint16(0),
			uint32(checksum),
			uint32(size),
			uint32(size),
			uint16(nameBytes.length),
			uint16(0),
			nameBytes,
		]);
		localParts.push(localHeader, dataBytes);

		const centralHeader = concatBytes([
			uint32(0x02014b50),
			uint16(20),
			uint16(20),
			uint16(0x0800),
			uint16(0),
			uint16(0),
			uint16(0),
			uint32(checksum),
			uint32(size),
			uint32(size),
			uint16(nameBytes.length),
			uint16(0),
			uint16(0),
			uint16(0),
			uint16(0),
			uint32(0),
			uint32(offset),
			nameBytes,
		]);
		centralParts.push(centralHeader);
		offset += localHeader.length + dataBytes.length;
	}

	const centralDirectory = concatBytes(centralParts);
	const localData = concatBytes(localParts);
	const eocd = concatBytes([
		uint32(0x06054b50),
		uint16(0),
		uint16(0),
		uint16(files.length),
		uint16(files.length),
		uint32(centralDirectory.length),
		uint32(localData.length),
		uint16(0),
	]);

	return concatBytes([localData, centralDirectory, eocd]);
}

function downloadZip(filename: string, files: ZipFile[]): void {
	const zipBytes = createZip(files);
	const copy = new Uint8Array(zipBytes.length);
	copy.set(zipBytes);
	const blob = new Blob([copy.buffer as ArrayBuffer], { type: "application/zip" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	URL.revokeObjectURL(url);
}

export function StarterBuilder({ components, layouts, themes }: StarterBuilderProps) {
	const [projectName, setProjectName] = useState("CEO Demo Platform");
	const [intent, setIntent] = useState(
		"Build a premium conversion-focused SaaS website with strong trust sections, sharp visual identity, and clear CTAs.",
	);
	const [businessType, setBusinessType] = useState<(typeof BUSINESS_TYPES)[number]>("SaaS");
	const [goal, setGoal] = useState<(typeof PRIMARY_GOALS)[number]>("Investor demo");
	const [voice, setVoice] = useState<(typeof VOICE_OPTIONS)[number]>("Bold");
	const [layout, setLayout] = useState(layouts.find((item) => item.id === "marketing")?.id ?? layouts[0]?.id ?? "marketing");
	const [theme, setTheme] = useState(themes.find((item) => item.id === "vibrant")?.id ?? themes[0]?.id ?? "default");
	const [pages, setPages] = useState<string[]>(["home", "features", "pricing", "about", "contact"]);
	const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
	const [refinement, setRefinement] = useState<(typeof REFINEMENT_MODES)[number]>("balanced");
	const [packageManager, setPackageManager] = useState<(typeof PACKAGE_MANAGERS)[number]>("pnpm");
	const [supabase, setSupabase] = useState<SupabaseEnv>({
		url: "",
		anonKey: "",
		serviceRoleKey: "",
		databaseUrl: "",
		siteUrl: "",
		openAiApiKey: "",
		stripeSecretKey: "",
		stripeWebhookSecret: "",
		resendApiKey: "",
	});
	const [copiedKey, setCopiedKey] = useState("");

	const componentsByCategory = useMemo(() => {
		const map = new Map<string, CatalogComponent[]>();
		for (const component of components) {
			const list = map.get(component.category) ?? [];
			list.push(component);
			map.set(component.category, list);
		}
		return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
	}, [components]);

	const suggestedComponents = useMemo(
		() => inferSuggestedComponents(components, intent, businessType),
		[components, intent, businessType],
	);

	const finalComponents = withFallback(selectedComponents, suggestedComponents);
	const finalPages = withFallback(
		pages.map((id) => PAGE_OPTIONS.find((page) => page.id === id)).filter((page) => Boolean(page)),
		[PAGE_OPTIONS[0]],
	);

	const pagePromptPack = useMemo(
		() =>
			finalPages
				.map((page, index) => {
					if (!page) return "";
					return `# Page ${index + 1}: ${page.label}\nRoute: ${page.route}\nLayout: ${layout}\nRequirements:\n- Match "${voice}" tone for a ${businessType} ${goal.toLowerCase()} site.\n- Include primary CTA and trust elements.\n- Use only selected Onelib components for this page.\n- Ensure responsive behavior and accessibility.\n`;
				})
				.join("\n"),
		[finalPages, layout, voice, businessType, goal],
	);

	const supabaseEnvFile = useMemo(() => {
		const value = (input: string, fallback: string) => (input.trim().length > 0 ? input.trim() : fallback);
		return `NEXT_PUBLIC_SUPABASE_URL=${value(supabase.url, "https://your-project-ref.supabase.co")}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${value(supabase.anonKey, "your-anon-key")}\nSUPABASE_SERVICE_ROLE_KEY=${value(supabase.serviceRoleKey, "your-service-role-key")}\nDATABASE_URL=${value(supabase.databaseUrl, "postgresql://postgres:postgres@127.0.0.1:5432/app")}\nNEXT_PUBLIC_SITE_URL=${value(supabase.siteUrl, "http://localhost:3000")}\nOPENAI_API_KEY=${value(supabase.openAiApiKey, "your-openai-api-key")}\nSTRIPE_SECRET_KEY=${value(supabase.stripeSecretKey, "your-stripe-secret-key")}\nSTRIPE_WEBHOOK_SECRET=${value(supabase.stripeWebhookSecret, "your-stripe-webhook-secret")}\nRESEND_API_KEY=${value(supabase.resendApiKey, "your-resend-api-key")}\n`;
	}, [supabase]);

	const supabaseSetupPrompt = useMemo(() => {
		return `# Supabase Setup Prompt\n\nSet up Supabase across the generated Next.js project with the following requirements:\n- Implement reusable helpers in lib/supabase for browser and server contexts.\n- Add auth flow scaffolding (sign in, sign out, session check middleware pattern).\n- Add an example protected dashboard route wired to Supabase session.\n- Add one starter table schema and CRUD service pattern.\n- Validate env vars from .env.local and fail fast on missing values.\n- Use these env keys:\n  - NEXT_PUBLIC_SUPABASE_URL\n  - NEXT_PUBLIC_SUPABASE_ANON_KEY\n  - SUPABASE_SERVICE_ROLE_KEY\n  - DATABASE_URL\n  - NEXT_PUBLIC_SITE_URL\n  - OPENAI_API_KEY\n  - STRIPE_SECRET_KEY\n  - STRIPE_WEBHOOK_SECRET\n  - RESEND_API_KEY`;
	}, []);

	const masterPrompt = useMemo(() => {
		const pageNames = finalPages.map((page) => page?.label).filter(Boolean).join(", ");
		const supabaseConfigured = Boolean(supabase.url && supabase.anonKey);
		return `You are a senior Next.js website builder agent.\n\nProject: ${projectName}\nIntent: ${intent}\nBusiness Type: ${businessType}\nPrimary Goal: ${goal}\nVoice: ${voice}\nTheme Preset: ${theme}\nPreferred Layout Family: ${layout}\nRefinement Mode: ${refinement}\nPages to generate: ${pageNames}\nSelected Onelib components: ${finalComponents.join(", ")}\n\nExecution contract:\n1) Generate or update pages in App Router with production-grade structure.\n2) Compose each page using selected Onelib components and meaningful real copy.\n3) Ensure visual hierarchy, spacing system, and consistent CTA patterns.\n4) Include SEO metadata, mobile-first responsiveness, and accessibility labels.\n5) Avoid placeholder lorem ipsum; produce business-ready content.\n6) ${refineDirective(refinement)}\n7) Return:\n   - file tree changes\n   - per-page summary\n   - commands to install missing dependencies\n   - any follow-up choices needed from user\n\nBackend contract:\n- Use Supabase for auth + data + storage.\n- Create production-safe server/client Supabase helpers.\n- Add route-level auth guard patterns for protected pages.\n- Include seed SQL and migration-ready schema notes.\n- Supabase env configured in pack: ${supabaseConfigured ? "yes" : "no (leave placeholders and request values)"}\n- Required env keys: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL, NEXT_PUBLIC_SITE_URL, OPENAI_API_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY`;
	}, [projectName, intent, businessType, goal, voice, theme, layout, refinement, finalPages, finalComponents, supabase.url, supabase.anonKey]);

	const skillsPack = useMemo(() => {
		return `# Onelib Agent Skills Pack\n\n## Builder Rules\n- Use Next.js App Router conventions.\n- Prefer server components unless client interactivity is required.\n- Keep each page conversion-focused with a clear CTA.\n- Use semantic HTML and WCAG-friendly structure.\n- Use selected layout "${layout}" and theme "${theme}" consistently.\n\n## Content Rules\n- Write outcome-focused copy for ${businessType} users.\n- Tone: ${voice}.\n- Business intent: ${intent}\n- Goal KPI: ${goal}.\n- Refinement: ${refineDirective(refinement)}\n\n## Component Rules\n- Primary component list:\n${finalComponents.map((name) => `- ${name}`).join("\n")}\n- If a component is missing dependencies, install and report them.\n- Do not include unselected novelty components unless explicitly justified.\n\n## Supabase Rules\n- Configure Supabase client (browser) and server client separately.\n- Use env-driven setup, never hardcode keys.\n- Add auth-ready table policies (RLS notes) for generated schema.\n- Use service role key only in server-side contexts.\n\n## Delivery Rules\n- Show changed files first.\n- Show run/install commands second.\n- Show optional refinements last.`;
	}, [layout, theme, businessType, voice, intent, goal, refinement, finalComponents]);

	const runCommandBlock = useMemo(() => {
		const installLine =
			packageManager === "npm"
				? "npm install"
				: packageManager === "yarn"
					? "yarn"
					: packageManager === "bun"
						? "bun install"
						: "pnpm install";
		const devLine = packageManager === "npm" ? "npm run dev" : `${packageManager} dev`;
		return `# Run In Client Repo\n\n1. Save generated files:\n   - onelib.plan.json\n   - onelib.prompt.md\n   - onelib.pages.prompt.md\n   - onelib.skills.md\n   - onelib.supabase.prompt.md\n   - .env.local\n\n2. Apply strict plan in one command:\n   - pnpm onelib:agent:apply -- --file onelib.plan.json\n\n3. Ask your agent for final polish:\n   \"Read onelib.prompt.md, onelib.pages.prompt.md, onelib.skills.md, onelib.supabase.prompt.md, and .env.local. Refine UI polish without changing architecture.\"\n\n4. Run locally:\n   - ${installLine}\n   - ${devLine}`;
	}, [packageManager]);

	const planJson = useMemo(
		() =>
			JSON.stringify(
				{
					$schema: "https://banavasi.dev/onelib/plan-v1",
					name: projectName,
					intent,
					rootLayout: layout,
					theme,
					pages: finalPages.map((page) => ({
						name: page?.label ?? "Page",
						route: page?.route ?? "/",
						layout,
						components: finalComponents,
						title: page?.label ?? "Page",
					})),
					integrations: {
						supabase: true,
						stripe: Boolean(supabase.stripeSecretKey || supabase.stripeWebhookSecret),
						resend: Boolean(supabase.resendApiKey),
						openai: Boolean(supabase.openAiApiKey),
					},
					skills: {
						capabilities: [
							"foundation",
							"nextjs",
							"conversion",
							"accessibility",
							"supabase",
							Boolean(supabase.stripeSecretKey || supabase.stripeWebhookSecret) ? "payments" : null,
							Boolean(supabase.resendApiKey) ? "email" : null,
							Boolean(supabase.openAiApiKey) ? "ai" : null,
						].filter(Boolean),
						additional: [],
						curated: true,
					},
					env: {
						NEXT_PUBLIC_SUPABASE_URL: supabase.url,
						NEXT_PUBLIC_SUPABASE_ANON_KEY: supabase.anonKey,
						SUPABASE_SERVICE_ROLE_KEY: supabase.serviceRoleKey,
						DATABASE_URL: supabase.databaseUrl,
						NEXT_PUBLIC_SITE_URL: supabase.siteUrl,
						OPENAI_API_KEY: supabase.openAiApiKey,
						STRIPE_SECRET_KEY: supabase.stripeSecretKey,
						STRIPE_WEBHOOK_SECRET: supabase.stripeWebhookSecret,
						RESEND_API_KEY: supabase.resendApiKey,
					},
				},
				null,
				2,
			),
		[
			projectName,
			intent,
			layout,
			theme,
			finalPages,
			finalComponents,
			supabase,
		],
	);

	function togglePage(pageId: string) {
		setPages((current) =>
			current.includes(pageId) ? current.filter((id) => id !== pageId) : [...current, pageId],
		);
	}

	function toggleComponent(componentId: string) {
		setSelectedComponents((current) =>
			current.includes(componentId)
				? current.filter((id) => id !== componentId)
				: [...current, componentId],
		);
	}

	async function copyText(value: string, key: string) {
		await navigator.clipboard.writeText(value);
		setCopiedKey(key);
		setTimeout(() => setCopiedKey(""), 1400);
	}

	function downloadPack() {
		downloadZip("onelib-agent-pack.zip", [
			{ name: "onelib.plan.json", content: planJson },
			{ name: "onelib.prompt.md", content: masterPrompt },
			{ name: "onelib.pages.prompt.md", content: pagePromptPack },
			{ name: "onelib.skills.md", content: skillsPack },
			{ name: "onelib.supabase.prompt.md", content: supabaseSetupPrompt },
			{ name: ".env.local", content: supabaseEnvFile },
			{ name: "onelib.run.md", content: runCommandBlock },
		]);
	}

	return (
		<div className="card section">
			<div className="page-toolbar">
				<h2 className="section-title">Guided AI Agent Setup</h2>
				<button type="button" onClick={downloadPack}>Download Pack</button>
			</div>
			<p className="subtitle">
				Describe the business outcome, pick options, and generate a prompt + skills pack that an AI
				agent can execute end-to-end.
			</p>

			<div className="builder-grid">
				<div className="builder-column">
					<p className="panel-title">1) Intent</p>
					<label className="field-label">Project Name</label>
					<input className="field-input" value={projectName} onChange={(e) => setProjectName(e.target.value)} />

					<label className="field-label">User Intent</label>
					<textarea className="field-input field-textarea" value={intent} onChange={(e) => setIntent(e.target.value)} />

					<div className="split-grid">
						<div>
							<label className="field-label">Business Type</label>
							<select className="field-input" value={businessType} onChange={(e) => setBusinessType(e.target.value as (typeof BUSINESS_TYPES)[number])}>
								{BUSINESS_TYPES.map((item) => (
									<option key={item} value={item}>{item}</option>
								))}
							</select>
						</div>
						<div>
							<label className="field-label">Primary Goal</label>
							<select className="field-input" value={goal} onChange={(e) => setGoal(e.target.value as (typeof PRIMARY_GOALS)[number])}>
								{PRIMARY_GOALS.map((item) => (
									<option key={item} value={item}>{item}</option>
								))}
							</select>
						</div>
					</div>

					<div className="split-grid">
						<div>
							<label className="field-label">Voice</label>
							<select className="field-input" value={voice} onChange={(e) => setVoice(e.target.value as (typeof VOICE_OPTIONS)[number])}>
								{VOICE_OPTIONS.map((item) => (
									<option key={item} value={item}>{item}</option>
								))}
							</select>
						</div>
						<div>
							<label className="field-label">Theme</label>
							<select className="field-input" value={theme} onChange={(e) => setTheme(e.target.value)}>
								{themes.map((item) => (
									<option key={item.id} value={item.id}>{item.label}</option>
								))}
							</select>
						</div>
					</div>

					<div className="split-grid">
						<div>
							<label className="field-label">Layout Family</label>
							<select className="field-input" value={layout} onChange={(e) => setLayout(e.target.value)}>
								{layouts.map((item) => (
									<option key={item.id} value={item.id}>{item.label}</option>
								))}
							</select>
						</div>
						<div>
							<label className="field-label">Refinement</label>
							<select className="field-input" value={refinement} onChange={(e) => setRefinement(e.target.value as (typeof REFINEMENT_MODES)[number])}>
								{REFINEMENT_MODES.map((item) => (
									<option key={item} value={item}>{toTitle(item)}</option>
								))}
							</select>
						</div>
					</div>

					<label className="field-label">Package Manager</label>
					<select className="field-input" value={packageManager} onChange={(e) => setPackageManager(e.target.value as (typeof PACKAGE_MANAGERS)[number])}>
						{PACKAGE_MANAGERS.map((item) => (
							<option key={item} value={item}>{item}</option>
						))}
					</select>

					<p className="panel-title section">Supabase .env.local</p>
					<label className="field-label">NEXT_PUBLIC_SUPABASE_URL</label>
					<input
						className="field-input"
						placeholder="https://your-project-ref.supabase.co"
						value={supabase.url}
						onChange={(e) => setSupabase((current) => ({ ...current, url: e.target.value }))}
					/>
					<label className="field-label">NEXT_PUBLIC_SUPABASE_ANON_KEY</label>
					<input
						className="field-input"
						placeholder="eyJhbGciOi..."
						value={supabase.anonKey}
						onChange={(e) => setSupabase((current) => ({ ...current, anonKey: e.target.value }))}
					/>
					<label className="field-label">SUPABASE_SERVICE_ROLE_KEY</label>
					<input
						className="field-input"
						placeholder="eyJhbGciOi..."
						value={supabase.serviceRoleKey}
						onChange={(e) => setSupabase((current) => ({ ...current, serviceRoleKey: e.target.value }))}
					/>
					<label className="field-label">DATABASE_URL</label>
					<input
						className="field-input"
						placeholder="postgresql://..."
						value={supabase.databaseUrl}
						onChange={(e) => setSupabase((current) => ({ ...current, databaseUrl: e.target.value }))}
					/>
					<label className="field-label">NEXT_PUBLIC_SITE_URL</label>
					<input
						className="field-input"
						placeholder="http://localhost:3000"
						value={supabase.siteUrl}
						onChange={(e) => setSupabase((current) => ({ ...current, siteUrl: e.target.value }))}
					/>
					<label className="field-label">OPENAI_API_KEY</label>
					<input
						className="field-input"
						placeholder="sk-..."
						value={supabase.openAiApiKey}
						onChange={(e) => setSupabase((current) => ({ ...current, openAiApiKey: e.target.value }))}
					/>
					<label className="field-label">STRIPE_SECRET_KEY</label>
					<input
						className="field-input"
						placeholder="sk_live_..."
						value={supabase.stripeSecretKey}
						onChange={(e) => setSupabase((current) => ({ ...current, stripeSecretKey: e.target.value }))}
					/>
					<label className="field-label">STRIPE_WEBHOOK_SECRET</label>
					<input
						className="field-input"
						placeholder="whsec_..."
						value={supabase.stripeWebhookSecret}
						onChange={(e) => setSupabase((current) => ({ ...current, stripeWebhookSecret: e.target.value }))}
					/>
					<label className="field-label">RESEND_API_KEY</label>
					<input
						className="field-input"
						placeholder="re_..."
						value={supabase.resendApiKey}
						onChange={(e) => setSupabase((current) => ({ ...current, resendApiKey: e.target.value }))}
					/>
				</div>

				<div className="builder-column">
					<p className="panel-title">2) Page Plan</p>
					<div className="chips">
						{PAGE_OPTIONS.map((page) => (
							<button key={page.id} type="button" className={pages.includes(page.id) ? "chip active" : "chip"} onClick={() => togglePage(page.id)}>
								{page.label}
							</button>
						))}
					</div>

					<p className="field-label">3) Components</p>
					<div className="page-toolbar">
						<strong className="helper">Select manually or use AI suggestions</strong>
						<button type="button" onClick={() => setSelectedComponents(suggestedComponents)}>Use Suggestions ({suggestedComponents.length})</button>
					</div>
					<div className="component-list">
						{componentsByCategory.map(([category, items]) => (
							<div key={category} className="component-group">
								<h3>{toTitle(category)}</h3>
								{items.map((item) => {
									const checked = finalComponents.includes(item.name);
									return (
										<label key={item.name} className="component-row">
											<input type="checkbox" checked={checked} onChange={() => toggleComponent(item.name)} />
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

			<div className="section output-grid">
				<div className="output-card">
					<div className="output-header">
						<strong>onelib.plan.json</strong>
						<button type="button" onClick={() => copyText(planJson, "plan")}>{copiedKey === "plan" ? "Copied" : "Copy"}</button>
					</div>
					<pre className="terminal">{planJson}</pre>
				</div>

				<div className="output-card">
					<div className="output-header">
						<strong>onelib.prompt.md</strong>
						<button type="button" onClick={() => copyText(masterPrompt, "prompt")}>{copiedKey === "prompt" ? "Copied" : "Copy"}</button>
					</div>
					<pre className="terminal">{masterPrompt}</pre>
				</div>

				<div className="output-card">
					<div className="output-header">
						<strong>onelib.pages.prompt.md</strong>
						<button type="button" onClick={() => copyText(pagePromptPack, "pages")}>{copiedKey === "pages" ? "Copied" : "Copy"}</button>
					</div>
					<pre className="terminal">{pagePromptPack}</pre>
				</div>

				<div className="output-card">
					<div className="output-header">
						<strong>onelib.skills.md</strong>
						<button type="button" onClick={() => copyText(skillsPack, "skills")}>{copiedKey === "skills" ? "Copied" : "Copy"}</button>
					</div>
					<pre className="terminal">{skillsPack}</pre>
				</div>

				<div className="output-card">
					<div className="output-header">
						<strong>onelib.supabase.prompt.md</strong>
						<button type="button" onClick={() => copyText(supabaseSetupPrompt, "supabase")}>{copiedKey === "supabase" ? "Copied" : "Copy"}</button>
					</div>
					<pre className="terminal">{supabaseSetupPrompt}</pre>
				</div>

				<div className="output-card">
					<div className="output-header">
						<strong>.env.local</strong>
						<button type="button" onClick={() => copyText(supabaseEnvFile, "env")}>{copiedKey === "env" ? "Copied" : "Copy"}</button>
					</div>
					<pre className="terminal">{supabaseEnvFile}</pre>
				</div>

				<div className="output-card">
					<div className="output-header">
						<strong>Run Helper</strong>
						<button type="button" onClick={() => copyText(runCommandBlock, "run")}>{copiedKey === "run" ? "Copied" : "Copy"}</button>
					</div>
					<pre className="terminal">{runCommandBlock}</pre>
				</div>
			</div>
		</div>
	);
}
