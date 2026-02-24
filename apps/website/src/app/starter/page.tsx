import { loadComponentCatalog } from "@/lib/components-catalog";
import { LAYOUT_OPTIONS, THEME_OPTIONS } from "@/lib/starter-catalog";
import { StarterBuilder } from "./starter-builder";

export default function StarterPage() {
	const components = loadComponentCatalog();

	return (
		<main className="shell">
			<header className="card hero">
				<p className="eyebrow">Agent Builder</p>
				<h1 className="title">Generate AI Prompt + Skills Pack</h1>
				<p className="subtitle">
					Turn intent into structured generation instructions. Pick options, review outputs, and copy
					the prompt pack into any client repo for full website generation.
				</p>
			</header>
			<StarterBuilder components={components} layouts={LAYOUT_OPTIONS} themes={THEME_OPTIONS} />
		</main>
	);
}
