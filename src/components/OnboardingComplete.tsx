'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Trophy, Star, Zap, Users, Share2 } from 'lucide-react';

export function OnboardingComplete() {
  const { completedSteps, markAsExperienced } = useOnboarding();
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Show celebration when all main steps are completed
    const requiredSteps = ['add_object', 'customize_object', 'test_ar'];
    const allCompleted = requiredSteps.every(step => completedSteps.includes(step));

    if (allCompleted && !showCelebration) {
      setTimeout(() => setShowCelebration(true), 1000);
    }
  }, [completedSteps, showCelebration]);

  if (!showCelebration) return null;

  const handleComplete = () => {
    setShowCelebration(false);
    markAsExperienced();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-md mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-xl">Congratulations!</h3>
          <p className="text-yellow-100 text-sm">You've mastered the basics!</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-700 mb-6 text-center leading-relaxed">
            You've successfully completed the AR Studio onboarding! You now know how to:
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Add and customize 3D objects</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Apply realistic materials</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Test with live AR preview</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Share your creations</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">What's Next?</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-cyan-600" />
                <span>Explore advanced materials and lighting</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Try real-time collaboration features</span>
              </div>
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-indigo-600" />
                <span>Check out our template library</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
          >
            Start Creating Amazing AR!
          </Button>
        </div>
      </div>
    </div>
  );
}
