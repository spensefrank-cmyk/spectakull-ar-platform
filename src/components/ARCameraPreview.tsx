'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, RotateCcw, Settings, Maximize2, Wifi, WifiOff } from 'lucide-react';
import * as THREE from 'three';
import { useARConnection } from '@/lib/ar-connection';

interface SceneObject {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
  metallic?: number;
  roughness?: number;
  visible: boolean;
}

interface ARCameraPreviewProps {
  objects: SceneObject[];
  className?: string;
}

export function ARCameraPreview({ objects, className = "w-full h-full" }: ARCameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const objectsMapRef = useRef<Map<string, THREE.Mesh>>(new Map());

  const [isARActive, setIsARActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // AR Connection for live view
  const { status: connectionStatus, data: liveData, sendData, reconnect, connectionInfo } = useARConnection({
    enableWebSocket: true,
    enableWebRTC: false,
    fallbackToPolling: true
  });

  const startCamera = async () => {
    setIsLoading(true);
    setError('');

    try {
      console.log('🎥 Starting camera with facing mode:', facingMode);

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      // Stop existing stream first to prevent conflicts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      // Enhanced camera constraints with better mobile support and fallback
      let constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          aspectRatio: { ideal: 16/9 }
        },
        audio: false
      };

      console.log('📱 Requesting camera with constraints:', constraints);

      let mediaStream: MediaStream;

      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('✅ Camera stream obtained successfully');
      } catch (constraintError) {
        console.warn('⚠️ Falling back to basic camera constraints:', constraintError);
        // Fallback to very basic constraints for maximum compatibility
        constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        };
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('✅ Camera stream obtained with fallback constraints');
      }

      setStream(mediaStream);

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = mediaStream;

        // Essential video settings for mobile browsers
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('muted', 'true');
        video.setAttribute('autoplay', 'true');
        video.muted = true;
        video.autoplay = true;
        video.defaultMuted = true; // Additional mobile support

        // Force video to fill container properly
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.backgroundColor = '#000000';

        console.log('🎥 Camera stream assigned to video element');

        // Enhanced video ready handling
        await new Promise<void>((resolve, reject) => {
          let resolved = false;

          const onLoadedMetadata = () => {
            if (resolved) return;
            resolved = true;
            console.log('📹 Video metadata loaded, dimensions:', video.videoWidth, 'x', video.videoHeight);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            video.removeEventListener('canplay', onCanPlay);
            clearTimeout(timeout);
            resolve();
          };

          const onCanPlay = () => {
            if (resolved) return;
            resolved = true;
            console.log('▶️ Video can play');
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            video.removeEventListener('canplay', onCanPlay);
            clearTimeout(timeout);
            resolve();
          };

          const onError = (e: Event) => {
            if (resolved) return;
            resolved = true;
            console.error('❌ Video error:', e);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            video.removeEventListener('canplay', onCanPlay);
            clearTimeout(timeout);
            reject(new Error('Video failed to load'));
          };

          // Timeout as fallback
          const timeout = setTimeout(() => {
            if (resolved) return;
            resolved = true;
            console.log('⏰ Video loading timeout, proceeding anyway');
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            video.removeEventListener('canplay', onCanPlay);
            resolve();
          }, 5000);

          video.addEventListener('loadedmetadata', onLoadedMetadata);
          video.addEventListener('canplay', onCanPlay);
          video.addEventListener('error', onError);

          // Force play the video - essential for mobile
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log('▶️ Video playback started successfully');
            }).catch((playError) => {
              console.error('❌ Video play failed:', playError);
              // Don't reject here, as autoplay might be blocked but video could still work
            });
          }
        });
      }

      // Initialize Three.js AR scene after video is ready
      setTimeout(() => {
        console.log('🎯 Initializing AR scene...');
        initializeARScene();
        setIsARActive(true);
      }, 1000); // Longer delay to ensure video is fully ready

    } catch (err: any) {
      console.error('❌ Camera error:', err);

      let errorMessage = 'Camera access failed. ';
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and reload the page.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported in this browser. Please try Chrome or Safari.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application.';
      } else {
        errorMessage += err.message || 'Please check your camera and try again.';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsARActive(false);

    // Clean up video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Clean up Three.js
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = undefined;
    }

    // Clear object references
    objectsMapRef.current.clear();
    sceneRef.current = undefined;
    cameraRef.current = undefined;
  };

  const initializeARScene = () => {
    if (!canvasRef.current || !videoRef.current) {
      console.warn('⚠️ Canvas or video not ready for AR scene initialization');
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Get proper dimensions - fallback to container if video not ready
    const containerWidth = canvas.parentElement?.clientWidth || 800;
    const containerHeight = canvas.parentElement?.clientHeight || 600;
    const width = video.videoWidth || containerWidth;
    const height = video.videoHeight || containerHeight;

    console.log('🎯 Initializing AR scene with dimensions:', width, 'x', height);

    // Create Three.js scene for AR overlay
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup for AR (realistic FOV for mobile AR)
    const fov = 60; // More realistic FOV for AR
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.01, 100);
    camera.position.set(0, 0, 0); // Camera at origin for AR
    camera.lookAt(0, 0, -1); // Look forward
    cameraRef.current = camera;

    // Enhanced renderer with better mobile performance
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false, // Disabled for better mobile performance
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false // Better performance
    });

    // Set canvas size properly
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0); // Fully transparent for AR overlay
    renderer.sortObjects = false; // Better performance

    // Ensure canvas is properly positioned
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';

    console.log('📐 Canvas initialized with size:', width, 'x', height);

    // Enhanced WebGL state
    const gl = renderer.getContext();
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    rendererRef.current = renderer;

    // Enhanced lighting for AR visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(2, 3, 2); // Closer lighting for AR
    directionalLight.castShadow = false;
    scene.add(directionalLight);

    // Add fill light for better object visibility
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-2, 1, 1);
    scene.add(fillLight);

    console.log('💡 AR lighting setup complete');

    // Start optimized render loop
    let animationId: number;
    let lastTime = 0;
    const targetFPS = 30; // 30 FPS for better mobile performance
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (!isARActive || !renderer || !scene || !camera) {
        console.log('⚠️ Animation stopped - missing dependencies');
        return;
      }

      // Throttle to target FPS
      if (currentTime - lastTime >= frameInterval) {
        try {
          // Auto-resize if needed
          if (video.videoWidth && video.videoHeight) {
            const newWidth = video.videoWidth;
            const newHeight = video.videoHeight;

            if (canvas.width !== newWidth || canvas.height !== newHeight) {
              renderer.setSize(newWidth, newHeight, false);
              camera.aspect = newWidth / newHeight;
              camera.updateProjectionMatrix();
              console.log('📐 Canvas resized to:', newWidth, 'x', newHeight);
            }
          }

          renderer.render(scene, camera);
          lastTime = currentTime;
        } catch (renderError) {
          console.error('❌ Render error:', renderError);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    // Store cleanup function
    const cleanupAnimation = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
    (renderer as any).cleanup = cleanupAnimation;

    console.log('✅ AR scene initialized, starting render loop');
    animate(0);
  };

  const toggleCamera = () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);

    if (isARActive) {
      stopCamera();
      setTimeout(() => startCamera(), 100);
    }
  };

  // Update AR objects when props change
  useEffect(() => {
    if (!sceneRef.current || !isARActive) return;

    const scene = sceneRef.current;
    const objectsMap = objectsMapRef.current;

    // Remove objects that no longer exist
    for (const [id, mesh] of objectsMap) {
      if (!objects.find(obj => obj.id === id)) {
        scene.remove(mesh);
        objectsMap.delete(id);
      }
    }

    // Add or update objects
    objects.forEach(obj => {
      let mesh = objectsMap.get(obj.id);

      if (!mesh) {
        // Create new AR object
        let geometry: THREE.BufferGeometry;

        switch (obj.type) {
          case 'cube':
            geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            break;
          case 'sphere':
            geometry = new THREE.SphereGeometry(0.3, 32, 32);
            break;
          case 'cylinder':
            geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
            break;
          case 'plane':
            geometry = new THREE.PlaneGeometry(0.5, 0.5);
            break;
          default:
            geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        }

        const material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          transparent: false,
          opacity: 1.0,
          metalness: 0.1,
          roughness: 0.5,
          side: THREE.DoubleSide // Ensure visibility from all angles
        });
        mesh = new THREE.Mesh(geometry, material);

        console.log('🎯 Created AR object:', obj.type, 'at position:', mesh.position);

        scene.add(mesh);
        objectsMap.set(obj.id, mesh);
      }

      // Position objects in AR space (in front of camera)
      mesh.position.set(
        (obj.position[0] - 2) * 0.3, // Scale down and center X
        (obj.position[1] - 1) * 0.3 + 0.5, // Lift objects up slightly
        -Math.abs(obj.position[2] * 0.3) - 1.5 // Keep objects in front of camera (negative Z)
      );

      mesh.rotation.set(
        THREE.MathUtils.degToRad(obj.rotation[0]),
        THREE.MathUtils.degToRad(obj.rotation[1]),
        THREE.MathUtils.degToRad(obj.rotation[2])
      );

      mesh.scale.set(
        obj.scale[0] * 0.3, // Scale down for AR
        obj.scale[1] * 0.3,
        obj.scale[2] * 0.3
      );

      // Update material
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (obj.color) {
        material.color.setHex(parseInt(obj.color.replace('#', ''), 16));
      }
      material.metalness = obj.metallic || 0;
      material.roughness = obj.roughness || 1;
    });
  }, [objects, isARActive]);

  // Sync with live AR data from other devices
  useEffect(() => {
    if (liveData && isARActive) {
      console.log('🔄 Syncing live AR data:', liveData);

      // Send current AR state to other connected clients
      if (connectionStatus === 'connected') {
        sendData({
          objects: objects.map(obj => ({
            id: obj.id,
            type: obj.type,
            position: obj.position,
            rotation: obj.rotation,
            scale: obj.scale,
            color: obj.color,
            visible: obj.visible
          })),
          camera: {
            position: [0, 1.6, 3],
            rotation: [0, 0, 0],
            fov: 75
          },
          sessionId: 'ar-camera-preview',
          timestamp: Date.now()
        });
      }
    }
  }, [liveData, objects, isARActive, connectionStatus, sendData]);

  // Handle video loaded
  const handleVideoLoaded = () => {
    if (videoRef.current && canvasRef.current && rendererRef.current && cameraRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Match canvas size to video for proper aspect ratio
      const width = video.videoWidth;
      const height = video.videoHeight;

      if (width && height) {
        canvas.width = width;
        canvas.height = height;

        // Update Three.js renderer size
        rendererRef.current.setSize(width, height, false);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up ARCameraPreview');
      stopCamera();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // stopCamera intentionally excluded to avoid re-running cleanup

  // Cleanup animation when AR stops
  useEffect(() => {
    if (!isARActive && rendererRef.current) {
      const renderer = rendererRef.current as any;
      if (renderer.cleanup) {
        renderer.cleanup();
      }
    }
  }, [isARActive]);

  return (
    <div className={`relative ${className} bg-gray-900 rounded-lg overflow-hidden`}>
      {/* Camera Feed */}
      {isARActive && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          preload="none"
          controls={false}
          className="absolute inset-0 w-full h-full object-cover bg-black"
          onLoadedMetadata={handleVideoLoaded}
          onError={(e) => {
            console.error('Video playback error:', e);
            setError('Video playback failed. Please try again.');
            setIsARActive(false);
          }}
          onLoadStart={() => console.log('📺 Video load started')}
          onCanPlay={() => console.log('📺 Video can play')}
          onPlaying={() => console.log('📺 Video is playing')}
          style={{
            transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
            backgroundColor: '#000000',
            objectFit: 'cover'
          }}
        />
      )}

      {/* AR Objects Overlay */}
      {isARActive && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
            zIndex: 10
          }}
        />
      )}

      {/* Controls Overlay */}
      <div className="absolute inset-0 flex flex-col">
        {/* Top Controls */}
        <div className="flex justify-between items-start p-4">
          <div className="bg-black/70 rounded-lg px-3 py-2 text-white text-sm">
            {isARActive ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>📱 Live AR Preview</span>
                {/* Live Connection Status */}
                <div className="flex items-center space-x-1 ml-2 pl-2 border-l border-gray-500">
                  {connectionStatus === 'connected' ? (
                    <Wifi className="w-3 h-3 text-green-400" />
                  ) : connectionStatus === 'connecting' ? (
                    <div className="w-3 h-3 border border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <WifiOff className="w-3 h-3 text-red-400" />
                  )}
                  <span className="text-xs">
                    {connectionStatus === 'connected' ? 'Live' :
                     connectionStatus === 'connecting' ? 'Sync...' :
                     'Offline'}
                  </span>
                </div>
              </div>
            ) : (
              '📷 Camera Preview'
            )}
          </div>

          {isARActive && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleCamera}
                className="bg-black/70 text-white hover:bg-black/80"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center">
          {!isARActive && !isLoading && (
            <div className="text-center text-white">
              <div className="bg-black/70 rounded-lg p-6 max-w-sm">
                <Camera className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Live AR Camera</h3>
                <p className="text-sm opacity-90 mb-4">
                  Experience your AR objects in the real world!
                  Camera permissions required for live preview.
                </p>
                <Button
                  onClick={startCamera}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Enable Live Camera
                </Button>
                <div className="mt-3 text-xs opacity-70">
                  📱 Works on mobile • 🖥️ Desktop compatible
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center text-white">
              <div className="bg-black/70 rounded-lg p-6">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Initializing camera...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-white">
              <div className="bg-red-600/90 rounded-lg p-6 max-w-sm">
                <CameraOff className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
                <p className="text-sm mb-4">{error}</p>
                <Button
                  onClick={startCamera}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-red-600"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        {isARActive && (
          <div className="p-4 flex justify-center space-x-4">
            <Button
              onClick={stopCamera}
              variant="ghost"
              className="bg-red-600/80 text-white hover:bg-red-700"
            >
              <CameraOff className="w-4 h-4 mr-2" />
              Stop AR
            </Button>

            <div className="bg-black/70 rounded-lg px-3 py-2 text-white text-sm flex items-center space-x-4">
              <span>📦 {objects.length} AR Objects</span>

              {/* Live Connection Info */}
              <div className="flex items-center space-x-2 border-l border-gray-500 pl-4">
                <div className="flex items-center space-x-1">
                  {connectionStatus === 'connected' ? (
                    <Wifi className="w-4 h-4 text-green-400" />
                  ) : connectionStatus === 'connecting' ? (
                    <div className="w-4 h-4 border border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-xs">
                    {connectionInfo.connectionType === 'websocket' ? 'WebSocket' :
                     connectionInfo.connectionType === 'polling' ? 'Polling' :
                     'Offline'}
                  </span>
                </div>

                {connectionStatus !== 'connected' && connectionStatus !== 'connecting' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={reconnect}
                    className="h-6 px-2 text-xs bg-blue-600/70 hover:bg-blue-700"
                  >
                    Reconnect
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AR Instructions */}
      {isARActive && objects.length === 0 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="bg-blue-600/90 text-white px-4 py-2 rounded-lg text-sm text-center">
            Add objects from the sidebar to see them in AR!
          </div>
        </div>
      )}
    </div>
  );
}
