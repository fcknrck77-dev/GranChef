import type { NextConfig } from "next";

const target = process.env.NEXT_PUBLIC_DEPLOY_TARGET || "";
const isStaticExport = target === "static" || target === "landing";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {
      /* config options here */
    };

export default nextConfig;
