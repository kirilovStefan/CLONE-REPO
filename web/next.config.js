/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isProd ? "/CLONE-REPO" : "",
  assetPrefix: isProd ? "/CLONE-REPO/" : "",
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;
