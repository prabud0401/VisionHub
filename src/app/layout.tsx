
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';
import type { Metadata } from 'next'

const siteUrl = process.env.NODE_ENV === 'production' 
  ? 'https://visionhub.pics' 
  : 'http://localhost:9002';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'VisionHub | AI Image & Video Generation',
  description: 'The ultimate AI toolkit for creators. Generate stunning images, videos, and more from text prompts with our suite of advanced generative AI models.',
  openGraph: {
    title: 'VisionHub | AI Image & Video Generation',
    description: 'Turn your imagination into reality. Create, edit, and upscale with the power of AI.',
    url: siteUrl,
    siteName: 'VisionHub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI generated artwork showing a vibrant, abstract visual',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VisionHub | AI Image & Video Generation',
    description: 'The ultimate AI toolkit for creators. Generate stunning images, videos, and more from text prompts.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4363233136452065" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4363233136452065"
     crossOrigin="anonymous"></script>
        {/* Ensure consistent styling across environments */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Force dark mode consistency */
            html { color-scheme: dark; }
            
            /* Ensure proper font loading */
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            /* Prevent FOUC (Flash of Unstyled Content) */
            .dark { color-scheme: dark; }
            
            /* Ensure proper backdrop blur support */
            @supports (backdrop-filter: blur(10px)) {
              .backdrop-blur-glass {
                backdrop-filter: blur(12px) saturate(180%);
                background-color: rgba(255, 255, 255, 0.1);
              }
            }
          `
        }} />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
          <AuthProvider>
            {children}
            <AuthModal />
            <Toaster />
            <CookieConsentBanner />
          </AuthProvider>
      </body>
    </html>
  );
}
