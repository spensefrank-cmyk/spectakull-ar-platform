'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  Menu, X, Info, Crown, Users, Camera,
  QrCode, Share2, Play, Box, Settings, Palette,
  Lightbulb, Zap, BarChart3, Bot
} from 'lucide-react';

interface MobileStudioFixedProps {
  selectedObjectId?: string;
}

type StudioTab = 'objects' | 'properties' | 'materials' | 'lighting' | 'physics' | 'animation' | 'analytics' | 'ai' | 'collaboration';

const tabConfig = {
  objects: {
    icon: Box,
    title: 'Objects',
    description: 'Add and manage 3D objects in your AR scene',
    help: 'Click any shape to add it to your scene. Select objects to edit their properties.',
    color: 'blue',
    isPro: false
  },
  properties: {
    icon: Settings,
    title: 'Properties',
    description: 'Adjust position, rotation, and scale of selected objects',
    help: 'Use sliders to move, rotate, and resize objects. Changes apply in real-time.',
    color: 'green',
    isPro: false
  },
  materials: {
    icon: Palette,
    title: 'Materials',
    description: 'Apply realistic PBR materials and colors',
    help: 'Make objects look metallic, glass, wood, or any material with our PBR system.',
    color: 'purple',
    isPro: false
  },
  lighting: {
    icon: Lightbulb,
    title: 'Lighting',
    description: 'Control scene lighting and environment',
    help: 'Adjust ambient lighting, shadows, and environment to set the perfect mood.',
    color: 'yellow',
    isPro: false
  },
  physics: {
    icon: Zap,
    title: 'Physics',
    description: 'Add realistic physics simulation',
    help: 'Enable gravity, collisions, and physics materials for interactive experiences.',
    color: 'orange',
    isPro: true
  },
  animation: {
    icon: Play,
    title: 'Animation',
    description: 'Create smooth animations with keyframes',
    help: 'Add keyframes to animate position, rotation, and scale over time.',
    color: 'pink',
    isPro: true
  },
  analytics: {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track performance and user engagement',
    help: 'See views, user interactions, and geographic data for your AR experiences.',
    color: 'indigo',
    isPro: true
  },
  ai: {
    icon: Bot,
    title: 'AI Assistant',
    description: 'Get smart suggestions and help',
    help: 'Ask our AI for material suggestions, layout tips, and performance optimizations.',
    color: 'emerald',
    isPro: true
  },
  collaboration: {
    icon: Users,
    title: 'Teams',
    description: 'Real-time team collaboration',
    help: 'Work together with your team in real-time with live cursors and chat.',
    color: 'red',
    isPro: true
  }
};

export function MobileStudioFixed({ selectedObjectId }: MobileStudioFixedProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>('objects');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showHelp, setShowHelp] = useState<string | null>(null);

  const { isFeatureAvailable, currentTier, setShowUpgradeModal, projectCount, canCreateProject } = useSubscription();

  const currentTabConfig = tabConfig[activeTab];

  const handleTabClick = (tab: StudioTab) => {
    if (tabConfig[tab].isPro && !isFeatureAvailable('qrCodeGeneration')) {
      setShowUpgradeModal(true);
      return;
    }
    setActiveTab(tab);
    setShowMobileMenu(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'objects':
        return (
          <div className="space-y-4">
            {/* Project Status */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 text-sm font-medium">Projects: {projectCount}/5</span>
                {!canCreateProject() && (
                  <Button size="sm" onClick={() => setShowUpgradeModal(true)} className="bg-blue-600 text-white">
                    Upgrade
                  </Button>
                )}
              </div>
            </div>

            {/* Add Objects */}
            <div className="grid grid-cols-2 gap-3">
              {['Cube', 'Sphere', 'Cylinder', 'Plane', 'Text', 'Light'].map((shape) => (
                <Button
                  key={shape}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center space-y-1 bg-white hover:bg-blue-50 border-blue-200"
                  disabled={!canCreateProject()}
                >
                  <div className="text-xl">{shape === 'Cube' ? '⬛' : shape === 'Sphere' ? '🔵' : shape === 'Cylinder' ? '🟦' : shape === 'Plane' ? '⬜' : shape === 'Text' ? '📝' : '💡'}</div>
                  <span className="text-xs">{shape}</span>
                </Button>
              ))}
            </div>

            {/* Help */}
            {showHelp === 'objects' && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-blue-800 text-sm">{currentTabConfig.help}</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <currentTabConfig.icon className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">{currentTabConfig.title}</h4>
            <p className="text-gray-600 text-sm mb-4">{currentTabConfig.description}</p>

            {tabConfig[activeTab].isPro && !isFeatureAvailable('qrCodeGeneration') && (
              <Button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-1"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <h1 className="font-bold text-lg">AR Studio</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" className="p-1">
            <Camera className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="p-1"
            onClick={() => {
              if (!isFeatureAvailable('qrCodeGeneration')) {
                setShowUpgradeModal(true);
              }
            }}
          >
            <QrCode className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white w-80 h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Studio Tools</h2>
              {Object.entries(tabConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleTabClick(key as StudioTab)}
                  className={`w-full px-3 py-2 text-left flex items-center space-x-3 rounded-lg mb-2 ${
                    activeTab === key ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <config.icon className={`w-5 h-5 text-${config.color}-500`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{config.title}</span>
                      {config.isPro && !isFeatureAvailable('qrCodeGeneration') && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <currentTabConfig.icon className={`w-5 h-5 text-${currentTabConfig.color}-500 mr-2`} />
            {currentTabConfig.title}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowHelp(showHelp === activeTab ? null : activeTab)}
              className="ml-2 p-1"
            >
              <Info className="w-4 h-4 text-blue-500" />
            </Button>
          </h2>
          <p className="text-gray-600 text-sm">{currentTabConfig.description}</p>
        </div>

        {renderTabContent()}
      </div>

      {/* Mobile Bottom Actions */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>Preview</span>
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center space-x-2"
            onClick={() => {
              if (!isFeatureAvailable('qrCodeGeneration')) {
                setShowUpgradeModal(true);
              }
            }}
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      {/* Subscription Tier Indicator */}
      <div className="fixed top-4 right-4 z-40">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          currentTier === 'free' ? 'bg-gray-100 text-gray-700' :
          currentTier === 'pro' ? 'bg-blue-100 text-blue-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Plan
        </div>
      </div>
    </div>
  );
}
