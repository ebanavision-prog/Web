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
  experimental: {
    // Server Actions default to a 1 MB body limit — real photos/videos from
    // the admin uploads (Services/Projects/Brands/Testimonials image fields)
    // routinely exceed that, so every upload was silently rejected with a
    // 413 before this.
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default withNextIntl(nextConfig);
