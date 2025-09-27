'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Play, Sparkles, Target, Palette, Camera, Share2, Box, Upload, Users } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: string;
  actionText: string;
  icon: any;
  tips: string[];
}

interface OnboardingTourProps {
  onClose?: () => void;
}

export function OnboardingTour({ onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Spectakull AR Studio!',
      description: 'Create professional AR experiences in minutes',
      content: 'Spectakull is the world\'s most advanced AR creation platform. Build interactive 3D scenes, track user engagement with QR Analytics, and collaborate with your team - all without coding!',
      actionText: 'Start Creating',
      icon: Sparkles,
      tips: [
        'Works on any device - mobile and desktop',
        'No AR experience needed',
        'Professional templates included',
        'Real-time 3D preview'
      ]
    },
    {
      id: 'objects',
      title: 'Add 3D Objects',
      description: 'Click the shape buttons to add objects to your scene',
      content: 'Start by adding 3D objects like cubes, spheres, and cylinders. Each object appears randomly in your 3D scene with unique colors and materials. You can add as many objects as you want!',
      actionText: 'Try Adding Objects',
      icon: Box,
      tips: [
        'Click Cube, Sphere, Cylinder to add objects',
        'Objects appear in the 3D preview on the right',
        'Each object gets random colors and placement',
        'Perfect for quick prototyping'
      ]
    },
    {
      id: 'templates',
      title: 'Professional Templates',
      description: 'Click "📚 Templates" button (bottom left) for pre-made scenes',
      content: 'Access our library of professional AR templates including Product Showcase, Art Gallery, Solar System, and more. Each template is designed by AR experts and ready to customize.',
      actionText: 'Explore Templates',
      icon: Target,
      tips: [
        'Click "📚 Templates" floating button',
        'Choose from 6+ professional scenes',
        'Templates include animations and materials',
        'Perfect starting point for any project'
      ]
    },
    {
      id: 'media',
      title: 'Upload & Apply Media',
      description: 'Complete workflow: Upload → Apply → See in AR',
      content: 'Upload your media, then use it in AR! After uploading, click the "Media" button in the sandbox to apply images to objects as textures, or create new media objects. Your uploaded content becomes part of your AR experience.',
      actionText: 'Try Media Workflow',
      icon: Upload,
      tips: [
        'Upload: Click "📁 Media" to upload files',
        'Apply: In sandbox, click "Media" button to apply to objects',
        'Create: Turn images into AR display objects',
        'Preview: See results in both sandbox and camera'
      ]
    },
    {
      id: 'markers',
      title: 'AR Marker Types',
      description: 'Click "🎯 Markers" to choose how users scan your AR',
      content: 'Choose how users will trigger your AR experience: QR codes for easy scanning, image targets for custom branding, or plane detection for markerless AR.',
      actionText: 'Select Markers',
      icon: Target,
      tips: [
        'Click "🎯 Markers" floating button',
        'QR Codes - fastest and most universal',
        'Image Targets - use your logo or artwork',
        'Plane Detection - no markers needed'
      ]
    },
    {
      id: 'animation',
      title: 'Animation Timeline',
      description: 'Click "🎬 Animate" to create smooth animations',
      content: 'Bring your AR to life with professional animations. Use our timeline editor to create keyframe animations with smooth transitions and easing curves.',
      actionText: 'Create Animations',
      icon: Play,
      tips: [
        'Click "🎬 Animate" floating button',
        'Timeline editor with keyframes',
        'Animate position, rotation, scale',
        'Professional easing curves included'
      ]
    },
    {
      id: 'sandbox',
      title: 'AR Sandbox Workspace',
      description: 'Interactive 3D workspace to build your AR scenes',
      content: 'The AR Sandbox is your main workspace! Click and drag objects, adjust properties in real-time, and see your AR experience come to life. Upload media and apply it to objects to create rich AR experiences.',
      actionText: 'Explore Sandbox',
      icon: Target,
      tips: [
        'Click objects in 3D space to select them',
        'Drag with mouse to rotate camera view',
        'Use property panel to fine-tune objects',
        'Upload and apply media to objects'
      ]
    },
    {
      id: 'camera',
      title: 'Camera Preview Mode',
      description: 'Test your AR in the real world through your camera',
      content: 'Switch to Camera Preview mode to see exactly how your AR will look through users\' cameras. This gives you the true AR experience with objects overlaid on your camera feed.',
      actionText: 'Try Camera Mode',
      icon: Camera,
      tips: [
        'Real camera feed with AR overlay',
        'See objects in your actual environment',
        'Switch between front/back camera',
        'Test the actual user experience'
      ]
    },
    {
      id: 'analytics',
      title: 'QR Analytics Dashboard',
      description: 'Click "📊 QR Analytics" button (top right) to track engagement',
      content: 'Our revolutionary QR Analytics system tracks every scan, user location, device type, and engagement metrics. See exactly how your AR performs in the real world.',
      actionText: 'View Analytics',
      icon: Target,
      tips: [
        'Track QR code scans in real-time',
        'See user locations and device types',
        'Engagement metrics and session data',
        'Export data for reports'
      ]
    },
    {
      id: 'teams',
      title: 'Team Collaboration',
      description: 'Click "👥 Teams" button to collaborate with your team',
      content: 'Work together in real-time! Invite team members, see live cursors, chat, and even video call while building AR experiences together.',
      actionText: 'Join Teams',
      icon: Users,
      tips: [
        'Contact your team admin for access',
        'Real-time collaboration features',
        'Live cursors and shared editing',
        'Video calling built-in'
      ]
    },
    {
      id: 'complete',
      title: 'You\'re Ready to Create!',
      description: 'Start building amazing AR experiences',
      content: 'You now know all the essential features of Spectakull AR Studio. Create, collaborate, track, and share professional AR experiences that engage your audience.',
      actionText: 'Start Creating',
      icon: Sparkles,
      tips: [
        'All features are now unlocked',
        'Professional AR templates ready',
        'Real-time collaboration available',
        'Revolutionary analytics tracking'
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleSkip = () => {
    setCurrentStep(steps.length - 1);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <IconComponent className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">{currentStepData.title}</h2>
                <p className="text-sm opacity-90">{currentStepData.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {currentStepData.content}
            </p>

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
              <ul className="space-y-1">
                {currentStepData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-sm text-blue-800">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}

              {currentStep < steps.length - 2 && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-500"
                >
                  Skip Tour
                </Button>
              )}
            </div>

            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Creating!
                </>
              ) : (
                <>
                  {currentStepData.actionText}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
