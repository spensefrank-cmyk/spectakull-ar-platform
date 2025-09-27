'use client';

import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Play, BookOpen, Zap, Users, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function WelcomeScreen() {
  const { isNewUser, startOnboarding, markAsExperienced } = useOnboarding();
  const router = useRouter();

  if (!isNewUser) return null;

  const handleStartTour = () => {
    // Navigate to studio first, then start onboarding
    router.push('/studio');
    setTimeout(() => {
      startOnboarding();
    }, 500);
  };

  const handleSkipTour = () => {
    markAsExperienced();
  };

  const handleQuickStart = () => {
    // Create a sample project and navigate to studio
    const sampleProject = {
      id: `sample_${Date.now()}`,
      name: 'My First AR Experience',
      description: 'A sample AR project to get you started',
      createdAt: new Date().toISOString(),
      objects: [
        {
          id: 'sample_cube',
          type: 'cube',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
          material: {
            color: '#4F46E5',
            metallic: 0.1,
            roughness: 0.3,
            emission: '#000000'
          }
        }
      ]
    };

    // Save sample project
    const projects = JSON.parse(localStorage.getItem('spectakull_projects') || '[]');
    projects.push(sampleProject);
    localStorage.setItem('spectakull_projects', JSON.stringify(projects));

    markAsExperienced();
    router.push('/studio');
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
              <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4">
              Welcome to Spectakull!
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              The world's most advanced no-code AR creation platform.
              Build professional AR experiences in minutes, not months.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12 px-4">
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-3 lg:mb-4">
                <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No-Code Creation</h3>
              <p className="text-gray-600 text-sm">
                Drag, drop, and create. No programming skills required.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 lg:mb-4">
                <Play className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Preview</h3>
              <p className="text-gray-600 text-sm">
                See your AR creations in real-time with live camera preview.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 lg:mb-4">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Sharing</h3>
              <p className="text-gray-600 text-sm">
                Share your AR experiences instantly with QR codes.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 mx-4">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6 text-center">
              How would you like to get started?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Guided Tour */}
              <div className="text-center">
                <Button
                  onClick={handleStartTour}
                  className="w-full mb-3 lg:mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white h-12 lg:h-14"
                  size="lg"
                >
                  <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Take the Tour
                </Button>
                <p className="text-xs lg:text-sm text-gray-600">
                  <strong>Recommended:</strong> 5-minute guided walkthrough in the AR Studio
                </p>
              </div>

              {/* Quick Start */}
              <div className="text-center">
                <Button
                  onClick={handleQuickStart}
                  variant="outline"
                  className="w-full mb-3 lg:mb-4 h-12 lg:h-14"
                  size="lg"
                >
                  <Zap className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Quick Start
                </Button>
                <p className="text-xs lg:text-sm text-gray-600">
                  Jump right into the studio with a pre-built sample project
                </p>
              </div>

              {/* Skip */}
              <div className="text-center">
                <Button
                  onClick={handleSkipTour}
                  variant="ghost"
                  className="w-full mb-3 lg:mb-4 h-12 lg:h-14"
                  size="lg"
                >
                  <Play className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Explore Freely
                </Button>
                <p className="text-xs lg:text-sm text-gray-600">
                  Start from scratch and discover features as you go
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 lg:mt-12 text-center px-4">
            <div className="grid grid-cols-3 gap-4 lg:gap-8 max-w-md mx-auto">
              <div>
                <div className="text-lg lg:text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-xs lg:text-sm text-gray-600">AR Experiences</div>
              </div>
              <div>
                <div className="text-lg lg:text-2xl font-bold text-gray-900">5K+</div>
                <div className="text-xs lg:text-sm text-gray-600">Active Creators</div>
              </div>
              <div>
                <div className="text-lg lg:text-2xl font-bold text-gray-900">99%</div>
                <div className="text-xs lg:text-sm text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
