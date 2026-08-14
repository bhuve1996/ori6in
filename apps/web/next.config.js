/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@ori6in/ui', '@ori6in/shared'],
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid native FS watchers (EMFILE) which can drop App Router discovery.
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
