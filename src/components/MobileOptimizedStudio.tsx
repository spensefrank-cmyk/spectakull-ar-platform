'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useARState } from '@/contexts/ARStateContext';
import { ARCameraPreview } from '@/components/ARCameraPreview';
import { MediaUploadPanel } from '@/components/MediaUploadPanel';
import { ARMarkerPanel } from '@/components/ARMarkerPanel';
import { TemplateLibrary } from '@/components/TemplateLibrary';
import { AnimationPanel } from '@/components/AnimationPanel';
import { OnboardingTour } from '@/components/OnboardingTour';
import { ARSandbox } from '@/components/ARSandbox';
import {
  Box, Settings, Palette, Lightbulb, Zap, Play, BarChart3, Bot, Users,
  QrCode, Share2, Download,
  Menu, X, HelpCircle, Sparkles, Crown, Info, Camera, Box as Cube
} from 'lucide-react';

interface MobileOptimizedStudioProps {
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

export function MobileOptimizedStudio({ selectedObjectId }: MobileOptimizedStudioProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>('objects');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showARMarkers, setShowARMarkers] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showAnimationPanel, setShowAnimationPanel] = useState(false);
  const [showOnboardingTour, setShowOnboardingTour] = useState(false);

  // AR State Management
  const {
    objects: sceneObjects,
    selectedObject: arSelectedObject,
    addObject: addARObject,
    updateObject: updateARObject,
    removeObject: removeARObject,
    selectObject: selectARObject,
    session: arSession,
    initializeARSession,
    setCurrentProject
  } = useARState();
  const [uploadedMedia, setUploadedMedia] = useState<Array<{
    id: string;
    name: string;
    type: 'image' | 'video' | 'audio' | '3d-model';
    url: string;
    size: number;
  }>>([
    // Demo media
    {
      id: 'demo-logo',
      name: 'spectakull_logo.png',
      type: 'image',
      url: '/spectakull_logo.png',
      size: 245760
    },
    {
      id: 'demo-bg',
      name: 'spectakull_background.jpg',
      type: 'image',
      url: '/spectakull_background_skull_image.jpg',
      size: 512000
    }
  ]);
  // Initialize AR session and add demo objects
  useEffect(() => {
    initializeARSession();
    setCurrentProject('studio');

    // Add demo objects if none exist
    if (sceneObjects.length === 0) {
      const demoCubeId = addARObject({
        type: 'cube',
        name: 'Welcome Cube',
        position: [0, 0.5, 0],
        rotation: [0, 45, 0],
        scale: [1, 1, 1],
        color: '#ff6b6b',
        metallic: 0.1,
        roughness: 0.3,
        visible: true
      });

      addARObject({
        type: 'sphere',
        name: 'Demo Sphere',
        position: [2, 0.5, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: '#4ecdc4',
        metallic: 0.8,
        roughness: 0.2,
        visible: true
      });
    }
  }, [initializeARSession, setCurrentProject, addARObject, sceneObjects.length]);
  const [viewMode, setViewMode] = useState<'sandbox' | 'camera'>('sandbox');

  const { isFeatureAvailable, currentTier, setShowUpgradeModal, projectCount, canCreateProject } = useSubscription();

  const currentTabConfig = tabConfig[activeTab];

  // Function to add new objects to the scene
  const addObject = (type: string) => {
    if (!canCreateProject()) {
      setShowUpgradeModal(true);
      return;
    }

    const objectId = addARObject({
      type: type.toLowerCase(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${sceneObjects.length + 1}`,
      position: [
        Math.random() * 4 - 2, // Random X position between -2 and 2
        Math.random() * 2,     // Random Y position between 0 and 2
        Math.random() * 4 - 2  // Random Z position between -2 and 2
      ] as [number, number, number],
      rotation: [0, Math.random() * 360, 0] as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
      metallic: Math.random() * 0.5,
      roughness: 0.3 + Math.random() * 0.4,
      visible: true
    });

    // Select the newly created object
    selectARObject(objectId);
  };

  const handleTabClick = (tab: StudioTab) => {
    if (tabConfig[tab].isPro && !isFeatureAvailable(tab as Parameters<typeof isFeatureAvailable>[0])) {
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

            {/* Object List */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center">
                Scene Objects
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowHelp(showHelp === 'objects' ? null : 'objects')}
                  className="ml-2 p-1"
                >
                  <Info className="w-4 h-4 text-blue-500" />
                </Button>
              </h4>

              {showHelp === 'objects' && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-blue-800 text-sm">{currentTabConfig.help}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">No objects in scene yet</p>
                <p className="text-gray-500 text-xs">Add objects using the buttons above</p>
              </div>
            </div>
          </div>
        );

      case 'properties':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Transform Properties</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowHelp(showHelp === 'properties' ? null : 'properties')}
                className="p-1"
              >
                <Info className="w-4 h-4 text-green-500" />
              </Button>
            </div>

            {showHelp === 'properties' && (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-green-800 text-sm">{currentTabConfig.help}</p>
              </div>
            )}

            {selectedObjectId ? (
              <div className="space-y-4">
                {/* Position */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Position</label>
                  {['X', 'Y', 'Z'].map((axis) => (
                    <div key={axis} className="flex items-center space-x-3">
                      <span className="w-4 text-xs text-gray-600">{axis}</span>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.1"
                        className="flex-1"
                      />
                      <span className="w-12 text-xs text-gray-600">0.0</span>
                    </div>
                  ))}
                </div>

                {/* Rotation */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Rotation</label>
                  {['X', 'Y', 'Z'].map((axis) => (
                    <div key={axis} className="flex items-center space-x-3">
                      <span className="w-4 text-xs text-gray-600">{axis}</span>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        className="flex-1"
                      />
                      <span className="w-12 text-xs text-gray-600">0°</span>
                    </div>
                  ))}
                </div>

                {/* Scale */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Scale</label>
                  <div className="flex items-center space-x-3">
                    <span className="w-4 text-xs text-gray-600">All</span>
                    <input
                      type="range"
                      min="0.1"
                      max="5"
                      step="0.1"
                      className="flex-1"
                    />
                    <span className="w-12 text-xs text-gray-600">1.0</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 text-sm">No object selected</p>
                <p className="text-gray-500 text-xs">Select an object to edit its properties</p>
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

            {tabConfig[activeTab].isPro && !isFeatureAvailable(activeTab as Parameters<typeof isFeatureAvailable>[0]) && (
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
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden">
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
          <Button size="sm" variant="ghost" className="p-1">
            <QrCode className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">AR Studio</h1>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Camera className="w-4 h-4 mr-2" />
              Live Preview
            </Button>
            <Button variant="outline" size="sm">
              <QrCode className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Teams
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            {Object.entries(tabConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleTabClick(key as StudioTab)}
                className={`w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-50 ${
                  activeTab === key ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <config.icon className={`w-5 h-5 text-${config.color}-500`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{config.title}</span>
                    {config.isPro && !isFeatureAvailable(key as Parameters<typeof isFeatureAvailable>[0]) && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{config.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {renderTabContent()}
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="bg-white w-80 h-full overflow-y-auto">
              {/* Tab Navigation */}
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
                        {config.isPro && !isFeatureAvailable(key as Parameters<typeof isFeatureAvailable>[0]) && (
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
        <div className="flex-1 flex flex-col lg:hidden">
          {/* Mobile Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <currentTabConfig.icon className={`w-5 h-5 text-${currentTabConfig.color}-500 mr-2`} />
                {currentTabConfig.title}
              </h2>
              <p className="text-gray-600 text-sm">{currentTabConfig.description}</p>
            </div>

            {renderTabContent()}
          </div>
        </div>

        {/* Desktop Main Area - AR WORKSPACE */}
        <div className="hidden lg:flex flex-1 flex-col bg-black">
          {/* Workspace Header with Tabs */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
            <div className="px-4 py-3">
              <h3 className="text-lg font-bold">🚀 AR Workspace</h3>
              <p className="text-sm opacity-90">Build and test your AR experiences</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-white/20">
              <button
                onClick={() => setViewMode('sandbox')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'sandbox'
                    ? 'bg-white/20 text-white border-b-2 border-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                🎯 AR Sandbox
              </button>
              <button
                onClick={() => setViewMode('camera')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'camera'
                    ? 'bg-white/20 text-white border-b-2 border-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                📱 Camera Preview
              </button>
            </div>
          </div>

          {/* Workspace Content */}
          <div className="flex-1 relative">
            {viewMode === 'sandbox' ? (
              <ARSandbox
                objects={sceneObjects}
                onObjectsChange={(newObjects) => {
                  // This function handles updates from ARSandbox
                  // The ARSandbox component should ideally be updated to use useARState directly
                  console.log('AR objects updated via ARSandbox:', newObjects);
                }}
                availableMedia={uploadedMedia}
                onMediaUpload={() => setShowMediaUpload(true)}
              />
            ) : (
              <ARCameraPreview objects={sceneObjects} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Actions */}
      <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-3">
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
      <div className="fixed top-4 right-4 z-40 lg:static lg:hidden">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          currentTier === 'free' ? 'bg-gray-100 text-gray-700' :
          currentTier === 'pro' ? 'bg-blue-100 text-blue-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Plan
        </div>
      </div>

      {/* ✨ NEW ADVANCED FEATURES PANELS ✨ */}

      {/* Media Upload Panel */}
      {showMediaUpload && (
        <MediaUploadPanel
          onMediaSelect={(media) => {
            // Add media to uploaded media list
            setUploadedMedia(prev => [...prev, {
              id: media.id,
              name: media.name,
              type: media.type,
              url: media.url,
              size: media.size
            }]);
            setShowMediaUpload(false);
          }}
          onClose={() => setShowMediaUpload(false)}
        />
      )}

      {/* AR Marker Types Panel */}
      {showARMarkers && (
        <ARMarkerPanel
          onMarkerSelect={(markerType, config) => {
            console.log('AR Marker selected:', markerType, config);
            setShowARMarkers(false);
          }}
          onClose={() => setShowARMarkers(false)}
        />
      )}

      {/* Template Library Panel */}
      {showTemplateLibrary && (
        <TemplateLibrary
          onTemplateSelect={(template) => {
            // Clear existing objects and add template objects
            sceneObjects.forEach(obj => removeARObject(obj.id));

            // Convert template objects to match our AR object interface
            template.objects.forEach(obj => {
              addARObject({
                type: obj.type,
                name: obj.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                position: obj.position,
                rotation: obj.rotation,
                scale: obj.scale,
                color: obj.color,
                metallic: obj.metallic,
                roughness: obj.roughness,
                visible: true,
                mediaUrl: (obj as any).mediaUrl,
                mediaType: (obj as any).mediaType
              });
            });

            setShowTemplateLibrary(false);
          }}
          onClose={() => setShowTemplateLibrary(false)}
        />
      )}

      {/* Animation Timeline Panel */}
      {showAnimationPanel && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">🎬 Animation Timeline</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnimationPanel(false)}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </div>
            <AnimationPanel />
          </div>
        </div>
      )}

      {/* 🚀 FLOATING ACTION BUTTONS FOR ALL NEW FEATURES */}
      <div className="fixed bottom-4 left-4 flex flex-col gap-2 z-40">
        <Button
          onClick={() => setShowTemplateLibrary(true)}
          className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
          title="Template Library"
        >
          📚 Templates
        </Button>
        <Button
          onClick={() => setShowMediaUpload(true)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
          title="Upload Media"
        >
          📁 Media
        </Button>
        <Button
          onClick={() => setShowARMarkers(true)}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
          title="AR Marker Types"
        >
          🎯 Markers
        </Button>
        <Button
          onClick={() => setShowAnimationPanel(true)}
          className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
          title="Animation Timeline"
        >
          🎬 Animate
        </Button>
        <Button
          onClick={() => setShowOnboardingTour(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
          title="Take Tour"
        >
          🎓 Take Tour
        </Button>
      </div>

      {/* ✨ FIXED ONBOARDING TOUR ✨ */}
      {showOnboardingTour && (
        <OnboardingTour onClose={() => setShowOnboardingTour(false)} />
      )}
    </div>
  );
}
