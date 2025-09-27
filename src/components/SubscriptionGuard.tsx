'use client';

import React from 'react';
import { useSubscription, SubscriptionFeatures } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Crown, Lock } from 'lucide-react';

interface SubscriptionGuardProps {
  feature: 'analytics' | 'teams' | 'publishing' | 'white-label' | 'pro-features';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  adminOverride?: boolean;
}

export function SubscriptionGuard({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  adminOverride = false
}: SubscriptionGuardProps) {
  const { isFeatureAvailable, currentTier } = useSubscription();

  // Check if user has access to the feature
  const hasAccess = adminOverride || isFeatureAvailable(feature as keyof SubscriptionFeatures);

  // If user has access, render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  if (showUpgradePrompt) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {getFeatureTitle(feature)} - Pro Feature
        </h3>

        <p className="text-gray-600 text-center mb-6 max-w-md">
          {getFeatureDescription(feature)}
        </p>

        <div className="flex space-x-3">
          <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
            <Link href="/subscription">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/contact">Learn More</Link>
          </Button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Current plan: {currentTier || 'Free'}
        </div>
      </div>
    );
  }

  // Minimal blocked access indicator
  return (
    <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
      <Lock className="w-5 h-5 text-gray-400 mr-2" />
      <span className="text-gray-600">Pro feature - Upgrade required</span>
    </div>
  );
}

function getFeatureTitle(feature: string): string {
  const titles = {
    'analytics': 'QR Analytics & Tracking',
    'teams': 'Team Collaboration',
    'publishing': 'AR Publishing',
    'white-label': 'White Label Branding',
    'pro-features': 'Advanced Features'
  };
  return titles[feature as keyof typeof titles] || 'Premium Feature';
}

function getFeatureDescription(feature: string): string {
  const descriptions = {
    'analytics': 'Track QR code scans, user engagement, and get detailed analytics for your AR experiences.',
    'teams': 'Collaborate with your team in real-time, share projects, and manage permissions.',
    'publishing': 'Publish your AR experiences and generate QR codes for sharing.',
    'white-label': 'Remove Spectakull branding and use your own custom branding.',
    'pro-features': 'Access advanced features like physics, animations, and face tracking.'
  };
  return descriptions[feature as keyof typeof descriptions] || 'Upgrade to access this premium feature.';
}
