"use client";

import { useEffect } from "react";
import { OnboardingTour } from '@/components/OnboardingTour';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { OnboardingDemo } from '@/components/OnboardingDemo';
import { SubscriptionUpgradeModal } from '@/components/SubscriptionUpgradeModal';

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <div className="antialiased">
      {children}
      <WelcomeScreen />
      <OnboardingTour />
      <OnboardingDemo />
      <SubscriptionUpgradeModal />
    </div>
  );
}
