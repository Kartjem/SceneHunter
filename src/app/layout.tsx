import './globals.css';
import { ThemeProvider } from '@/hooks/use-theme';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/components/ui/toast';
import { ErrorBoundary, GlobalErrorHandler } from '@/components/ErrorBoundary';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'SceneHunter',
  description: 'Discover amazing filming locations around the world',
  keywords: ['filming locations', 'movies', 'travel', 'photography', 'scenes'],
  authors: [{ name: 'SceneHunter Team' }],
  creator: 'SceneHunter',
  publisher: 'SceneHunter',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3B82F6' },
    { media: '(prefers-color-scheme: dark)', color: '#60A5FA' }
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <GlobalErrorHandler>
            <ToastProvider>
              <QueryProvider>
                <AuthProvider>
                  <ThemeProvider>
                    {children}
                  </ThemeProvider>
                </AuthProvider>
              </QueryProvider>
            </ToastProvider>
          </GlobalErrorHandler>
        </ErrorBoundary>
      </body>
    </html>
  )
}
