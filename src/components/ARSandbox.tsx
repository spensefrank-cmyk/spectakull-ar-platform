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

  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [showGrid, setShowGrid] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMediaPanel, setShowMediaPanel] = useState(false);
  const [cameraDistance, setCameraDistance] = useState(8.66); // sqrt(5^2 + 5^2 + 5^2)

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    // Better mobile sizing with minimum dimensions
    const width = Math.max(mount.clientWidth || 400, 300);
    const height = Math.max(mount.clientHeight || 300, 200);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a); // Darker background for better contrast
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup with better mobile optimization
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // Enhanced lighting for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.setScalar(2048);
    scene.add(directionalLight);

    // Add fill light to prevent harsh shadows
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Add visible grid with better contrast
    const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x444444);
    gridHelper.name = 'grid';
    scene.add(gridHelper);

    // Add coordinate axes for better orientation
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.name = 'axes';
    scene.add(axesHelper);

    // Add mouse wheel zoom support
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9;
      setCameraDistance(prev => Math.max(2, Math.min(50, prev * zoomFactor)));
    };

    // Append renderer to mount
    if (mount) {
      mount.appendChild(renderer.domElement);
      renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    // Mouse/touch controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent | TouchEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      mouseRef.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      // Raycast for object selection
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(Array.from(objectsMapRef.current.values()));

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const objectId = Array.from(objectsMapRef.current.entries())
          .find(([_, mesh]) => mesh === clickedMesh)?.[0];

        if (objectId) {
          setSelectedObject(objectId);
          return; // Don't start camera drag if object selected
        }
      }

      // Start camera drag
      isDragging = true;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      // Rotate camera around the scene
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);

      previousMousePosition = { x: clientX, y: clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('touchstart', handleMouseDown);
    renderer.domElement.addEventListener('touchmove', handleMouseMove);
    renderer.domElement.addEventListener('touchend', handleMouseUp);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize with mobile optimization
    const handleResize = () => {
      if (!mount || !renderer || !camera) return;

      const newWidth = Math.max(mount.clientWidth || 400, 300);
      const newHeight = Math.max(mount.clientHeight || 300, 200);

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('touchstart', handleMouseDown);
      renderer.domElement.removeEventListener('touchmove', handleMouseMove);
      renderer.domElement.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);

      if (mount && renderer.domElement.parentNode === mount) {
        renderer.domElement.removeEventListener('wheel', handleWheel);
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

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
            geometry = new THREE.BoxGeometry(1, 1, 1);
            break;
          case 'sphere':
            geometry = new THREE.SphereGeometry(0.5, 32, 32);
            break;
          case 'cylinder':
            geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
            break;
          case 'plane':
            geometry = new THREE.PlaneGeometry(1, 1);
            break;
          case 'media':
            geometry = new THREE.PlaneGeometry(2, 1.5); // 16:9 ratio for media
            break;
          default:
            geometry = new THREE.BoxGeometry(1, 1, 1);
        }

        const material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.1,
          roughness: 0.5,
          transparent: false
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Apply media texture if available
        if (obj.mediaUrl && obj.mediaType === 'image') {
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(obj.mediaUrl, (texture) => {
            material.map = texture;
            material.needsUpdate = true;
          });
        }

        scene.add(mesh);
        objectsMap.set(obj.id, mesh);
      }

      // Update object properties
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
      material.metalness = obj.metallic || 0;
      material.roughness = obj.roughness || 1;

      // Highlight selected object
      if (obj.id === selectedObject) {
        material.emissive.setHex(0x444444);
        material.emissiveIntensity = 0.3;
      } else {
        material.emissive.setHex(0x000000);
        material.emissiveIntensity = 0;
      }
    });
  }, [objects, selectedObject]);

  // Toggle grid visibility
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const grid = scene.getObjectByName('grid');
    const axes = scene.getObjectByName('axes');

    if (grid) grid.visible = showGrid;
    if (axes) axes.visible = showGrid;
  }, [showGrid]);

  // Enhanced zoom functions with smoother controls
  const zoomIn = () => {
    setCameraDistance(prev => Math.max(prev * 0.9, 1));
  };

  const zoomOut = () => {
    setCameraDistance(prev => Math.min(prev * 1.1, 100));
  };

  const resetCamera = () => {
    setCameraDistance(8.66); // sqrt(5^2 + 5^2 + 5^2)
  };

  // Update camera position when distance changes
  useEffect(() => {
    if (!cameraRef.current) return;

    const camera = cameraRef.current;
    const normalizedPosition = camera.position.clone().normalize();
    camera.position.copy(normalizedPosition.multiplyScalar(cameraDistance));
    camera.lookAt(0, 0, 0);
  }, [cameraDistance]);

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

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Main Sandbox */}
      <div className="flex-1 relative min-h-[400px] lg:min-h-0">
        <div
          ref={mountRef}
          className="w-full h-full min-h-[400px] bg-gray-900 rounded-lg overflow-hidden"
          style={{ touchAction: 'none' }}
        />

        {/* Toolbar Overlay - Mobile Responsive */}
        <div className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-gray-900/95 rounded-lg p-1 lg:p-2 flex flex-wrap lg:space-x-2 gap-1 lg:gap-0 max-w-[calc(100%-1rem)] lg:max-w-none">
          <Button
            size="sm"
            variant={transformMode === 'translate' ? 'default' : 'ghost'}
            onClick={() => setTransformMode('translate')}
            className="text-white p-2 lg:px-3"
          >
            <Move3D className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
          <Button
            size="sm"
            variant={transformMode === 'rotate' ? 'default' : 'ghost'}
            onClick={() => setTransformMode('rotate')}
            className="text-white p-2 lg:px-3"
          >
            <RotateCcw className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
          <Button
            size="sm"
            variant={transformMode === 'scale' ? 'default' : 'ghost'}
            onClick={() => setTransformMode('scale')}
            className="text-white p-2 lg:px-3"
          >
            <Scale className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
          <div className="hidden lg:block w-px bg-gray-600 mx-2" />
          <Button
            size="sm"
            variant={showGrid ? 'default' : 'ghost'}
            onClick={() => setShowGrid(!showGrid)}
            className="text-white p-2 lg:px-3"
          >
            <Grid3X3 className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
          <div className="hidden lg:block w-px bg-gray-600 mx-2" />
          <Button
            size="sm"
            onClick={zoomIn}
            className="text-white bg-gray-700 hover:bg-gray-600 p-2 lg:px-3"
          >
            <ZoomIn className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
          <Button
            size="sm"
            onClick={zoomOut}
            className="text-white bg-gray-700 hover:bg-gray-600 p-2 lg:px-3"
          >
            <ZoomOut className="w-3 h-3 lg:w-4 lg:h-4" />
          </Button>
        </div>

        {/* Object Creation Panel - Mobile Responsive */}
        <div className="absolute bottom-16 lg:top-4 right-2 lg:right-4 bg-gray-900/95 rounded-lg p-1 lg:p-2">
          <div className="flex lg:flex-col space-x-1 lg:space-x-0 lg:space-y-2">
            <Button
              size="sm"
              onClick={() => addObject('cube')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 lg:px-3"
            >
              <Box className="w-3 h-3 lg:w-4 lg:h-4 lg:mr-1" />
              <span className="hidden lg:inline">Cube</span>
            </Button>
            <Button
              size="sm"
              onClick={() => addObject('sphere')}
              className="bg-green-600 hover:bg-green-700 text-white p-2 lg:px-3"
            >
              <span className="text-xs lg:text-sm">⚫</span>
              <span className="hidden lg:inline ml-1">Sphere</span>
            </Button>
            <Button
              size="sm"
              onClick={() => addObject('cylinder')}
              className="bg-purple-600 hover:bg-purple-700 text-white p-2 lg:px-3"
            >
              <span className="text-xs lg:text-sm">🟦</span>
              <span className="hidden lg:inline ml-1">Cylinder</span>
            </Button>
            <Button
              size="sm"
              onClick={() => addObject('plane')}
              className="bg-orange-600 hover:bg-orange-700 text-white p-2 lg:px-3"
            >
              <span className="text-xs lg:text-sm">⬜</span>
              <span className="hidden lg:inline ml-1">Plane</span>
            </Button>
            <div className="hidden lg:block w-full h-px bg-gray-600 my-1" />
            <Button
              size="sm"
              onClick={() => setShowMediaPanel(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white p-2 lg:px-3"
            >
              <Upload className="w-3 h-3 lg:w-4 lg:h-4 lg:mr-1" />
              <span className="hidden lg:inline">Media</span>
            </Button>
          </div>
        </div>

        {/* Status Bar - Mobile Responsive */}
        <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 bg-gray-900/95 rounded-lg px-2 py-1 lg:px-4 lg:py-2 text-white text-xs lg:text-sm max-w-[60%] lg:max-w-none truncate">
          {selectedObj ? `Selected: ${selectedObj.name}` : `${objects.length} objects in scene`}
        </div>
      </div>

      {/* Properties Panel - Mobile Responsive */}
      {selectedObj && (
        <div className="lg:w-80 lg:relative absolute bottom-0 left-0 right-0 lg:bottom-auto lg:left-auto lg:right-auto bg-gray-900 text-white p-4 overflow-y-auto max-h-[50vh] lg:max-h-none rounded-t-lg lg:rounded-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Object Properties</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedObject(null)}
              className="lg:hidden text-white"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={selectedObj.name}
                onChange={(e) => {
                  const updated = objects.map(obj =>
                    obj.id === selectedObject ? { ...obj, name: e.target.value } : obj
                  );
                  onObjectsChange(updated);
                }}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    step="0.1"
                    value={selectedObj.position[i]}
                    onChange={(e) => {
                      const newPos = [...selectedObj.position] as [number, number, number];
                      newPos[i] = parseFloat(e.target.value);
                      const updated = objects.map(obj =>
                        obj.id === selectedObject ? { ...obj, position: newPos } : obj
                      );
                      onObjectsChange(updated);
                    }}
                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
                    placeholder={axis}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rotation</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    step="1"
                    value={selectedObj.rotation[i]}
                    onChange={(e) => {
                      const newRot = [...selectedObj.rotation] as [number, number, number];
                      newRot[i] = parseFloat(e.target.value);
                      const updated = objects.map(obj =>
                        obj.id === selectedObject ? { ...obj, rotation: newRot } : obj
                      );
                      onObjectsChange(updated);
                    }}
                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
                    placeholder={axis}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Scale</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={selectedObj.scale[i]}
                    onChange={(e) => {
                      const newScale = [...selectedObj.scale] as [number, number, number];
                      newScale[i] = Math.max(0.1, parseFloat(e.target.value));
                      const updated = objects.map(obj =>
                        obj.id === selectedObject ? { ...obj, scale: newScale } : obj
                      );
                      onObjectsChange(updated);
                    }}
                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
                    placeholder={axis}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input
                type="color"
                value={selectedObj.color || '#ffffff'}
                onChange={(e) => {
                  const updated = objects.map(obj =>
                    obj.id === selectedObject ? { ...obj, color: e.target.value } : obj
                  );
                  onObjectsChange(updated);
                }}
                className="w-full h-10 bg-gray-800 border border-gray-600 rounded"
              />
            </div>

            {selectedObj.mediaUrl && (
              <div>
                <label className="block text-sm font-medium mb-1">Applied Media</label>
                <div className="bg-gray-800 border border-gray-600 rounded p-2">
                  <p className="text-sm">{selectedObj.mediaType}: {selectedObj.name}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const updated = objects.map(obj =>
                        obj.id === selectedObject ? { ...obj, mediaUrl: undefined, mediaType: undefined } : obj
                      );
                      onObjectsChange(updated);
                    }}
                    className="mt-2 text-red-400 hover:text-red-300"
                  >
                    Remove Media
                  </Button>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const updated = objects.map(obj =>
                    obj.id === selectedObject ? { ...obj, visible: !obj.visible } : obj
                  );
                  onObjectsChange(updated);
                }}
                className="flex-1"
              >
                {selectedObj.visible ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                {selectedObj.visible ? 'Hide' : 'Show'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const updated = objects.filter(obj => obj.id !== selectedObject);
                  onObjectsChange(updated);
                  setSelectedObject(null);
                }}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Media Panel */}
      {showMediaPanel && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Apply Media to AR</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMediaPanel(false)}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Available Media</h4>
                <Button onClick={onMediaUpload} size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload More
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                {availableMedia.map(media => (
                  <div key={media.id} className="border rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      {media.type === 'image' && <Image className="w-5 h-5 mr-2" />}
                      {media.type === 'video' && <Video className="w-5 h-5 mr-2" />}
                      {media.type === '3d-model' && <Box className="w-5 h-5 mr-2" />}
                      <span className="font-medium text-sm">{media.name}</span>
                    </div>

                    {media.type === 'image' && (
                      <img
                        src={media.url}
                        alt={media.name}
                        className="w-full h-20 object-cover rounded mb-2"
                      />
                    )}

                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        onClick={() => createMediaObject(media)}
                        className="flex-1"
                      >
                        Add as Object
                      </Button>
                      {selectedObj && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => applyMediaToObject(selectedObject!, media)}
                          className="flex-1"
                        >
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
                  <Button onClick={onMediaUpload} className="mt-2">
                    Upload Media
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
