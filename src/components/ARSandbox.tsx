'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Move3D, RotateCcw, Scale, Trash2, Copy, Eye, EyeOff,
  Layers, Grid3X3, Camera, Play, Pause, Settings,
  Upload, Image, Video, Box, ZoomIn, ZoomOut
} from 'lucide-react';
import * as THREE from 'three';

interface SceneObject {
  id: string;
  type: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
  metallic?: number;
  roughness?: number;
  visible: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | '3d-model';
}

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | '3d-model';
  url: string;
  size: number;
}

interface ARSandboxProps {
  objects: SceneObject[];
  onObjectsChange: (objects: SceneObject[]) => void;
  availableMedia: MediaItem[];
  onMediaUpload: () => void;
}

export function ARSandbox({ objects, onObjectsChange, availableMedia, onMediaUpload }: ARSandboxProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const objectsMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const animationFrameRef = useRef<number>();
  const frameCountRef = useRef<number>(0);

  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [showGrid, setShowGrid] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMediaPanel, setShowMediaPanel] = useState(false);
  const [cameraDistance, setCameraDistance] = useState(8.66);
  const [isMobile, setIsMobile] = useState(false);
  const [isThreeJSSupported, setIsThreeJSSupported] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);

  // Enhanced mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      const isTouchDevice = 'ontouchstart' in window;

      setIsMobile(isMobileUA || isSmallScreen || isTouchDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Three.js scene with mobile optimization
  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    let width = mount.clientWidth || 400;
    let height = mount.clientHeight || 300;

    // Ensure minimum dimensions
    width = Math.max(width, 300);
    height = Math.max(height, 200);

    console.log('🎯 Initializing ARSandbox:', { width, height, isMobile });

    try {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(isMobile ? 0x2a2a2a : 0x1a1a1a);
      sceneRef.current = scene;

      // Camera setup with mobile-friendly settings
      const camera = new THREE.PerspectiveCamera(
        isMobile ? 60 : 75, // Narrower FOV for mobile
        width / height,
        0.1,
        100 // Reduced far plane for better performance
      );
      camera.position.set(isMobile ? 4 : 5, isMobile ? 4 : 5, isMobile ? 4 : 5);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Mobile-optimized renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: !isMobile, // Disable antialiasing on mobile for performance
        alpha: true,
        powerPreference: isMobile ? "default" : "high-performance",
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: true
      });

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

      // Simplified settings for mobile
      if (isMobile) {
        renderer.shadowMap.enabled = false;
        // Simplified rendering for mobile performance
      } else {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // Full quality rendering for desktop
      }

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      rendererRef.current = renderer;

      // Simplified lighting for mobile performance
      const ambientLight = new THREE.AmbientLight(0xffffff, isMobile ? 0.6 : 0.4);
      scene.add(ambientLight);

      if (!isMobile) {
        // Only add complex lighting on desktop
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.setScalar(1024); // Reduced shadow resolution
        scene.add(directionalLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 5, -5);
        scene.add(fillLight);
      } else {
        // Simple directional light for mobile
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
      }

      // Add grid with mobile optimization
      const gridHelper = new THREE.GridHelper(
        isMobile ? 8 : 10,
        isMobile ? 8 : 10,
        0x888888,
        0x444444
      );
      gridHelper.name = 'grid';
      scene.add(gridHelper);

      // Add simplified axes helper
      const axesHelper = new THREE.AxesHelper(isMobile ? 3 : 5);
      axesHelper.name = 'axes';
      scene.add(axesHelper);

      // Append to mount
      mount.appendChild(renderer.domElement);

      // Simplified interaction handling
      let isDragging = false;
      let isMultiTouch = false;
      let initialPinchDistance = 0;
      let previousPosition = { x: 0, y: 0 };
      let lastTouchTime = 0;

      const getEventPosition = (event: MouseEvent | TouchEvent) => {
        if ('touches' in event) {
          return event.touches.length > 0 ? {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
          } : { x: 0, y: 0 };
        }
        return { x: event.clientX, y: event.clientY };
      };

      const handleStart = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();

        if ('touches' in event) {
          const currentTime = Date.now();

          if (event.touches.length === 2) {
            // Pinch to zoom
            isMultiTouch = true;
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            initialPinchDistance = Math.sqrt(
              Math.pow(touch2.clientX - touch1.clientX, 2) +
              Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            return;
          } else if (event.touches.length === 1) {
            // Single touch
            const position = getEventPosition(event);
            previousPosition = position;
            isDragging = true;

            // Double tap detection for mobile
            if (currentTime - lastTouchTime < 300) {
              handleObjectSelection(event);
              return;
            }
            lastTouchTime = currentTime;
          }
        } else {
          // Mouse
          const position = getEventPosition(event);
          previousPosition = position;
          isDragging = true;
          handleObjectSelection(event);
        }
      };

      const handleMove = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();

        if ('touches' in event) {
          if (event.touches.length === 2 && isMultiTouch) {
            // Handle pinch zoom
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const currentDistance = Math.sqrt(
              Math.pow(touch2.clientX - touch1.clientX, 2) +
              Math.pow(touch2.clientY - touch1.clientY, 2)
            );

            if (initialPinchDistance > 0) {
              const scale = currentDistance / initialPinchDistance;
              const newDistance = cameraDistance / scale;
              setCameraDistance(Math.max(2, Math.min(50, newDistance)));
            }
            return;
          } else if (event.touches.length === 1 && isDragging && !isMultiTouch) {
            const position = getEventPosition(event);
            rotateCameraAround(position);
          }
        } else if (isDragging) {
          const position = getEventPosition(event);
          rotateCameraAround(position);
        }
      };

      const rotateCameraAround = (currentPosition: { x: number; y: number }) => {
        const deltaX = currentPosition.x - previousPosition.x;
        const deltaY = currentPosition.y - previousPosition.y;

        if (!camera) return;

        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position);

        // Mobile-friendly sensitivity - slightly more responsive on mobile
        const sensitivity = isMobile ? 0.004 : 0.005;
        spherical.theta -= deltaX * sensitivity;
        spherical.phi += deltaY * sensitivity;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, 0, 0);

        previousPosition = currentPosition;
      };

      const handleEnd = () => {
        isDragging = false;
        isMultiTouch = false;
        initialPinchDistance = 0;
      };

      const handleObjectSelection = (event: MouseEvent | TouchEvent) => {
        if (!camera || !scene) return;

        const rect = renderer.domElement.getBoundingClientRect();
        const position = getEventPosition(event);

        mouseRef.current.x = ((position.x - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((position.y - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const intersects = raycasterRef.current.intersectObjects(Array.from(objectsMapRef.current.values()));

        if (intersects.length > 0) {
          const clickedMesh = intersects[0].object as THREE.Mesh;
          const objectId = Array.from(objectsMapRef.current.entries())
            .find(([_, mesh]) => mesh === clickedMesh)?.[0];

          if (objectId) {
            setSelectedObject(objectId);
          }
        } else {
          setSelectedObject(null);
        }
      };

      // Add event listeners with better mobile support
      const canvas = renderer.domElement;
      canvas.style.touchAction = 'none';

      canvas.addEventListener('mousedown', handleStart);
      canvas.addEventListener('mousemove', handleMove);
      canvas.addEventListener('mouseup', handleEnd);
      canvas.addEventListener('touchstart', handleStart, { passive: false });
      canvas.addEventListener('touchmove', handleMove, { passive: false });
      canvas.addEventListener('touchend', handleEnd);

      // Mouse wheel zoom
      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const delta = event.deltaY > 0 ? 1.1 : 0.9;
        setCameraDistance(prev => Math.max(2, Math.min(50, prev * delta)));
      };
      canvas.addEventListener('wheel', handleWheel, { passive: false });

      // Animation loop with mobile optimization
      const animate = () => {
        if (!renderer || !scene || !camera || !sceneReady) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        frameCountRef.current++;

        try {
          // Throttle rendering on mobile (30 FPS vs 60 FPS)
          if (isMobile) {
            // Render every other frame for 30 FPS on mobile
            if (frameCountRef.current % 2 === 0) {
              renderer.render(scene, camera);
            }
          } else {
            renderer.render(scene, camera);
          }
        } catch (error) {
          console.error('Render error:', error);
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      // Handle resize with debouncing
      let resizeTimeout: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (!mount || !renderer || !camera) return;

          const newWidth = Math.max(mount.clientWidth || 400, 300);
          const newHeight = Math.max(mount.clientHeight || 300, 200);

          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }, 150);
      };

      window.addEventListener('resize', handleResize);

      setSceneReady(true);
      setIsThreeJSSupported(true);
      animate();

      // Cleanup function
      return () => {
        setSceneReady(false);

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        // Reset frame counter
        frameCountRef.current = 0;

        window.removeEventListener('resize', handleResize);

        if (canvas) {
          canvas.removeEventListener('mousedown', handleStart);
          canvas.removeEventListener('mousemove', handleMove);
          canvas.removeEventListener('mouseup', handleEnd);
          canvas.removeEventListener('touchstart', handleStart);
          canvas.removeEventListener('touchmove', handleMove);
          canvas.removeEventListener('touchend', handleEnd);
          canvas.removeEventListener('wheel', handleWheel);
        }

        if (mount && renderer && renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }

        if (renderer) {
          renderer.dispose();
        }

        clearTimeout(resizeTimeout);
      };

    } catch (error) {
      console.error('Three.js initialization failed:', error);
      setIsThreeJSSupported(false);
    }
  }, [isMobile, cameraDistance]);

  // Update objects when props change
  useEffect(() => {
    if (!sceneRef.current || !sceneReady) return;

    const scene = sceneRef.current;
    const objectsMap = objectsMapRef.current;

    try {
      // Remove objects that no longer exist
      for (const [id, mesh] of objectsMap) {
        if (!objects.find(obj => obj.id === id)) {
          scene.remove(mesh);
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(mat => mat.dispose());
            } else {
              mesh.material.dispose();
            }
          }
          objectsMap.delete(id);
        }
      }

      // Add or update objects
      objects.forEach(obj => {
        let mesh = objectsMap.get(obj.id);

        if (!mesh) {
          // Create new object with mobile-optimized geometry
          let geometry: THREE.BufferGeometry;

          const segments = isMobile ? 16 : 32; // Lower detail on mobile

          switch (obj.type) {
            case 'cube':
              geometry = new THREE.BoxGeometry(1, 1, 1);
              break;
            case 'sphere':
              geometry = new THREE.SphereGeometry(0.5, segments, segments / 2);
              break;
            case 'cylinder':
              geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, segments);
              break;
            case 'plane':
              geometry = new THREE.PlaneGeometry(1, 1);
              break;
            case 'media':
              geometry = new THREE.PlaneGeometry(2, 1.5);
              break;
            default:
              geometry = new THREE.BoxGeometry(1, 1, 1);
          }

          // Mobile-optimized material
          const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: isMobile ? 0 : 0.1, // Simplified materials on mobile
            roughness: isMobile ? 1 : 0.5,
            transparent: false
          });

          mesh = new THREE.Mesh(geometry, material);

          if (!isMobile) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }

          // Apply media texture if available and supported
          if (obj.mediaUrl && obj.mediaType === 'image' && !isMobile) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
              obj.mediaUrl,
              (texture) => {
                material.map = texture;
                material.needsUpdate = true;
              },
              undefined,
              (error) => {
                console.warn('Failed to load texture:', error);
              }
            );
          }

          scene.add(mesh);
          objectsMap.set(obj.id, mesh);
        }

        // Update object properties
        if (mesh) {
          mesh.position.set(...obj.position);
          mesh.rotation.set(
            THREE.MathUtils.degToRad(obj.rotation[0]),
            THREE.MathUtils.degToRad(obj.rotation[1]),
            THREE.MathUtils.degToRad(obj.rotation[2])
          );
          mesh.scale.set(...obj.scale);
          mesh.visible = obj.visible;

          // Update material
          const material = mesh.material as THREE.MeshStandardMaterial;
          if (obj.color) {
            material.color.setHex(parseInt(obj.color.replace('#', ''), 16));
          }

          if (!isMobile) {
            material.metalness = obj.metallic || 0;
            material.roughness = obj.roughness || 1;
          }

          // Highlight selected object
          if (obj.id === selectedObject) {
            material.emissive.setHex(0x444444);
            material.emissiveIntensity = 0.3;
          } else {
            material.emissive.setHex(0x000000);
            material.emissiveIntensity = 0;
          }
        }
      });
    } catch (error) {
      console.error('Error updating objects:', error);
    }
  }, [objects, selectedObject, isMobile, sceneReady]);

  // Toggle grid visibility
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const grid = scene.getObjectByName('grid');
    const axes = scene.getObjectByName('axes');

    if (grid) grid.visible = showGrid;
    if (axes) axes.visible = showGrid;
  }, [showGrid]);

  // Update camera position when distance changes
  useEffect(() => {
    if (!cameraRef.current) return;

    const camera = cameraRef.current;
    const normalizedPosition = camera.position.clone().normalize();
    camera.position.copy(normalizedPosition.multiplyScalar(cameraDistance));
    camera.lookAt(0, 0, 0);
  }, [cameraDistance]);

  // Simplified control functions
  const zoomIn = () => setCameraDistance(prev => Math.max(prev * 0.9, 1));
  const zoomOut = () => setCameraDistance(prev => Math.min(prev * 1.1, 100));
  const resetCamera = () => setCameraDistance(8.66);

  const addObject = (type: string) => {
    const newObject: SceneObject = {
      id: `${type}-${Date.now()}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${objects.length + 1}`,
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      metallic: 0.1,
      roughness: 0.5,
      visible: true
    };

    onObjectsChange([...objects, newObject]);
    setSelectedObject(newObject.id);
  };

  const updateSelectedObject = (updates: Partial<SceneObject>) => {
    if (!selectedObject) return;

    const updatedObjects = objects.map(obj =>
      obj.id === selectedObject ? { ...obj, ...updates } : obj
    );
    onObjectsChange(updatedObjects);
  };

  const deleteSelectedObject = () => {
    if (!selectedObject) return;

    const updatedObjects = objects.filter(obj => obj.id !== selectedObject);
    onObjectsChange(updatedObjects);
    setSelectedObject(null);
  };

  const applyMediaToObject = (objectId: string, media: MediaItem) => {
    const updatedObjects = objects.map(obj => {
      if (obj.id === objectId) {
        return {
          ...obj,
          mediaUrl: media.url,
          mediaType: media.type as 'image' | 'video' | '3d-model',
          name: `${obj.name} (${media.name})`
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const createMediaObject = (media: MediaItem) => {
    const newObject: SceneObject = {
      id: `media-${Date.now()}`,
      type: 'media',
      name: media.name,
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#ffffff',
      visible: true,
      mediaUrl: media.url,
      mediaType: media.type as 'image' | 'video' | '3d-model'
    };

    onObjectsChange([...objects, newObject]);
    setShowMediaPanel(false);
  };

  const selectedObj = objects.find(obj => obj.id === selectedObject);

  // Fallback UI for unsupported devices
  if (!isThreeJSSupported) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gray-100 text-gray-800 p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">3D View Not Available</h3>
          <p className="text-gray-600 mb-4">
            Your device doesn't support WebGL or 3D rendering.
            {isMobile && " Try using a different browser or device."}
          </p>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="font-medium mb-3">Your AR Objects:</h4>
            {objects.length > 0 ? (
              <div className="space-y-2">
                {objects.map(obj => (
                  <div key={obj.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{obj.name}</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: obj.color || '#cccccc' }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onObjectsChange(objects.filter(o => o.id !== obj.id))}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No objects added yet</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Main Sandbox */}
      <div className="flex-1 relative min-h-[300px] lg:min-h-0">
        <div
          ref={mountRef}
          className="w-full h-full min-h-[300px] bg-gray-900 rounded-lg overflow-hidden"
          style={{ touchAction: 'none' }}
        />

        {/* Simplified Mobile Toolbar */}
        <div className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-gray-900/95 rounded-lg p-2 flex flex-wrap gap-1 max-w-[calc(100%-1rem)]">
          <Button
            size="sm"
            variant={transformMode === 'translate' ? 'default' : 'ghost'}
            onClick={() => setTransformMode('translate')}
            className="text-white p-2"
          >
            <Move3D className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={transformMode === 'rotate' ? 'default' : 'ghost'}
            onClick={() => setTransformMode('rotate')}
            className="text-white p-2"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={transformMode === 'scale' ? 'default' : 'ghost'}
            onClick={() => setTransformMode('scale')}
            className="text-white p-2"
          >
            <Scale className="w-4 h-4" />
          </Button>
          <div className="w-px bg-gray-600 mx-1" />
          <Button
            size="sm"
            variant={showGrid ? 'default' : 'ghost'}
            onClick={() => setShowGrid(!showGrid)}
            className="text-white p-2"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>

          {!isMobile && (
            <>
              <div className="w-px bg-gray-600 mx-1" />
              <Button size="sm" onClick={zoomIn} className="text-white bg-gray-700 hover:bg-gray-600 p-2">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={zoomOut} className="text-white bg-gray-700 hover:bg-gray-600 p-2">
                <ZoomOut className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Mobile-Optimized Object Creation Panel */}
        <div className="absolute bottom-4 right-4 lg:top-4 lg:right-4 bg-gray-900/95 rounded-lg p-2">
          <div className="flex lg:flex-col space-x-1 lg:space-x-0 lg:space-y-2">
            <Button size="sm" onClick={() => addObject('cube')} className="bg-blue-600 hover:bg-blue-700 text-white p-2">
              <Box className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={() => addObject('sphere')} className="bg-green-600 hover:bg-green-700 text-white p-2">
              <span className="text-sm">⚫</span>
            </Button>
            <Button size="sm" onClick={() => addObject('cylinder')} className="bg-purple-600 hover:bg-purple-700 text-white p-2">
              <span className="text-sm">🟦</span>
            </Button>
            <Button size="sm" onClick={() => addObject('plane')} className="bg-orange-600 hover:bg-orange-700 text-white p-2">
              <span className="text-sm">⬜</span>
            </Button>
            {!isMobile && (
              <>
                <div className="hidden lg:block w-full h-px bg-gray-600 my-1" />
                <Button size="sm" onClick={() => setShowMediaPanel(true)} className="bg-pink-600 hover:bg-pink-700 text-white p-2">
                  <Upload className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 bg-gray-900/95 rounded-lg px-3 py-2 text-white text-sm max-w-[60%] truncate">
          {selectedObj ? `Selected: ${selectedObj.name}` : `${objects.length} objects • ${isMobile ? 'Mobile' : 'Desktop'} mode`}
        </div>

        {/* Mobile Help Overlay */}
        {isMobile && objects.length === 0 && (
          <div className="absolute inset-4 flex items-center justify-center">
            <div className="bg-blue-600/90 text-white px-4 py-3 rounded-lg text-center max-w-xs">
              <p className="text-sm font-medium mb-2">Welcome to AR Sandbox!</p>
              <p className="text-xs opacity-90">
                Tap the + buttons to add objects • Pinch to zoom • Drag to rotate
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Properties Panel - Simplified for mobile */}
      {selectedObj && (
        <div className="lg:w-80 absolute bottom-0 left-0 right-0 lg:relative lg:bottom-auto bg-white text-gray-900 p-4 rounded-t-lg lg:rounded-none shadow-lg lg:shadow-none max-h-[50vh] lg:max-h-none overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Properties: {selectedObj.name}</h3>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" onClick={() => setSelectedObject(null)} className="lg:hidden">
                ✕
              </Button>
              <Button size="sm" variant="ghost" onClick={deleteSelectedObject} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Simplified Controls for Mobile */}
          <div className="space-y-4">
            {/* Color */}
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <input
                type="color"
                value={selectedObj.color || '#ffffff'}
                onChange={(e) => updateSelectedObject({ color: e.target.value })}
                className="w-full h-10 rounded border"
              />
            </div>

            {/* Position - Simplified for mobile */}
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <div key={axis} className="text-center">
                    <label className="text-xs text-gray-600">{axis}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedObj.position[i].toFixed(1)}
                      onChange={(e) => {
                        const newPos = [...selectedObj.position] as [number, number, number];
                        newPos[i] = parseFloat(e.target.value) || 0;
                        updateSelectedObject({ position: newPos });
                      }}
                      className="w-full mt-1 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Scale - Uniform only for mobile */}
            <div>
              <label className="block text-sm font-medium mb-2">Scale</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={selectedObj.scale[0]}
                onChange={(e) => {
                  const scale = parseFloat(e.target.value);
                  updateSelectedObject({ scale: [scale, scale, scale] });
                }}
                className="w-full"
              />
              <div className="text-center text-xs text-gray-600 mt-1">
                {(selectedObj.scale[0] * 100).toFixed(0)}%
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Visible</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateSelectedObject({ visible: !selectedObj.visible })}
                className="flex items-center space-x-2"
              >
                {selectedObj.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{selectedObj.visible ? 'Visible' : 'Hidden'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Panel - Simplified */}
      {showMediaPanel && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Media Library</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowMediaPanel(false)} className="text-white hover:bg-white/20">
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Available Media</h4>
                <Button onClick={onMediaUpload} size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {availableMedia.map(media => (
                  <div key={media.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {media.type === 'image' && <Image className="w-4 h-4" />}
                        {media.type === 'video' && <Video className="w-4 h-4" />}
                        {media.type === '3d-model' && <Box className="w-4 h-4" />}
                        <span className="font-medium text-sm truncate">{media.name}</span>
                      </div>
                    </div>

                    {media.type === 'image' && (
                      <img src={media.url} alt={media.name} className="w-full h-16 object-cover rounded mb-2" />
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => createMediaObject(media)} className="flex-1">
                        Add as Object
                      </Button>
                      {selectedObj && (
                        <Button size="sm" variant="outline" onClick={() => applyMediaToObject(selectedObject!, media)} className="flex-1">
                          Apply to Selected
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {availableMedia.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No media uploaded yet</p>
                  <Button onClick={onMediaUpload} className="mt-2">Upload Media</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}