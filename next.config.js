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
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com https://www.google.com https://accounts.google.com https://apis.googleusercontent.com https://firebaseapp.com https://*.firebaseapp.com https://www.googletagmanager.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: blob: https: http:",
                            "connect-src 'self' https://firestore.googleapis.com https://firebase.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://accounts.google.com https://www.googleapis.com https://firebaseapp.com https://*.firebaseapp.com wss://*.firebaseapp.com https://firebasestorage.googleapis.com https://o4509439714328576.ingest.de.sentry.io https://content-firebaseappcheck.googleapis.com https://*.cloudfunctions.net",
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

module.exports = nextConfig