import pc from "picocolors";

const PREFIX = pc.bold(pc.cyan("onelib"));

export function formatLog(message: string): string {
	return `${PREFIX}  ${message}`;
}

export function formatSuccess(message: string): string {
	return `  ${pc.green("✓")} ${message}`;
}

export function formatWarn(message: string): string {
	return `${PREFIX}  ${pc.yellow("⚠")} ${message}`;
}

export function formatError(message: string): string {
	return `  ${pc.red("✗")} ${message}`;
}

export function log(message: string): void {
	console.log(formatLog(message));
}

export function success(message: string): void {
	console.log(formatSuccess(message));
}

export function warn(message: string): void {
	console.log(formatWarn(message));
}

export function error(message: string): void {
	console.log(formatError(message));
}
