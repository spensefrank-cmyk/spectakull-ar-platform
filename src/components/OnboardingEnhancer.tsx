'use client';

import React from 'react';
import { OnboardingTracker } from './OnboardingTracker';

interface OnboardingEnhancerProps {
  children: React.ReactNode;
  page?: 'studio' | 'home' | 'other';
}

export function OnboardingEnhancer({ children, page = 'other' }: OnboardingEnhancerProps) {
  return (
    <OnboardingTracker>
      {children}
    </OnboardingTracker>
  );
}
