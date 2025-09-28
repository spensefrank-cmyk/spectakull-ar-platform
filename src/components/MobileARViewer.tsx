'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { RealWebAR } from './RealWebAR';

interface SceneObject {
  id: string;
  type: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
  visible: boolean;
  src?: string;
}

interface MobileARViewerProps {
  objects: SceneObject[];
  mode?: 'viewer' | 'floor' | 'wall';
  onClose?: () => void;
  className?: string;
}

export function MobileARViewer({ objects, mode = 'floor', onClose, className = '' }: MobileARViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.innerHeight < window.innerWidth) {
        setOrientation('landscape');
      } else {
        setOrientation('portrait');
      }
    };

    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.warn('Fullscreen not supported or failed');
    }
  };

  // Lock screen orientation for AR
  const lockOrientation = async () => {
    try {
      if ('screen' in window && 'orientation' in (window as any).screen) {
        await (window as any).screen.orientation.lock('portrait');
      }
    } catch (error) {
      console.warn('Screen orientation lock not supported');
    }
  };

  useEffect(() => {
    if (isFullscreen) {
      lockOrientation();
    }
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      className={`
        ${isFullscreen ? 'fixed inset-0 z-[9999] ar-fullscreen' : 'relative'}
        ${className}
        bg-black ar-no-select
        ${orientation === 'landscape' ? 'ar-landscape' : ''}
      `}
    >
      {/* Mobile AR Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <Camera className="w-5 h-5" />
            <div>
              <p className="text-sm font-medium">AR Mode</p>
              <p className="text-xs opacity-80">{objects.filter(obj => obj.visible).length} objects</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isFullscreen && (
              <Button
                onClick={toggleFullscreen}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            )}

            {onClose && (
              <Button
                onClick={onClose}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* AR Viewer */}
      <div className={`
        w-full h-full
        ${isFullscreen ? 'h-screen' : 'min-h-[60vh] md:min-h-[400px]'}
      `}>
        <RealWebAR
          objects={objects}
          mode={mode}
          className="w-full h-full ar-canvas"
        />
      </div>

      {/* Mobile AR Instructions */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="text-white text-center">
          <div className="mb-3">
            <p className="text-sm font-medium mb-1">
              {mode === 'floor' && '📱 Point at the floor to place objects'}
              {mode === 'wall' && '📱 Point at a wall to place objects'}
              {mode === 'viewer' && '📱 3D viewer mode - drag to rotate'}
            </p>
            <p className="text-xs opacity-80">
              {orientation === 'landscape'
                ? 'Landscape mode active - great for AR!'
                : 'Rotate device for better AR experience'
              }
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => window.location.reload()}
              size="sm"
              variant="outline"
              className="text-white border-white/30 hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>

            {isFullscreen && (
              <Button
                onClick={toggleFullscreen}
                size="sm"
                variant="outline"
                className="text-white border-white/30 hover:bg-white/20"
              >
                <ZoomOut className="w-4 h-4 mr-1" />
                Exit Fullscreen
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Orientation Helper */}
      {orientation === 'portrait' && isFullscreen && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="text-white text-center p-8">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">Rotate Your Device</h3>
            <p className="text-sm opacity-80">
              For the best AR experience, please rotate your device to landscape mode
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
