/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    typescript: {
        // Allows production builds to successfully complete even if the template has type errors
        ignoreBuildErrors: true,
    },
    eslint: {
        // Disables ESLint blocking builds during deployment
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;