/** @type {import('next').NextConfig} */
const nextConfig = {
  // Возвращаем статический экспорт для Firebase Hosting
  output: 'export',

  // Оставляем изображения неоптимизированными для совместимости
  images: {
    unoptimized: true,
  },

  // Все остальные ваши настройки (env, headers) могут оставаться, но
  // блок `rewrites` нужно удалить, так как он не работает со статическим сайтом.
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
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
                            "connect-src 'self' http://localhost:3000 https://firestore.googleapis.com https://firebase.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://accounts.google.com https://www.googleapis.com https://firebaseapp.com https://*.firebaseapp.com wss://*.firebaseapp.com https://firebasestorage.googleapis.com https://o4509439714328576.ingest.de.sentry.io https://content-firebaseappcheck.googleapis.com https://*.cloudfunctions.net https://generativelanguage.googleapis.com",
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