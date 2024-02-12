/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "img.clerk.com"
            },
        ],
        domains: [
            "utfs.io"
        ]
    }
    
};

export default nextConfig;
