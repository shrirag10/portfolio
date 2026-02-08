/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable static export for Vercel deployment
    output: 'export',

    // Disable image optimization for static export
    images: {
        unoptimized: true,
    },

    // Trailing slash for cleaner URLs
    trailingSlash: true,

    // Transpile Three.js packages
    transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
}

export default nextConfig
