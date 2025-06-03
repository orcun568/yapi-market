/** @type {import('next').NextConfig} */
    const nextConfig = {
    images: {
    remotePatterns: [
        {
        protocol: 'https',
        hostname: '**', // tüm dış kaynaklara izin verir — dikkatli olun
        },
    ],
    }
};

export default nextConfig;
