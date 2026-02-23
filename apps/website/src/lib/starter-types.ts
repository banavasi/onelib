export interface CatalogComponent {
	name: string;
	displayName: string;
	category: string;
	description: string;
}

export interface LayoutOption {
	id: string;
	label: string;
	description: string;
}

export interface ThemeOption {
	id: string;
	label: string;
	description: string;
}

export interface DraftPage {
	name: string;
	route: string;
	layout: string;
	components: string[];
	title: string;
}
