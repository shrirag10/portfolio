/** @type {import('next').NextConfig} */
const nextConfig = {
    // Allow Next.js Image Optimization (Vercel handles this automatically)
    images: {
        unoptimized: false,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
        ],
    },

    // Transpile Three.js packages
    transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
}

export default nextConfig
