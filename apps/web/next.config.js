/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@ori6in/ui', '@ori6in/shared'],
  async redirects() {
    return [
      { source: '/programs', destination: '/programmes', permanent: true },
      { source: '/pricing', destination: '/contact?lead=quote', permanent: false },
      { source: '/tools/eligibility', destination: '/eligibility', permanent: true },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...(config.watchOptions ?? {}),
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
