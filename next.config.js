/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	basePath:
		process.env.NODE_ENV === "production" ? "/mcp-learning-platform" : "",
	images: {
		unoptimized: true,
	},
	trailingSlash: true,
	eslint: {
		dirs: ["src"],
	},
};

export default nextConfig;
