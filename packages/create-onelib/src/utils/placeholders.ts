export interface PlaceholderValues {
	projectName: string;
}

export function replacePlaceholders(content: string, values: PlaceholderValues): string {
	return content.replaceAll("{{PROJECT_NAME}}", values.projectName);
}
