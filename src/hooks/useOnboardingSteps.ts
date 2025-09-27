'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import { useEffect } from 'react';

export function useOnboardingSteps() {
  const { completeStep, isStepCompleted } = useOnboarding();

  // Helper functions to complete specific steps
  const onboardingActions = {
    completeStudioOverview: () => completeStep('studio_overview'),
    completeAddObject: () => completeStep('add_object'),
    completeCustomizeObject: () => completeStep('customize_object'),
    completeApplyMaterial: () => completeStep('apply_material'),
    completeTestAR: () => completeStep('test_ar'),
    completeShareProject: () => completeStep('share_project')
  };

  // Auto-complete welcome when studio loads
  useEffect(() => {
    if (!isStepCompleted('welcome')) {
      completeStep('welcome');
    }
  }, [completeStep, isStepCompleted]);

  return {
    onboardingActions,
    isStepCompleted,
    completeStep
  };
}
