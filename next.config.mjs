/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  async redirects() {
    return [
      { source: '/punjab-jobs', destination: '/punjab-job-portal', permanent: true },
      { source: '/sindh-jobs', destination: '/sindh-job-portal', permanent: true },
      { source: '/kpk-jobs', destination: '/kpk-job-portal', permanent: true },
      { source: '/balochistan-jobs', destination: '/balochistan-job-portal', permanent: true },
      { source: '/all-pakistan-jobs', destination: '/national-job-portal', permanent: true },
    ];
  },
};

export default nextConfig;
