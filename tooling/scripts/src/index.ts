// @onelib/scripts – update pipeline and project scripts
export const SCRIPTS_VERSION = "0.1.0";

export type { SkillsUpdateResult } from "./commands/skills-update.js";
export { buildSkillList, runSkillsUpdate } from "./commands/skills-update.js";
export type { UpdateResult } from "./commands/update.js";
export { runUpdate } from "./commands/update.js";
export { loadConfig } from "./utils/config.js";
export type { ExecResult } from "./utils/exec.js";
export { execCommand } from "./utils/exec.js";
