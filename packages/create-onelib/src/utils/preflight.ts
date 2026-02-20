const MIN_NODE_VERSION = 20;

export function parseNodeVersion(versionString: string): number {
	const cleaned = versionString.replace(/^v/, "");
	const major = Number.parseInt(cleaned.split(".")[0] ?? "", 10);
	return major;
}

type PreflightResult = { ok: true } | { ok: false; message: string };

export function checkNodeVersion(majorVersion: number): PreflightResult {
	if (majorVersion >= MIN_NODE_VERSION) {
		return { ok: true };
	}
	return {
		ok: false,
		message: `Node.js >= ${MIN_NODE_VERSION} is required. You are running Node ${majorVersion}.`,
	};
}
