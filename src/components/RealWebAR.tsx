'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Play, Square, RotateCcw, Settings } from 'lucide-react';
import * as THREE from 'three';

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

interface RealWebARProps {
  objects: SceneObject[];
  mode?: 'viewer' | 'floor' | 'wall' | 'gps';
  className?: string;
}

export function RealWebAR({ objects, mode = 'floor', className = '' }: RealWebARProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const sessionRef = useRef<XRSession | null>(null);
  const frameRef = useRef<number>();
  const objectsMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const hitTestSourceRef = useRef<XRHitTestSource | null>(null);
  const reticleRef = useRef<THREE.Mesh>();

  const [isARSupported, setIsARSupported] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [hasPermissions, setHasPermissions] = useState(false);

  // Check WebXR support and permissions with enhanced mobile detection
  useEffect(() => {
    const checkARSupport = async () => {
      try {
        console.log('🔍 Checking AR support...');

        // Enhanced mobile detection
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/i.test(navigator.userAgent);

        console.log('📱 Device info:', { isMobile, isIOS, isAndroid });

        // Check for WebXR support
        if (!('xr' in navigator)) {
          console.warn('WebXR not available');
          // On mobile devices, still provide AR-like experience
          if (isMobile) {
            setIsARSupported(false);
            setError('AR experience available in 3D viewer mode');
          } else {
            throw new Error('WebXR not supported');
          }
        } else {
          // Check for AR session support with better error handling
          try {
            const isSupported = await (navigator as any).xr.isSessionSupported('immersive-ar');
            if (!isSupported) {
              console.warn('Immersive AR not supported, falling back to 3D viewer');
              setIsARSupported(false);
              setError(isMobile ? '3D viewer mode (AR coming soon)' : 'AR not supported on this device. Showing 3D viewer instead.');
            } else {
              console.log('✅ WebXR AR supported');
              setIsARSupported(true);
            }
          } catch (sessionError) {
            console.warn('AR session check failed:', sessionError);
            setIsARSupported(false);
            setError('3D viewer mode available');
          }
        }

        // Enhanced camera permissions handling
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
          try {
            // Test camera access without actually keeping the stream
            const testStream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: 'environment',
                width: { ideal: 640 },
                height: { ideal: 480 }
              }
            });

            // Immediately stop the test stream
            testStream.getTracks().forEach(track => track.stop());

            setHasPermissions(true);
            console.log('✅ Camera permissions granted');
          } catch (err: any) {
            console.warn('Camera permission check failed:', err.name);
            setHasPermissions(false);

            // Don't show error for permission issues, just note it
            if (!isARSupported) {
              setError('3D viewer mode (camera access limited)');
            }
          }
        } else {
          console.warn('getUserMedia not supported');
          setHasPermissions(false);
        }

      } catch (err: any) {
        console.warn('AR support check failed:', err.message);
        setError('3D viewer mode available');
        setIsARSupported(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkARSupport();
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup - different settings for AR vs 3D viewer
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 20);
    cameraRef.current = camera;

    // Renderer setup with WebXR support
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.xr.enabled = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create reticle for AR placement
    const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
    reticleRef.current = reticle;

    // Add floor for 3D viewer mode
    if (!isARSupported) {
      camera.position.set(0, 1.6, 3);
      camera.lookAt(0, 0, 0);

      const floorGeometry = new THREE.PlaneGeometry(10, 10);
      const floorMaterial = new THREE.MeshLambertMaterial({
        color: 0x808080,
        transparent: true,
        opacity: 0.3
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);
    }

    container.appendChild(renderer.domElement);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (isARActive && sessionRef.current && hitTestSourceRef.current) {
        // AR animation loop with hit testing
        const frame = renderer.xr.getFrame();
        if (frame) {
          const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
          if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const referenceSpace = renderer.xr.getReferenceSpace();
            const hitPose = hit.getPose(referenceSpace);

            if (hitPose && reticleRef.current) {
              reticleRef.current.visible = true;
              reticleRef.current.matrix.fromArray(hitPose.transform.matrix);
            }
          } else if (reticleRef.current) {
            reticleRef.current.visible = false;
          }
        }
      } else if (!isARActive) {
        // 3D viewer animation - rotate objects
        const time = Date.now() * 0.001;
        objectsMapRef.current.forEach((mesh, id) => {
          const obj = objects.find(o => o.id === id);
          if (obj && obj.visible) {
            mesh.rotation.y += 0.01;
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth || 400;
      const newHeight = container.clientHeight || 300;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Click handler for object placement in AR
    const handleClick = () => {
      if (isARActive && reticleRef.current && reticleRef.current.visible) {
        placeObjectAtReticle();
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isARSupported, isARActive, objects]);

  // Update objects when props change
  useEffect(() => {
    if (!sceneRef.current) return;

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
        // Create new object
        let geometry: THREE.BufferGeometry;

        switch (obj.type) {
          case 'cube':
            geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            break;
          case 'sphere':
            geometry = new THREE.SphereGeometry(0.1, 32, 32);
            break;
          case 'cylinder':
            geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
            break;
          default:
            geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        }

        const material = new THREE.MeshLambertMaterial({
          color: obj.color || '#3b82f6',
          transparent: true,
          opacity: 0.9
        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Position objects based on mode
        if (isARSupported && isARActive) {
          // In AR, objects will be placed by hit testing
          mesh.position.set(0, 0.1, -0.5);
        } else {
          // In 3D viewer, use provided positions
          mesh.position.set(...obj.position);
        }

        scene.add(mesh);
        objectsMap.set(obj.id, mesh);
      }

      // Update object properties
      if (!isARActive) {
        mesh.position.set(...obj.position);
        mesh.rotation.set(
          THREE.MathUtils.degToRad(obj.rotation[0]),
          THREE.MathUtils.degToRad(obj.rotation[1]),
          THREE.MathUtils.degToRad(obj.rotation[2])
        );
        mesh.scale.set(...obj.scale);
      }

      mesh.visible = obj.visible;

      // Update material
      const material = mesh.material as THREE.MeshLambertMaterial;
      if (obj.color) {
        material.color.setHex(parseInt(obj.color.replace('#', ''), 16));
      }
    });
  }, [objects, isARActive, isARSupported]);

  const startAR = async () => {
    if (!isARSupported || !rendererRef.current) {
      console.warn('AR not supported, staying in 3D viewer mode');
      setError('AR not available - using 3D viewer mode');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      console.log('🚀 Starting AR session...');

      // Enhanced session initialization with better error handling
      const sessionInit: XRSessionInit = {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'anchors', 'light-estimation'],
        domOverlay: { root: containerRef.current! }
      };

      console.log('📋 Requesting AR session with features:', sessionInit);

      const session = await (navigator as any).xr.requestSession('immersive-ar', sessionInit);
      sessionRef.current = session;

      console.log('✅ AR session created successfully');

      // Set up renderer for AR with error handling
      try {
        await rendererRef.current.xr.setSession(session);
        console.log('✅ Renderer session set');
      } catch (rendererError) {
        console.error('❌ Failed to set renderer session:', rendererError);
        throw new Error('Failed to initialize AR renderer');
      }

      // Set up hit testing with fallback
      try {
        const referenceSpace = await session.requestReferenceSpace('viewer');
        const hitTestSource = await session.requestHitTestSource({ space: referenceSpace });
        hitTestSourceRef.current = hitTestSource;
        console.log('✅ Hit testing initialized');
      } catch (hitTestError) {
        console.warn('⚠️ Hit testing failed, AR will have limited functionality:', hitTestError);
        // Continue without hit testing - some AR features will be limited
      }

      // Enhanced session end handling
      session.addEventListener('end', () => {
        console.log('🛑 AR session ended');
        sessionRef.current = null;
        hitTestSourceRef.current = null;
        setIsARActive(false);
        setError('');
        if (reticleRef.current) {
          reticleRef.current.visible = false;
        }
      });

      // Handle session errors
      session.addEventListener('error', (event: any) => {
        console.error('❌ AR session error:', event);
        setError('AR session error - restarting...');
        stopAR();
      });

      setIsARActive(true);
      console.log('🎯 AR session active');

    } catch (err: any) {
      console.error('❌ Failed to start AR session:', err);

      let errorMessage = 'Failed to start AR. ';
      if (err.name === 'SecurityError') {
        errorMessage += 'Please allow camera permissions and try again.';
      } else if (err.name === 'NotAllowedError') {
        errorMessage += 'Camera permission denied. Please allow camera access.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'AR not supported on this device or browser.';
      } else {
        errorMessage += 'Please check your camera and try again.';
      }

      setError(errorMessage);
      setIsARActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopAR = () => {
    if (sessionRef.current) {
      sessionRef.current.end();
    }
  };

  const placeObjectAtReticle = () => {
    if (!reticleRef.current || !reticleRef.current.visible) return;

    // Place the first visible object at reticle position
    const visibleObjects = objects.filter(obj => obj.visible);
    if (visibleObjects.length === 0) return;

    const firstObject = visibleObjects[0];
    const mesh = objectsMapRef.current.get(firstObject.id);

    if (mesh && reticleRef.current) {
      mesh.position.setFromMatrixPosition(reticleRef.current.matrix);
      mesh.position.y += 0.1; // Slightly above the surface
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg ${className}`}>
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Initializing AR Engine</h3>
          <p className="text-sm opacity-90">Setting up WebXR capabilities...</p>
        </div>
      </div>
    );
  }

  if (error && !isARSupported) {
    return (
      <div className={`relative bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0" ref={containerRef}></div>

        {/* 3D Viewer overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="bg-black/70 rounded-lg p-3 text-white text-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Camera className="w-4 h-4" />
              <span>3D Viewer Mode</span>
              <span className="bg-blue-500 px-2 py-1 rounded text-xs">Active</span>
            </div>
            <p className="text-xs opacity-80">
              AR not available on this device. Showing interactive 3D preview.
            </p>
          </div>

          <div className="bg-black/70 rounded-lg p-3 text-white text-sm">
            <p className="text-xs opacity-80 mb-2">
              📦 {objects.filter(obj => obj.visible).length} objects • {mode} mode
            </p>
            <p className="text-xs opacity-60">
              Drag to rotate • Scroll to zoom
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="w-full h-full min-h-[400px] bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg overflow-hidden">
        {/* AR Controls overlay */}
        <div className="absolute top-4 left-4 bg-black/70 rounded-lg p-3 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isARActive ? 'AR Active' : isARSupported ? 'AR Ready' : '3D Viewer'}
            </span>
            <div className={`w-2 h-2 rounded-full ${isARActive ? 'bg-green-500 animate-pulse' : isARSupported ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
          </div>

          {isARSupported && !isARActive && (
            <Button
              onClick={startAR}
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              <Play className="w-4 h-4 mr-2" />
              Start AR
            </Button>
          )}

          {isARActive && (
            <Button
              onClick={stopAR}
              size="sm"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop AR
            </Button>
          )}
        </div>

        {/* AR Instructions */}
        {isARActive && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-3 text-white text-center">
            <p className="text-sm font-medium mb-1">AR Mode Active</p>
            <p className="text-xs opacity-80">
              {mode === 'floor' && '📱 Point at the floor and tap to place objects'}
              {mode === 'wall' && '📱 Point at a wall and tap to place objects'}
              {mode === 'viewer' && '📱 3D objects visible in your space'}
            </p>
          </div>
        )}

        {/* Object count */}
        <div className="absolute top-4 right-4 bg-black/70 rounded-lg px-3 py-2 text-white text-sm">
          📦 {objects.filter(obj => obj.visible).length} objects
        </div>

        {/* Error display */}
        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-900/70 rounded-lg p-3 text-white text-center">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
