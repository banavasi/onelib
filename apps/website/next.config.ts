import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repository = process.env.GITHUB_REPOSITORY ?? "";
const repositoryName = repository.split("/")[1] ?? "";
const basePath = isGithubActions && repositoryName ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
	output: "export",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	basePath,
	assetPrefix: basePath || undefined,
};

export default nextConfig;
