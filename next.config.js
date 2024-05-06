/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: "export",
  distDir: "dist",
};
module.exports = nextConfig;
module.exports = { nextConfig, images: { loader: "custom" } };
