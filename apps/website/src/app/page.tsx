const packageRows = [
	["@banavasi/onelib", "Config API and shared types"],
	["@banavasi/registry", "Registry schemas and resolution utilities"],
	["@banavasi/skills", "Curated skills catalog"],
	["@banavasi/layouts", "Layout templates"],
	["@banavasi/components", "Component catalog and scaffolding"],
	["@banavasi/create-onelib", "Project scaffolding CLI"],
	["@banavasi/scripts", "Update pipeline CLI"],
];

export default function Home() {
	return (
		<main className="shell">
			<header className="card hero">
				<p className="eyebrow">Banavasi</p>
				<h1 className="title">Onelib Workspace</h1>
				<p className="subtitle">
					This app documents the active packages, workflows, and commands in the
					`@banavasi/onelib-monorepo`.
				</p>
				<div className="badges">
					<span className="badge teal">Next.js App Router</span>
					<span className="badge blue">React 19</span>
					<span className="badge slate">Turborepo + pnpm</span>
				</div>
			</header>

			<section className="card section">
				<h2 className="section-title">Core Packages</h2>
				<ul className="package-list">
					{packageRows.map(([name, description]) => (
						<li key={name} className="package-item">
							<p className="pkg-name">{name}</p>
							<p className="pkg-desc">{description}</p>
						</li>
					))}
				</ul>
			</section>

			<section className="card section">
				<h2 className="section-title">Quick Commands</h2>
				<pre className="terminal">
					{`pnpm install
pnpm build
pnpm test
pnpm --filter @banavasi/storybook dev`}
				</pre>
			</section>

			<section className="card section">
				<h2 className="section-title">CEO Demo Flow</h2>
				<p className="subtitle">
					Use the starter builder to create a blueprint JSON, then run one command in a generated
					project:
				</p>
				<pre className="terminal">{`pnpm onelib:blueprint:apply -- --file onelib.blueprint.json`}</pre>
				<p className="subtitle">
					Open <a href="/starter"><code>/starter</code></a> to generate blueprint JSON.
				</p>
			</section>
		</main>
	);
}
