'use client';

import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingTooltip } from './OnboardingTooltip';

interface OnboardingTrackerProps {
  children: React.ReactNode;
}

export function OnboardingTracker({ children }: OnboardingTrackerProps) {
  const { isNewUser, completedSteps } = useOnboarding();

  // Only show onboarding help for new users
  if (!isNewUser) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      {/* Progress indicator for new users */}
      {completedSteps.length > 0 && completedSteps.length < 7 && (
        <div className="fixed top-4 right-4 z-40 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{completedSteps.length}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Onboarding Progress</p>
                <p className="text-xs text-gray-600">{completedSteps.length} of 7 steps completed</p>
              </div>
            </div>
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedSteps.length / 7) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
