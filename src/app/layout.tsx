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
          type="module"
          src="https://cdn.jsdelivr.net/gh/germanalvarez15/KitCoreWebAR@v0.1.1/KitCoreWebAR-main.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <AuthProvider>
          <SubscriptionProvider>
            <OnboardingProvider>
              <AnalyticsProvider>
                <CollaborationProvider>
                  <ClientBody>{children}</ClientBody>
                </CollaborationProvider>
              </AnalyticsProvider>
            </OnboardingProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
