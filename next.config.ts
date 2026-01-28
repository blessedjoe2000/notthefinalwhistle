import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "4lel1dxsig.ufs.sh",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
