'use client';

import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { X, Lightbulb } from 'lucide-react';

interface OnboardingTooltipProps {
  componentId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export function OnboardingTooltip({
  componentId,
  title,
  description,
  position = 'bottom',
  children
}: OnboardingTooltipProps) {
  const { shouldShowTooltip, dismissTooltip } = useOnboarding();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (shouldShowTooltip(componentId)) {
      // Show tooltip after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [componentId, shouldShowTooltip]);

  const handleDismiss = () => {
    setIsVisible(false);
    dismissTooltip(componentId);
  };

  if (!isVisible) {
    return <>{children}</>;
  }

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  const arrowClasses = {
    top: 'top-full border-t-white border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full border-b-white border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full border-l-white border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full border-r-white border-t-transparent border-b-transparent border-l-transparent'
  };

  return (
    <div className="relative">
      {children}

      {/* Tooltip */}
      <div className={`absolute z-50 ${positionClasses[position]} left-1/2 transform -translate-x-1/2`}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 max-w-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <Lightbulb className="w-3 h-3 text-yellow-600" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
            </div>
            <button
              onClick={handleDismiss}
              className="w-5 h-5 text-gray-400 hover:text-gray-600 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Content */}
          <p className="text-gray-700 text-sm leading-relaxed">{description}</p>

          {/* Action */}
          <button
            onClick={handleDismiss}
            className="mt-3 text-xs text-cyan-600 hover:text-cyan-700 font-medium"
          >
            Got it, thanks!
          </button>
        </div>

        {/* Arrow */}
        <div
          className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          style={{
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
      </div>

      {/* Backdrop to capture clicks */}
      <div
        className="fixed inset-0 z-40"
        onClick={handleDismiss}
      />
    </div>
  );
}
