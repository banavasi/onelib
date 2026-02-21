// This file mirrors the generated project's src/lib/utils.ts
// Components import from "@/lib/utils" which resolves in the generated project
// This copy exists only as a reference — it is NOT scaffolded (excluded from tsc)
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
