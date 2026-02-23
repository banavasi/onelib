import { loadComponentCatalog } from "@/lib/components-catalog";
import { LAYOUT_OPTIONS, THEME_OPTIONS } from "@/lib/starter-catalog";
import { StarterBuilder } from "./starter-builder";

export default function StarterPage() {
	const components = loadComponentCatalog();

	return (
		<main className="shell">
			<header className="card hero">
				<p className="eyebrow">Demo Builder</p>
				<h1 className="title">Compose Starter Blueprint</h1>
				<p className="subtitle">
					Pick layouts, themes, pages, and components. Generate a JSON blueprint and apply it in a
					 generated project with one command.
				</p>
			</header>
			<StarterBuilder components={components} layouts={LAYOUT_OPTIONS} themes={THEME_OPTIONS} />
		</main>
	);
}
