import './globals.css';
import { ThemeProvider } from '@/hooks/use-theme';

export const metadata = {
  title: 'SceneHunter V2',
  description: 'Discover amazing filming locations around the world',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
