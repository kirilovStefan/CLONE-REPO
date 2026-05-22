/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/CLONE-REPO",
  assetPrefix: "/CLONE-REPO/",
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;
