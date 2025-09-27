'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, Image, Target, Plane, Webcam, Settings } from 'lucide-react';

interface ARMarkerPanelProps {
  onMarkerSelect?: (markerType: string, config: any) => void;
  onClose?: () => void;
}

export function ARMarkerPanel({ onMarkerSelect, onClose }: ARMarkerPanelProps) {
  const [selectedMarker, setSelectedMarker] = useState<string>('qr-code');
  const [markerConfig, setMarkerConfig] = useState<any>({});

  const markerTypes = [
    {
      id: 'qr-code',
      name: 'QR Code Tracking',
      icon: QrCode,
      description: 'Track QR codes for easy scanning',
      features: ['Fast recognition', 'Works on any device', 'Analytics tracking'],
      color: 'blue'
    },
    {
      id: 'image-target',
      name: 'Image Target',
      icon: Image,
      description: 'Track custom images or logos',
      features: ['Custom branding', 'High accuracy', 'Works offline'],
      color: 'green'
    },
    {
      id: 'plane-detection',
      name: 'Plane Detection',
      icon: Plane,
      description: 'Detect flat surfaces automatically',
      features: ['No markers needed', 'Natural placement', 'Modern devices only'],
      color: 'purple'
    },
    {
      id: 'world-tracking',
      name: 'World Tracking',
      icon: Target,
      description: 'Advanced 6DOF tracking',
      features: ['Full 3D tracking', 'Occlusion support', 'Premium feature'],
      color: 'orange',
      isPro: true
    },
    {
      id: 'face-tracking',
      name: 'Face Tracking',
      icon: Webcam,
      description: 'Track human faces for filters',
      features: ['Real-time tracking', 'Filter effects', 'Social media ready'],
      color: 'pink',
      isPro: true
    }
  ];

  const renderMarkerConfig = () => {
    switch (selectedMarker) {
      case 'qr-code':
        return (
          <div className="space-y-4">
            <h4 className="font-medium">QR Code Settings</h4>
            <div>
              <label className="block text-sm font-medium mb-2">QR Code Size</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={markerConfig.size || 'medium'}
                onChange={(e) => setMarkerConfig({...markerConfig, size: e.target.value})}
              >
                <option value="small">Small (100x100px)</option>
                <option value="medium">Medium (200x200px)</option>
                <option value="large">Large (300x300px)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Error Correction</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={markerConfig.errorCorrection || 'M'}
                onChange={(e) => setMarkerConfig({...markerConfig, errorCorrection: e.target.value})}
              >
                <option value="L">Low (7%)</option>
                <option value="M">Medium (15%)</option>
                <option value="Q">Quartile (25%)</option>
                <option value="H">High (30%)</option>
              </select>
            </div>
          </div>
        );

      case 'image-target':
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Image Target Settings</h4>
            <div>
              <label className="block text-sm font-medium mb-2">Target Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Upload your target image</p>
                <Button size="sm" className="mt-2">Choose Image</Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Detection Sensitivity</label>
              <input
                type="range"
                min="1"
                max="10"
                value={markerConfig.sensitivity || 5}
                onChange={(e) => setMarkerConfig({...markerConfig, sensitivity: e.target.value})}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        );

      case 'plane-detection':
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Plane Detection Settings</h4>
            <div>
              <label className="block text-sm font-medium mb-2">Surface Types</label>
              <div className="space-y-2">
                {['Horizontal planes', 'Vertical planes', 'All surfaces'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mr-2"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Advanced Settings</h4>
            <p className="text-sm text-gray-600">
              Configure advanced tracking parameters for optimal performance.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">🎯 AR Marker Types</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
          <p className="text-sm opacity-90 mt-1">Choose how users will trigger your AR experience</p>
        </div>

        <div className="flex h-[600px]">
          {/* Marker Types List */}
          <div className="w-1/2 border-r overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium mb-4">Available Tracking Methods</h3>
              <div className="space-y-3">
                {markerTypes.map(marker => {
                  const IconComponent = marker.icon;
                  return (
                    <div
                      key={marker.id}
                      onClick={() => setSelectedMarker(marker.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedMarker === marker.id
                          ? `border-${marker.color}-500 bg-${marker.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <IconComponent className={`w-6 h-6 text-${marker.color}-600 mt-1`} />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{marker.name}</h4>
                            {marker.isPro && (
                              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                PRO
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{marker.description}</p>
                          <div className="mt-2">
                            {marker.features.map(feature => (
                              <div key={feature} className="flex items-center text-xs text-gray-500">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="w-1/2 p-4">
            <div className="mb-6">
              <h3 className="font-medium mb-2">Configuration</h3>
              {renderMarkerConfig()}
            </div>

            {/* Preview */}
            <div className="border rounded-lg p-4 bg-gray-50 mb-6">
              <h4 className="font-medium mb-2">Preview</h4>
              <div className="bg-white rounded border h-32 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Settings className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Marker preview will appear here</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={() => onMarkerSelect?.(selectedMarker, markerConfig)}
              >
                Apply Marker Settings
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Generate QR code or download marker
                  alert('Marker generated! Check your downloads folder.');
                }}
              >
                Generate & Download Marker
              </Button>

              {/* Live Tracking Test Button for Advanced Markers */}
              {(selectedMarker === 'face-tracking' || selectedMarker === 'world-tracking') && (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    // This would open the FaceBodyTracker component
                    alert('🎥 Live face/body tracking demo will open here! This feature uses MediaPipe for real-time tracking.');
                  }}
                >
                  🎥 Test Live Tracking
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
