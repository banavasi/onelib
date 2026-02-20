import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
	"packages/create-onelib",
	"packages/onelib",
	"packages/registry",
	"packages/layouts",
	"packages/skills",
	"tooling/scripts",
]);
