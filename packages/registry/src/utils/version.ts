export type BumpType = "patch" | "minor" | "major";

function parseSemver(version: string): [number, number, number] {
	const parts = version.split(".").map(Number);
	if (parts.length !== 3 || parts.some((p) => Number.isNaN(p))) {
		throw new Error(`Invalid semver: ${version}`);
	}
	return parts as [number, number, number];
}

export function compareVersions(a: string, b: string): -1 | 0 | 1 {
	const [aMajor, aMinor, aPatch] = parseSemver(a);
	const [bMajor, bMinor, bPatch] = parseSemver(b);

	if (aMajor !== bMajor) return aMajor > bMajor ? 1 : -1;
	if (aMinor !== bMinor) return aMinor > bMinor ? 1 : -1;
	if (aPatch !== bPatch) return aPatch > bPatch ? 1 : -1;
	return 0;
}

export function bumpVersion(version: string, type: BumpType): string {
	const [major, minor, patch] = parseSemver(version);

	switch (type) {
		case "major":
			return `${major + 1}.0.0`;
		case "minor":
			return `${major}.${minor + 1}.0`;
		case "patch":
			return `${major}.${minor}.${patch + 1}`;
	}
}
