//

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig; // or 'export default nextConfig;' if using .mjs