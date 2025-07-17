
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>VisionHub</title>
        <meta name="description" content="Generate stunning visuals with the power of AI" />
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
