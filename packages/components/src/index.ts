export const COMPONENTS_VERSION = "0.2.5";
export { computeChecksum } from "./checksum.js";
export type { ComponentRegistry, ValidationResult } from "./registry.js";
export { loadComponentRegistry, validateComponentRegistry } from "./registry.js";
export type { ComponentsLock, LockEntry, ScaffoldResult } from "./scaffold.js";
export { scaffoldComponents } from "./scaffold.js";
export type { UpdateOptions, UpdateReport } from "./updater.js";
export { updateComponents } from "./updater.js";
