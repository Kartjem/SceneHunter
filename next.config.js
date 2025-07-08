/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable standalone output for Docker optimization
    output: 'standalone',

    // Optimize images for production
    images: {
        domains: ['firebasestorage.googleapis.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
            },
        ],
    },

    // Environment variables validation
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
    
    // VVV THIS IS THE NEW BLOCK YOU NEED TO ADD VVV
    // It tells the Next.js development server to forward API requests to your backend
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'http://localhost:3001/api/:path*', // Proxy to Backend
          },
        ];
    },
    // ^^^ END OF THE NEW BLOCK ^^^

    // Security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            // Allow connections to your backend API in development
                            "connect-src 'self' http://localhost:3000 https://firestore.googleapis.com https://firebase.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://accounts.google.com https://www.googleapis.com https://firebaseapp.com https://*.firebaseapp.com wss://*.firebaseapp.com https://firebasestorage.googleapis.com https://o4509439714328576.ingest.de.sentry.io https://content-firebaseappcheck.googleapis.com https://*.cloudfunctions.net",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com https://www.google.com https://accounts.google.com https://apis.googleusercontent.com https://firebaseapp.com https://*.firebaseapp.com https://www.googletagmanager.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: blob: https: http:",
                            "frame-src 'self' https://accounts.google.com https://www.google.com https://firebaseapp.com https://*.firebaseapp.com https://www.youtube.com https://youtube.com",
                            "object-src 'none'",
                            "base-uri 'self'",
                            "form-action 'self'"
                        ].join('; ')
                    }
                ]
            }
        ]
    }
}

module.exports = nextConfig;