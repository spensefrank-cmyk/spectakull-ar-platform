import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { AuthProvider } from '@/contexts/AuthContext';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { ARStateProvider } from '@/contexts/ARStateContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spectakull - No-Code AR Creation Platform",
  description: "Create professional augmented reality experiences without coding. Revolutionary browser-based AR platform.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/webxr-polyfill@2/build/webxr-polyfill.min.js"
          strategy="beforeInteractive"
        />
        <Script id="webxr-polyfill-init" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined') {
              const polyfill = new WebXRPolyfill();
            }
          `}
        </Script>
      </head>
      <body suppressHydrationWarning className="antialiased">
        <AuthProvider>
          <SubscriptionProvider>
            <OnboardingProvider>
              <AnalyticsProvider>
                <CollaborationProvider>
                  <ARStateProvider>
                    <ClientBody>{children}</ClientBody>
                  </ARStateProvider>
                </CollaborationProvider>
              </AnalyticsProvider>
            </OnboardingProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
