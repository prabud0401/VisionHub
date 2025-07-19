
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://visionhub.pics';

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
        url: '/images/og-image.png',
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
    images: ['/images/og-image.png'],
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4363233136452065"
     crossOrigin="anonymous"></script>
      </head>
      <body className="font-body antialiased bg-background text-foreground">
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
