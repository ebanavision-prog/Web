import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cms.ebanavision.com" }],
  },
  // Type errors are already gated by `tsc --noEmit` before every commit;
  // skipping the redundant re-check here avoids OOM kills during `next build`
  // on the memory-constrained production host.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
