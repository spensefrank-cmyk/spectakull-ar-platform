'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Play } from 'lucide-react';

export function OnboardingDemo() {
  const { completeStep, isNewUser, completedSteps } = useOnboarding();

  // Only show in development or for testing
  if (!isNewUser || process.env.NODE_ENV === 'production') {
    return null;
  }

  const simulateOnboardingSteps = () => {
    const steps = ['welcome', 'studio_overview', 'add_object', 'customize_object', 'apply_material', 'test_ar', 'share_project'];

    steps.forEach((step, index) => {
      setTimeout(() => {
        completeStep(step);
      }, index * 1000);
    });
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onClick={simulateOnboardingSteps}
        size="sm"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Play className="w-4 h-4 mr-2" />
        Demo Onboarding ({completedSteps.length}/7)
      </Button>
    </div>
  );
}
