import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cms.ebanavision.com" }],
    // The optimizer fetches local /uploads images via a self-referencing
    // HTTP request before resizing them — the same internal self-fetch that's
    // unreliable on this Passenger host (see the Server Actions note below).
    // It fails intermittently ("received null" in logs), serving a broken
    // image icon for a random subset of admin-uploaded photos. Uploads are
    // already resized + re-encoded as webp server-side at upload time
    // (src/lib/upload.ts), so the extra optimization pass is redundant
    // anyway — serve the already-optimized files directly instead.
    unoptimized: true,
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
    // Next's standalone server normally splits request handling across
    // multiple internal workers (one per CPU) and forwards Server Actions
    // between them over a self-referencing HTTP request. On this cPanel/
    // Passenger host that self-fetch always fails, and unlike the
    // redirect-replay fetch this one has no fallback — the action silently
    // never runs, so every admin save/upload was being dropped. Forcing a
    // single worker removes the cross-worker forward entirely.
    //
    // This was briefly reverted on suspicion it was throttling public page
    // load under concurrent traffic — a side-by-side A/B test (10 concurrent
    // requests with cpus:1 vs without) showed near-identical latency either
    // way (5-8s both times), so that wasn't it. The real cause of the site
    // intermittently "not loading" was Passenger idling the app down between
    // requests and a cold start taking 10-15s+ — fixed separately with a
    // cron keep-alive ping every 5 minutes (crontab on the server, not part
    // of this repo). Keeping cpus:1, it's confirmed safe.
    cpus: 1,
  },
};

export default withNextIntl(nextConfig);
