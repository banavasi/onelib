import { LAYOUT_PRESETS, THEME_PRESETS, type OnelibBlueprint } from "./types.js";

export function isLayoutPreset(value: string): value is (typeof LAYOUT_PRESETS)[number] {
	return (LAYOUT_PRESETS as readonly string[]).includes(value);
}

export function isThemePreset(value: string): value is (typeof THEME_PRESETS)[number] {
	return (THEME_PRESETS as readonly string[]).includes(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

export function validateBlueprint(input: unknown): OnelibBlueprint {
	if (!isObject(input)) {
		throw new Error("Blueprint must be a JSON object");
	}

	const name = input.name;
	if (typeof name !== "string" || name.trim().length === 0) {
		throw new Error("Blueprint 'name' must be a non-empty string");
	}

	const rootLayout = input.rootLayout;
	if (typeof rootLayout !== "string" || !isLayoutPreset(rootLayout)) {
		throw new Error(`Blueprint 'rootLayout' must be one of: ${LAYOUT_PRESETS.join(", ")}`);
	}

	const theme = input.theme;
	if (typeof theme !== "string" || !isThemePreset(theme)) {
		throw new Error(`Blueprint 'theme' must be one of: ${THEME_PRESETS.join(", ")}`);
	}

	const pages = input.pages;
	if (!Array.isArray(pages) || pages.length === 0) {
		throw new Error("Blueprint 'pages' must be a non-empty array");
	}

	const seenRoutes = new Set<string>();
	const parsedPages = pages.map((page, index) => {
		if (!isObject(page)) {
			throw new Error(`Page at index ${index} must be an object`);
		}

		const route = page.route;
		if (typeof route !== "string" || !route.startsWith("/")) {
			throw new Error(`Page ${index} has invalid route. Routes must start with '/'`);
		}

		if (seenRoutes.has(route)) {
			throw new Error(`Duplicate route found: ${route}`);
		}
		seenRoutes.add(route);

		const layout = page.layout;
		if (typeof layout !== "string" || !isLayoutPreset(layout)) {
			throw new Error(
				`Page ${index} has invalid layout. Allowed: ${LAYOUT_PRESETS.join(", ")}`,
			);
		}

		const components = page.components;
		if (!Array.isArray(components) || components.some((item) => typeof item !== "string")) {
			throw new Error(`Page ${index} must include a string array 'components'`);
		}

		const pageName = page.name;
		if (typeof pageName !== "string" || pageName.trim().length === 0) {
			throw new Error(`Page ${index} has invalid 'name'`);
		}

		const title = page.title;
		if (title !== undefined && typeof title !== "string") {
			throw new Error(`Page ${index} has invalid optional 'title'`);
		}

		return {
			name: pageName,
			route,
			layout,
			components,
			title,
		};
	});

	return {
		$schema: typeof input.$schema === "string" ? input.$schema : undefined,
		name,
		rootLayout,
		theme,
		pages: parsedPages,
	};
}
