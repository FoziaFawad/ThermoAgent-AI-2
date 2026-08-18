import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "react-map-gl",
    "@vis.gl/react-mapbox",
    "@deck.gl/react",
    "@deck.gl/layers",
    "@deck.gl/geo-layers",
    "deck.gl",
    "h3-js"
  ],
};

export default nextConfig;
