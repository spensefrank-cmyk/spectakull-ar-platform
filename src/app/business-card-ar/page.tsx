'use client';

import React, { useState } from 'react';
import { QRCodeCreator } from '@/components/QRCodeCreator';
import { SubscriptionGuard } from '@/components/SubscriptionGuard';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// TypeScript declarations for KitCore WebAR using ES2015 module syntax
interface KitCoreWebARElement extends HTMLElement {
  mode?: string;
  'auto-button'?: string;
  onLoad?: () => void;
}

interface KitCoreWebARObjectElement extends HTMLElement {
  src?: string;
  position?: string;
  rotation?: string;
  scale?: string;
  animation?: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'kitcore-webar': KitCoreWebARElement;
    'kitcore-webar-object': KitCoreWebARObjectElement;
  }
}

// 3D Object options with model URLs
const objects3D = [
  {
    id: 'cube',
    name: 'Lantern',
    emoji: '📦',
    src: 'https://threejs.org/examples/models/gltf/Lantern/glTF/Lantern.gltf',
    premium: false
  },
  {
    id: 'sphere',
    name: 'Chair',
    emoji: '🌐',
    src: 'https://threejs.org/examples/models/gltf/Sheen/glTF/SheenChair.gltf',
    premium: true
  },
  {
    id: 'pyramid',
    name: 'BoomBox',
    emoji: '🔺',
    src: 'https://threejs.org/examples/models/gltf/BoomBox/glTF/BoomBox.gltf',
    premium: true
  },
  {
    id: 'helmet',
    name: 'Helmet',
    emoji: '🎲',
    src: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    premium: false
  }
];

// User media library types
interface UserMedia {
  id: string;
  name: string;
  type: 'image' | 'video' | '3d-model';
  url: string;
  thumbnail?: string;
  uploadedAt: string;
  size: number;
}

// AR Object Configuration
interface ARObjectConfig {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  animation?: 'rotate' | 'bounce' | 'pulse' | 'none';
  material?: {
    color?: string;
    metalness?: number;
    roughness?: number;
    emissive?: string;
  };
}

// Analytics Event Types
interface AnalyticsEvent {
  id: string;
  type: 'ar_start' | 'ar_interaction' | 'qr_generate' | 'model_change' | 'position_adjust' | 'share_action';
  timestamp: string;
  data: Record<string, any>;
  sessionId: string;
  userId?: string;
}

// TypeScript declarations for KitCore WebAR
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'kitcore-webar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        mode?: string;
        'auto-button'?: string;
        onLoad?: () => void;
      };
      'kitcore-webar-object': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        position?: string;
        rotation?: string;
        scale?: string;
        animation?: string;
      };
    }
  }
}

export default function BusinessCardARPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showQRCreator, setShowQRCreator] = useState(false);
  const [selectedObject, setSelectedObject] = useState<any>(objects3D[3]); // Default to helmet
  const [showLibrary, setShowLibrary] = useState(false);
  const [userLibrary, setUserLibrary] = useState<UserMedia[]>([]);
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<UserMedia | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Advanced AR Editing State
  const [arConfig, setArConfig] = useState<ARObjectConfig>({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    animation: 'none'
  });
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);
  const [previewMode, setPreviewMode] = useState<'floor' | 'wall' | 'image'>('floor');
  const [isARActive, setIsARActive] = useState(false);

  // Analytics State
  const [sessionId] = useState(() => Date.now().toString());
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sessionStartTime] = useState(Date.now());

  // Admin access state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const { currentTier, isFeatureAvailable } = useSubscription();
  const { user, logout } = useAuth();

  // Check if user has access to business card creator (including admin access)
  const hasBusinessCardAccess = isAdminAuthenticated || currentTier === 'business-card' || currentTier === 'pro' || currentTier === 'enterprise' || currentTier === 'white-label';

  // Admin authentication function
  const handleAdminLogin = () => {
    if (adminPassword === 'specktacull2024!') {
      setIsAdminAuthenticated(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      trackEvent('ar_interaction', { action: 'admin_access_granted' });
    } else {
      alert('Invalid admin password');
      setAdminPassword('');
    }
  };

  // Analytics Functions
  const trackEvent = (type: AnalyticsEvent['type'], data: Record<string, any> = {}) => {
    const event: AnalyticsEvent = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      timestamp: new Date().toISOString(),
      data: {
        ...data,
        currentTier,
        hasUploadedImage: !!uploadedImage,
        selectedObjectName: selectedObject?.name,
        librarySize: userLibrary.length
      },
      sessionId,
      userId: user?.id
    };

    setAnalyticsEvents(prev => [...prev, event]);

    // Also log to console for debugging
    console.log('📊 Analytics Event:', event);
  };

  // Advanced AR Configuration Functions
  const updateARConfig = (updates: Partial<ARObjectConfig>) => {
    const newConfig = { ...arConfig, ...updates };
    setArConfig(newConfig);
    trackEvent('position_adjust', { config: newConfig });

    // Update the AR preview in real-time
    updateARPreview(newConfig);
  };

  const updateARPreview = (config: ARObjectConfig) => {
    // Update KitCore WebAR element properties
    const webArObject = document.querySelector('kitcore-webar-object');
    if (webArObject) {
      // Apply transformations
      webArObject.setAttribute('position', `${config.position.x} ${config.position.y} ${config.position.z}`);
      webArObject.setAttribute('rotation', `${config.rotation.x} ${config.rotation.y} ${config.rotation.z}`);
      webArObject.setAttribute('scale', `${config.scale.x} ${config.scale.y} ${config.scale.z}`);

      if (config.animation && config.animation !== 'none') {
        webArObject.setAttribute('animation', config.animation);
      }
    }
  };

  const resetARConfig = () => {
    const defaultConfig = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      animation: 'none' as const
    };
    setArConfig(defaultConfig);
    updateARPreview(defaultConfig);
    trackEvent('position_adjust', { action: 'reset', config: defaultConfig });
  };

  const applyPreset = (presetName: string) => {
    let presetConfig: Partial<ARObjectConfig> = {};

    switch (presetName) {
      case 'mobile':
        presetConfig = { position: { x: 0, y: 0.5, z: -1 }, scale: { x: 0.8, y: 0.8, z: 0.8 } };
        break;
      case 'desktop':
        presetConfig = { position: { x: 0, y: 0, z: -2 }, scale: { x: 1.2, y: 1.2, z: 1.2 } };
        break;
      case 'showcase':
        presetConfig = {
          position: { x: 0, y: 1, z: 0 },
          rotation: { x: 0, y: 45, z: 0 },
          scale: { x: 1.5, y: 1.5, z: 1.5 },
          animation: 'rotate' as const
        };
        break;
      case 'center':
        presetConfig = { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } };
        break;
    }

    updateARConfig(presetConfig);
    trackEvent('position_adjust', { action: 'preset', preset: presetName });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(handleFileAdd);
  };

  const handleFileAdd = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;

      // Determine file type
      let mediaType: 'image' | 'video' | '3d-model' = 'image';
      if (file.type.startsWith('video/')) {
        mediaType = 'video';
      } else if (file.name.toLowerCase().includes('.gltf') || file.name.toLowerCase().includes('.glb') || file.name.toLowerCase().includes('.fbx') || file.name.toLowerCase().includes('.obj')) {
        mediaType = '3d-model';
      }

      // Create new media item
      const newMedia: UserMedia = {
        id: Date.now().toString(),
        name: file.name,
        type: mediaType,
        url: result,
        uploadedAt: new Date().toISOString(),
        size: file.size
      };

      // Add to library
      setUserLibrary(prev => [...prev, newMedia]);

      // If it's a business card image, set it as uploaded image
      if (mediaType === 'image') {
        setUploadedImage(result);
      }

      // Track analytics
      trackEvent('ar_interaction', {
        action: 'file_upload',
        fileType: mediaType,
        fileName: file.name,
        fileSize: file.size
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleFileAdd);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const deleteMediaItem = (id: string) => {
    setUserLibrary(prev => prev.filter(item => item.id !== id));
    if (selectedLibraryItem?.id === id) {
      setSelectedLibraryItem(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check access and show upgrade prompt if needed
  if (!hasBusinessCardAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
        {/* Navigation Header */}
        <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white font-bold text-xl">
                Spectakull
              </Link>
              <span className="text-white/60">|</span>
              <span className="text-white/80">Business Card AR Creator</span>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <span className="text-white/80 text-sm">
                    {user.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="text-white border-white/20 hover:bg-red-500/20 hover:border-red-400"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Subscription Required */}
        <div className="max-w-4xl mx-auto p-8 flex items-center justify-center min-h-[80vh]">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center max-w-2xl">
            <div className="text-6xl mb-6">🎯</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Business Card AR Creator
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Create professional AR business cards with our advanced editor
            </p>

            <div className="bg-black/20 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Subscription Required</h3>
              <p className="text-white/70 mb-4">
                You need a Business Card subscription to access this feature.
              </p>
              <div className="text-white/60 text-sm">
                Current plan: <span className="text-cyan-400 capitalize">{currentTier}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Link href="/subscription">Get Business Card Plan - $19.99</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Link href="/">Back to Home</Link>
            </Button>
            <Button
              onClick={() => setShowAdminLogin(true)}
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              🔑 Admin Access
              </Button>
            </div>

            {/* Admin Access Button */}
            <div className="mt-8">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-green-500/20 hover:border-green-400"
                onClick={() => setShowAdminLogin(true)}
              >
                Admin Access
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4 text-center">Admin Access</h2>
              <p className="text-gray-700 mb-4 text-center">Enter admin password to bypass subscription check.</p>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                placeholder="Admin password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAdminLogin();
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleAdminLogin}
                >
                  Login
                </Button>
                <Button
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Navigation Header */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-white font-bold text-xl">
              Spectakull
            </Link>
            <span className="text-white/60">|</span>
            <span className="text-white/80">Business Card AR Creator</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLibrary(!showLibrary)}
              className="text-white border-white/20 hover:bg-white/10"
            >
              📁 Media Library ({userLibrary.length})
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAdvancedEditor(!showAdvancedEditor);
                trackEvent('ar_interaction', { action: 'toggle_advanced_editor' });
              }}
              className="text-white border-white/20 hover:bg-cyan-500/20 hover:border-cyan-400"
            >
              🎛️ AR Editor
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAnalytics(!showAnalytics);
                trackEvent('ar_interaction', { action: 'view_analytics' });
              }}
              className="text-white border-white/20 hover:bg-purple-500/20 hover:border-purple-400"
            >
              📊 Analytics ({analyticsEvents.length})
            </Button>

            {isAdminAuthenticated && (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Admin</span>
            )}

            {user && (
              <div className="flex items-center space-x-3">
                <span className="text-white/80 text-sm">
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-white border-white/20 hover:bg-red-500/20 hover:border-red-400"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8 mt-8">
          Business Card AR Creator
        </h1>

        {/* Progress Indicator */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between text-white">
            <div className={`flex items-center space-x-2 ${uploadedImage ? 'text-green-400' : 'text-white'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadedImage ? 'bg-green-500' : 'bg-white/20'}`}>
                {uploadedImage ? '✓' : '1'}
              </div>
              <span className="text-sm font-medium">Upload Card</span>
            </div>
            <div className={`flex items-center space-x-2 ${selectedObject ? 'text-green-400' : 'text-white/70'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedObject ? 'bg-green-500' : 'bg-white/20'}`}>
                {selectedObject ? '✓' : '2'}
              </div>
              <span className="text-sm font-medium">Choose Object</span>
            </div>
            <div className={`flex items-center space-x-2 ${currentTier !== 'free' || isAdminAuthenticated ? 'text-green-400' : 'text-white/70'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${(currentTier !== 'free' || isAdminAuthenticated) ? 'bg-green-500' : 'bg-white/20'}`}>
                {(currentTier !== 'free' || isAdminAuthenticated) ? '✓' : '3'}
              </div>
              <span className="text-sm font-medium">Position</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20">4</div>
              <span className="text-sm font-medium">Preview</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20">5</div>
              <span className="text-sm font-medium">Share</span>
            </div>
          </div>
        </div>

        {/* Universal Media Upload Section */}
        <div className={`bg-white/10 backdrop-blur-md rounded-lg p-6 text-white mb-8 ${uploadedImage ? 'ring-2 ring-green-400' : 'ring-1 ring-white/20'}`}>
          <h2 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
            {uploadedImage && <span className="text-green-400">✓</span>}
            Step 1: Upload Your Media
            {!uploadedImage && <span className="text-cyan-400">📷</span>}
          </h2>

          <div
            className={`bg-black/20 rounded-lg p-6 border-2 border-dashed text-center transition-colors ${
              dragOver ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/30'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <div className="text-4xl mb-2">{dragOver ? '⬇️' : '📁'}</div>
              <p className="text-sm mb-4">
                {dragOver ? 'Drop your files here!' : 'Upload media for your AR experience'}
              </p>

              <div className="grid md:grid-cols-3 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-2xl mb-1">🖼️</div>
                  <p className="text-xs font-medium">Images</p>
                  <p className="text-xs opacity-70">JPG, PNG, GIF, WebP</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-2xl mb-1">🎥</div>
                  <p className="text-xs font-medium">Videos</p>
                  <p className="text-xs opacity-70">MP4, WebM, MOV</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-2xl mb-1">🎲</div>
                  <p className="text-xs font-medium">3D Models</p>
                  <p className="text-xs opacity-70">GLTF, GLB, OBJ, FBX</p>
                </div>
              </div>

              <input
                type="file"
                accept="image/*,video/mp4,video/webm,video/mov,.gltf,.glb,.obj,.fbx"
                onChange={handleFileUpload}
                multiple
                className="block w-full text-sm text-white
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:text-sm file:font-medium
                           file:bg-cyan-500 file:text-white
                           hover:file:bg-cyan-600
                           file:cursor-pointer cursor-pointer"
              />
              <p className="text-xs opacity-70">
                Drag & drop files or click to browse • Max 50MB per file
              </p>
            </div>

            {/* Media Preview */}
            {uploadedImage && (
              <div className="mt-6">
                <p className="text-sm mb-2">Business Card Preview:</p>
                <img
                  src={uploadedImage}
                  alt="Business card preview"
                  className="max-w-full max-h-48 mx-auto rounded-lg border border-white/20"
                />
              </div>
            )}

            {/* Quick Library Access */}
            {userLibrary.length > 0 && (
              <div className="mt-6">
                <p className="text-sm mb-3">Recent uploads:</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {userLibrary.slice(-4).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.type === 'image') {
                          setUploadedImage(item.url);
                        }
                      }}
                      className="w-16 h-16 rounded-lg border border-white/20 overflow-hidden hover:border-cyan-400 transition-colors"
                    >
                      {item.type === 'image' ? (
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/10 flex items-center justify-center text-xs">
                          {item.type === 'video' ? '🎥' : '🎲'}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3D Object Library */}
        <div className={`bg-white/10 backdrop-blur-md rounded-lg p-6 text-white mb-8 ${selectedObject ? 'ring-2 ring-green-400' : 'ring-1 ring-white/20'}`}>
          <h2 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
            {selectedObject && <span className="text-green-400">✓</span>}
            Step 2: Choose 3D Object
            {!selectedObject && <span className="text-cyan-400">🎯</span>}
          </h2>
          <p className="text-center text-sm opacity-80 mb-4">
            Select a 3D object to add to your business card
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Predefined 3D Objects */}
            {objects3D.map((object) => {
              const canSelect = !object.premium || currentTier !== 'free' || isAdminAuthenticated;
              const isSelected = selectedObject && 'id' in selectedObject && selectedObject.id === object.id;
              return (
                <button
                  key={object.id}
                  onClick={() => {
                    if (canSelect) {
                      setSelectedObject(object);
                      trackEvent('model_change', {
                        modelName: object.name,
                        modelType: 'predefined',
                        isPremium: object.premium
                      });
                    }
                  }}
                  className={`rounded-lg p-4 text-center transition-colors border relative ${
                    isSelected
                      ? 'bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-400'
                      : canSelect
                      ? 'bg-black/20 hover:bg-black/40 border-white/20'
                      : 'bg-black/10 border-gray-500 opacity-60 cursor-not-allowed'
                  }`}
                  disabled={!canSelect}
                >
                  {object.premium && (
                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs px-1 rounded-full">
                      ⭐
                    </div>
                  )}
                  <div className="text-2xl mb-2">{object.emoji}</div>
                  <p className="text-xs">{object.name}</p>
                  {object.premium && !canSelect && (
                    <p className="text-xs opacity-70 mt-1">Premium</p>
                  )}
                </button>
              );
            })}

            {/* User-uploaded 3D Models */}
            {userLibrary.filter(item => item.type === '3d-model').map((model) => {
              const isSelected = selectedObject && 'url' in selectedObject && selectedObject.url === model.url;
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    const userModel = {
                      ...model,
                      src: model.url,
                      name: model.name,
                      emoji: '🎲'
                    };
                    setSelectedObject(userModel);
                    trackEvent('model_change', {
                      modelName: model.name,
                      modelType: 'user_uploaded',
                      fileSize: model.size,
                      isPremium: false
                    });
                  }}
                  className={`rounded-lg p-4 text-center transition-colors border relative ${
                    isSelected
                      ? 'bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-400'
                      : 'bg-black/20 hover:bg-black/40 border-white/20'
                  }`}
                >
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded-full">
                    👤
                  </div>
                  <div className="text-2xl mb-2">🎲</div>
                  <p className="text-xs truncate">{model.name.split('.')[0]}</p>
                  <p className="text-xs opacity-70 mt-1">Your Model</p>
                </button>
              );
            })}
          </div>

          {/* Selected Object Info */}
          <div className="text-center">
            <p className="text-sm opacity-80">
              Selected: <span className="text-cyan-400 font-medium">{selectedObject.name}</span>
            </p>
          </div>
        </div>

        {/* Object Positioning & Scaling Controls */}
        <SubscriptionGuard
          feature="pro-features"
          fallback={
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white mb-8">
              <h2 className="text-xl font-semibold mb-4 text-center">Step 2.5: Position & Scale Object 🔒</h2>
              <div className="bg-black/20 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-lg font-medium mb-2">Premium Feature</h3>
                <p className="text-sm opacity-80 mb-4">
                  Unlock advanced positioning and scaling controls with a premium subscription
                </p>
                <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-medium hover:from-yellow-300 hover:to-orange-400 transition-colors">
                  Upgrade to Premium
                </button>
                {/* Admin Access Button in fallback */}
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-white/20 hover:bg-green-500/20 hover:border-green-400"
                    onClick={() => setShowAdminLogin(true)}
                  >
                    Admin Access
                  </Button>
                </div>
              </div>
            </div>
          }
          adminOverride={isAdminAuthenticated}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">Step 2.5: Position & Scale Object ✨</h2>
            <p className="text-center text-sm opacity-80 mb-6">
              Fine-tune the placement and size of your {selectedObject.name}
            </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Position Controls */}
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="font-medium mb-3 text-center">Position</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1 opacity-80">X Position (Left/Right)</label>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.1"
                    defaultValue={arConfig.position.x}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    onChange={e => updateARConfig({ position: { ...arConfig.position, x: parseFloat(e.target.value) } })}
                  />
                  <div className="flex justify-between text-xs opacity-60 mt-1">
                    <span>Left</span>
                    <span>Center</span>
                    <span>Right</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1 opacity-80">Y Position (Up/Down)</label>
                  <input
                    type="range"
                    min="-1"
                    max="3"
                    step="0.1"
                    defaultValue={arConfig.position.y}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    onChange={e => updateARConfig({ position: { ...arConfig.position, y: parseFloat(e.target.value) } })}
                  />
                  <div className="flex justify-between text-xs opacity-60 mt-1">
                    <span>Down</span>
                    <span>Ground</span>
                    <span>Up</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1 opacity-80">Z Position (Near/Far)</label>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.1"
                    defaultValue={arConfig.position.z}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    onChange={e => updateARConfig({ position: { ...arConfig.position, z: parseFloat(e.target.value) } })}
                  />
                  <div className="flex justify-between text-xs opacity-60 mt-1">
                    <span>Near</span>
                    <span>Center</span>
                    <span>Far</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scale & Rotation Controls */}
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="font-medium mb-3 text-center">Scale & Rotation</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1 opacity-80">Scale (Size)</label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    defaultValue={arConfig.scale.x}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    onChange={e => updateARConfig({ scale: { x: parseFloat(e.target.value), y: parseFloat(e.target.value), z: parseFloat(e.target.value) } })}
                  />
                  <div className="flex justify-between text-xs opacity-60 mt-1">
                    <span>50%</span>
                    <span>100%</span>
                    <span>300%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1 opacity-80">Rotation (Y-axis)</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="15"
                    defaultValue={arConfig.rotation.y}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    onChange={e => updateARConfig({ rotation: { ...arConfig.rotation, y: parseFloat(e.target.value) } })}
                  />
                  <div className="flex justify-between text-xs opacity-60 mt-1">
                    <span>0°</span>
                    <span>180°</span>
                    <span>360°</span>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white text-sm py-2 px-4 rounded-lg transition-colors"
                    onClick={resetARConfig}
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mt-6">
            <h3 className="font-medium mb-3 text-center">Quick Presets</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                className="bg-black/20 hover:bg-black/40 text-xs py-2 px-3 rounded-lg transition-colors border border-white/20"
                onClick={() => applyPreset('mobile')}
              >
                📱 Mobile View
              </button>
              <button
                className="bg-black/20 hover:bg-black/40 text-xs py-2 px-3 rounded-lg transition-colors border border-white/20"
                onClick={() => applyPreset('desktop')}
              >
                💻 Desktop View
              </button>
              <button
                className="bg-black/20 hover:bg-black/40 text-xs py-2 px-3 rounded-lg transition-colors border border-white/20"
                onClick={() => applyPreset('center')}
              >
                🎯 Center Focus
              </button>
              <button
                className="bg-black/20 hover:bg-black/40 text-xs py-2 px-3 rounded-lg transition-colors border border-white/20"
                onClick={() => applyPreset('showcase')}
              >
                ✨ Showcase
              </button>
            </div>
          </div>
          </div>
        </SubscriptionGuard>

        {/* AR Preview Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Step 3: Preview AR Experience</h2>
          <p className="text-center text-sm opacity-80 mb-4">
            Test your AR experience before generating QR code
          </p>

          {/* AR Preview */}
          <div className="bg-black/20 rounded-lg p-4 text-center">
            <p className="text-sm mb-4">AR Preview (Floor Mode)</p>
            <p className="text-xs mb-4 opacity-70">Click "Start AR" to test your AR experience</p>
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs opacity-70">
                  Current Object: {selectedObject?.name} {selectedObject?.emoji || '🎲'}
                </p>
                <div className="flex gap-1 text-xs">
                  {showAdvancedEditor && <span className="bg-green-500 text-white px-2 py-1 rounded">Live Editor</span>}
                  <span className="bg-blue-500 text-white px-2 py-1 rounded">{previewMode}</span>
                </div>
              </div>

              <div
                className="relative bg-black/10 rounded-lg overflow-hidden"
                onMouseEnter={() => {
                  if (!isARActive) {
                    setIsARActive(true);
                    trackEvent('ar_start', { mode: previewMode, object: selectedObject?.name });
                  }
                }}
              >
                <kitcore-webar
                  mode={previewMode}
                  auto-button="true"
                  onLoad={() => {
                    // Apply current AR configuration when WebAR loads
                    setTimeout(() => updateARPreview(arConfig), 500);
                  }}
                >
                  <kitcore-webar-object
                    src={selectedObject?.src || selectedObject?.url}
                    position={`${arConfig.position.x} ${arConfig.position.y} ${arConfig.position.z}`}
                    rotation={`${arConfig.rotation.x} ${arConfig.rotation.y} ${arConfig.rotation.z}`}
                    scale={`${arConfig.scale.x} ${arConfig.scale.y} ${arConfig.scale.z}`}
                    animation={arConfig.animation !== 'none' ? arConfig.animation : undefined}
                  />
                </kitcore-webar>

                {/* Live Configuration Overlay */}
                {showAdvancedEditor && (
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded">
                    <div>Pos: ({arConfig.position.x.toFixed(1)}, {arConfig.position.y.toFixed(1)}, {arConfig.position.z.toFixed(1)})</div>
                    <div>Rot: ({arConfig.rotation.x}°, {arConfig.rotation.y}°, {arConfig.rotation.z}°)</div>
                    <div>Scale: {arConfig.scale.x.toFixed(1)}x</div>
                  </div>
                )}

                {/* AR Status Indicator */}
                <div className="absolute top-2 right-2">
                  <div className={`w-3 h-3 rounded-full ${isARActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                </div>
              </div>

              {/* Quick AR Controls */}
              <div className="mt-3 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setPreviewMode('floor');
                    trackEvent('ar_interaction', { action: 'change_mode', mode: 'floor' });
                  }}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    previewMode === 'floor' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Floor
                </button>
                <button
                  onClick={() => {
                    setPreviewMode('wall');
                    trackEvent('ar_interaction', { action: 'change_mode', mode: 'wall' });
                  }}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    previewMode === 'wall' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Wall
                </button>
                <button
                  onClick={() => {
                    setPreviewMode('image');
                    trackEvent('ar_interaction', { action: 'change_mode', mode: 'image' });
                  }}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    previewMode === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Image
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Generation Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Step 4: Generate QR Code</h2>
          <p className="text-center text-sm opacity-80 mb-4">
            Create a shareable QR code for your business card AR experience
          </p>

          <div className="bg-black/20 rounded-lg p-6 text-center">
            <div className="max-w-md mx-auto">
              <p className="text-sm mb-4">Ready to share your AR business card?</p>
              <button
                onClick={() => {
                  setShowQRCreator(true);
                  trackEvent('qr_generate', {
                    hasImage: !!uploadedImage,
                    selectedObject: selectedObject?.name,
                    arConfig: arConfig,
                    librarySize: userLibrary.length,
                    tier: currentTier
                  });
                }}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center mx-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Generate QR Code
              </button>
              <div className="text-xs opacity-70 mt-2 space-y-1">
                <p className={uploadedImage ? "text-green-400" : "text-yellow-400"}>
                  {uploadedImage ? "✓ Business card uploaded" : "⚠ Upload business card first"}
                </p>
                {selectedObject && (
                  <p className="text-green-400">✓ {selectedObject.name} selected</p>
                )}
                {userLibrary.length > 0 && (
                  <p className="text-blue-400">📁 {userLibrary.length} files in your library</p>
                )}
                {!uploadedImage || !selectedObject ? (
                  <p className="text-cyan-400">Complete steps above to generate QR code</p>
                ) : (
                  <p className="text-green-400">✓ Ready to generate AR experience!</p>
                )}
                {currentTier === 'free' && !isAdminAuthenticated && (
                  <p className="text-yellow-400">⭐ Upgrade for white-label QR codes</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Creator Modal */}
      {showQRCreator && (
        <QRCodeCreator
          projectId="business-card-demo"
          projectName="Business Card AR Experience"
          onClose={() => setShowQRCreator(false)}
        />
      )}

      {/* Media Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Your Media Library</h2>
                  <p className="text-blue-100">
                    {userLibrary.length} files • {formatFileSize(userLibrary.reduce((acc, item) => acc + item.size, 0))} total
                  </p>
                </div>
                <button
                  onClick={() => setShowLibrary(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {userLibrary.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No files uploaded yet</h3>
                  <p className="text-gray-600 mb-4">Start uploading images, videos, and 3D models to build your library</p>
                  <Button
                    onClick={() => setShowLibrary(false)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Upload Your First File
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userLibrary.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-lg overflow-hidden border hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : item.type === 'video' ? (
                          <div className="relative w-full h-full bg-black">
                            <video
                              src={item.url}
                              className="w-full h-full object-cover"
                              muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/50 rounded-full p-2">
                                <div className="text-white text-2xl">▶️</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-4xl mb-2">🎲</div>
                            <p className="text-xs text-gray-600">3D Model</p>
                          </div>
                        )}
                      </div>

                      <div className="p-3">
                        <h4 className="font-medium text-sm text-gray-800 truncate" title={item.name}>
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatFileSize(item.size)}
                          </span>
                          <div className="flex gap-1">
                            {item.type === 'image' && (
                              <button
                                onClick={() => {
                                  setUploadedImage(item.url);
                                  setShowLibrary(false);
                                }}
                                className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                              >
                                Use
                              </button>
                            )}
                            <button
                              onClick={() => deleteMediaItem(item.id)}
                              className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(item.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Dashboard Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">📊 Analytics Dashboard</h2>
                  <p className="text-purple-100">
                    Session: {Math.floor((Date.now() - sessionStartTime) / 1000 / 60)} minutes • {analyticsEvents.length} events
                  </p>
                </div>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Analytics Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Events</p>
                      <p className="text-2xl font-bold text-blue-800">{analyticsEvents.length}</p>
                    </div>
                    <div className="text-blue-500 text-2xl">📈</div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">AR Interactions</p>
                      <p className="text-2xl font-bold text-green-800">
                        {analyticsEvents.filter(e => e.type === 'ar_interaction').length}
                      </p>
                    </div>
                    <div className="text-green-500 text-2xl">🎛️</div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Model Changes</p>
                      <p className="text-2xl font-bold text-purple-800">
                        {analyticsEvents.filter(e => e.type === 'model_change').length}
                      </p>
                    </div>
                    <div className="text-purple-500 text-2xl">🎲</div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">Position Adjusts</p>
                      <p className="text-2xl font-bold text-orange-800">
                        {analyticsEvents.filter(e => e.type === 'position_adjust').length}
                      </p>
                    </div>
                    <div className="text-orange-500 text-2xl">📐</div>
                  </div>
                </div>
              </div>

              {/* Event Timeline */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Event Timeline</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {analyticsEvents.slice().reverse().map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        event.type === 'ar_start' ? 'bg-green-500' :
                        event.type === 'ar_interaction' ? 'bg-blue-500' :
                        event.type === 'model_change' ? 'bg-purple-500' :
                        event.type === 'position_adjust' ? 'bg-orange-500' :
                        event.type === 'qr_generate' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${
                            event.type === 'ar_start' ? 'text-green-700' :
                            event.type === 'ar_interaction' ? 'text-blue-700' :
                            event.type === 'model_change' ? 'text-purple-700' :
                            event.type === 'position_adjust' ? 'text-orange-700' :
                            event.type === 'qr_generate' ? 'text-red-700' :
                            'text-gray-700'
                          }`}>
                            {event.type.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {event.type === 'model_change' && event.data.modelName && (
                            <span>Changed to: {event.data.modelName} ({event.data.modelType})</span>
                          )}
                          {event.type === 'ar_interaction' && event.data.action && (
                            <span>Action: {event.data.action}</span>
                          )}
                          {event.type === 'position_adjust' && event.data.config && (
                            <span>Position: ({event.data.config.position?.x.toFixed(2)}, {event.data.config.position?.y.toFixed(2)}, {event.data.config.position?.z.toFixed(2)})</span>
                          )}
                          {event.type === 'ar_interaction' && event.data.fileName && (
                            <span>Uploaded: {event.data.fileName} ({event.data.fileType})</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {analyticsEvents.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-gray-600">No events recorded yet</p>
                      <p className="text-sm text-gray-500">Start interacting with the AR creator to see analytics</p>
                    </div>
                  )}
                </div>
              </div>

              {/* User Engagement Metrics */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Engagement Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Session Duration</span>
                      <span className="font-medium">{Math.floor((Date.now() - sessionStartTime) / 1000 / 60)}m {Math.floor(((Date.now() - sessionStartTime) / 1000) % 60)}s</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Files Uploaded</span>
                      <span className="font-medium">{userLibrary.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Current Tier</span>
                      <span className={`font-medium px-2 py-1 rounded text-xs ${
                        currentTier === 'free' ? 'bg-gray-200 text-gray-800' :
                        currentTier === 'pro' ? 'bg-blue-200 text-blue-800' :
                        'bg-purple-200 text-purple-800'
                      }`}>
                        {currentTier.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Business Card Uploaded</span>
                      <span className={`font-medium ${uploadedImage ? 'text-green-600' : 'text-red-600'}`}>
                        {uploadedImage ? '✓ Yes' : '✗ No'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Selected Object</span>
                      <span className="font-medium">{selectedObject?.name || 'None'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Feature Usage</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Advanced Editor Opened</span>
                      <span className="font-medium">
                        {analyticsEvents.filter(e => e.data.action === 'toggle_advanced_editor').length} times
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Presets Applied</span>
                      <span className="font-medium">
                        {analyticsEvents.filter(e => e.data.action === 'preset').length} times
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">AR Mode Changes</span>
                      <span className="font-medium">
                        {analyticsEvents.filter(e => e.data.action === 'change_mode').length} times
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">QR Code Generated</span>
                      <span className="font-medium">
                        {analyticsEvents.filter(e => e.type === 'qr_generate').length} times
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Analytics */}
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={() => {
                    const analyticsData = {
                      sessionId,
                      userId: user?.id,
                      sessionDuration: Date.now() - sessionStartTime,
                      events: analyticsEvents,
                      summary: {
                        totalEvents: analyticsEvents.length,
                        filesUploaded: userLibrary.length,
                        currentTier,
                        hasBusinessCard: !!uploadedImage,
                        selectedObject: selectedObject?.name
                      }
                    };

                    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `ar-analytics-${sessionId}.json`;
                    a.click();
                    URL.revokeObjectURL(url);

                    trackEvent('ar_interaction', { action: 'export_analytics' });
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  📊 Export Analytics Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal (for in-app admin access) */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-center">Admin Access</h2>
            <p className="text-gray-700 mb-4 text-center">Enter admin password to bypass subscription check.</p>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Admin password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAdminLogin();
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleAdminLogin}
              >
                Login
              </Button>
              <Button
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800"
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminPassword('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
