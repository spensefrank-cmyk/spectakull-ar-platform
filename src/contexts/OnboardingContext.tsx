'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string; // Which component this step relates to
  completed: boolean;
  optional: boolean;
}

interface OnboardingContextType {
  isOnboardingActive: boolean;
  currentStep: number;
  steps: OnboardingStep[];
  completedSteps: string[];
  startOnboarding: () => void;
  completeStep: (stepId: string) => void;
  skipOnboarding: () => void;
  nextStep: () => void;
  previousStep: () => void;
  isStepCompleted: (stepId: string) => boolean;
  shouldShowTooltip: (componentId: string) => boolean;
  dismissTooltip: (componentId: string) => void;
  isNewUser: boolean;
  markAsExperienced: () => void;
}

const defaultSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Spectakull!',
    description: 'Let\'s create your first AR experience together. This quick tour will show you the basics.',
    component: 'welcome',
    completed: false,
    optional: false
  },
  {
    id: 'studio_overview',
    title: 'AR Studio Overview',
    description: 'This is your creative workspace. All the tools you need to build professional AR experiences.',
    component: 'studio',
    completed: false,
    optional: false
  },
  {
    id: 'add_object',
    title: 'Add Your First Object',
    description: 'Click the Objects tab and add a 3D object to your scene.',
    component: 'objects_tab',
    completed: false,
    optional: false
  },
  {
    id: 'customize_object',
    title: 'Customize Object Properties',
    description: 'Use the Properties tab to move, rotate, and scale your object.',
    component: 'properties_tab',
    completed: false,
    optional: false
  },
  {
    id: 'apply_material',
    title: 'Apply Materials',
    description: 'Make your object look realistic with PBR materials in the Materials tab.',
    component: 'materials_tab',
    completed: false,
    optional: true
  },
  {
    id: 'test_ar',
    title: 'Test Your AR Experience',
    description: 'Use the camera preview to see how your AR experience looks in the real world.',
    component: 'camera_preview',
    completed: false,
    optional: false
  },
  {
    id: 'share_project',
    title: 'Share Your Creation',
    description: 'Generate a QR code to share your AR experience with others.',
    component: 'qr_generation',
    completed: false,
    optional: true
  }
];

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>(defaultSteps);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isNewUser, setIsNewUser] = useState(true);
  const [dismissedTooltips, setDismissedTooltips] = useState<string[]>([]);

  useEffect(() => {
    // Load onboarding state from localStorage
    const savedState = localStorage.getItem('spectakull_onboarding');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setCompletedSteps(parsed.completedSteps || []);
        setIsNewUser(parsed.isNewUser !== false); // Default to true if not set
        setDismissedTooltips(parsed.dismissedTooltips || []);

        // Update steps with completion status
        setSteps(prevSteps =>
          prevSteps.map(step => ({
            ...step,
            completed: (parsed.completedSteps || []).includes(step.id)
          }))
        );
      } catch (error) {
        console.error('Error loading onboarding state:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save onboarding state to localStorage
    localStorage.setItem('spectakull_onboarding', JSON.stringify({
      completedSteps,
      isNewUser,
      dismissedTooltips
    }));
  }, [completedSteps, isNewUser, dismissedTooltips]);

  const startOnboarding = () => {
    setIsOnboardingActive(true);
    setCurrentStep(0);
  };

  const completeStep = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      const newCompletedSteps = [...completedSteps, stepId];
      setCompletedSteps(newCompletedSteps);

      // Update steps array
      setSteps(prevSteps =>
        prevSteps.map(step =>
          step.id === stepId ? { ...step, completed: true } : step
        )
      );
    }
  };

  const skipOnboarding = () => {
    setIsOnboardingActive(false);
    setIsNewUser(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOnboardingActive(false);
      setIsNewUser(false);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepCompleted = (stepId: string) => {
    return completedSteps.includes(stepId);
  };

  const shouldShowTooltip = (componentId: string) => {
    return isNewUser && !dismissedTooltips.includes(componentId) && !isOnboardingActive;
  };

  const dismissTooltip = (componentId: string) => {
    setDismissedTooltips(prev => [...prev, componentId]);
  };

  const markAsExperienced = () => {
    setIsNewUser(false);
  };

  return (
    <OnboardingContext.Provider value={{
      isOnboardingActive,
      currentStep,
      steps,
      completedSteps,
      startOnboarding,
      completeStep,
      skipOnboarding,
      nextStep,
      previousStep,
      isStepCompleted,
      shouldShowTooltip,
      dismissTooltip,
      isNewUser,
      markAsExperienced
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
