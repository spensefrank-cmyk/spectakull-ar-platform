'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Enhanced AR Object interface
export interface ARObject {
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
  animation?: 'rotate' | 'bounce' | 'pulse' | 'none';
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  creator?: string;
}

// AR Session state
export interface ARSession {
  isActive: boolean;
  isSupported: boolean;
  hasPermissions: boolean;
  mode: 'viewer' | 'floor' | 'wall' | 'gps';
  device: 'mobile' | 'desktop';
  camera: {
    facingMode: 'user' | 'environment';
    resolution: string;
    isConnected: boolean;
  };
  lastError?: string;
}

// AR Context interface
interface ARStateContextType {
  // AR Objects
  objects: ARObject[];
  selectedObject: ARObject | null;
  addObject: (object: Omit<ARObject, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateObject: (id: string, updates: Partial<ARObject>) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  clearObjects: () => void;

  // AR Session
  session: ARSession;
  updateSession: (updates: Partial<ARSession>) => void;
  initializeARSession: () => Promise<void>;
  terminateARSession: () => void;

  // Project Management
  currentProject: string | null;
  setCurrentProject: (projectId: string | null) => void;
  loadProject: (projectId: string) => Promise<void>;
  saveProject: (projectId: string) => Promise<void>;

  // Live Sync
  isLiveSync: boolean;
  toggleLiveSync: () => void;
  syncWithRemote: () => Promise<void>;
}

const ARStateContext = createContext<ARStateContextType | undefined>(undefined);

export const useARState = () => {
  const context = useContext(ARStateContext);
  if (context === undefined) {
    throw new Error('useARState must be used within an ARStateProvider');
  }
  return context;
};

export const ARStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // AR Objects state
  const [objects, setObjects] = useState<ARObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<ARObject | null>(null);

  // AR Session state
  const [session, setSession] = useState<ARSession>({
    isActive: false,
    isSupported: false,
    hasPermissions: false,
    mode: 'floor',
    device: 'desktop',
    camera: {
      facingMode: 'environment',
      resolution: '1280x720',
      isConnected: false
    }
  });

  // Project state
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [isLiveSync, setIsLiveSync] = useState(false);

  // Device detection on mount
  useEffect(() => {
    const detectDevice = () => {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      updateSession({ device: isMobile ? 'mobile' : 'desktop' });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // AR Object management
  const addObject = useCallback((objectData: Omit<ARObject, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = `ar-object-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newObject: ARObject = {
      ...objectData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: currentProject || undefined
    };

    setObjects(prev => [...prev, newObject]);
    console.log('🎯 Added AR object:', newObject);
    return id;
  }, [currentProject]);

  const updateObject = useCallback((id: string, updates: Partial<ARObject>) => {
    setObjects(prev => prev.map(obj =>
      obj.id === id
        ? { ...obj, ...updates, updatedAt: new Date().toISOString() }
        : obj
    ));

    // Update selected object if it's the one being updated
    if (selectedObject?.id === id) {
      setSelectedObject(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
    }

    console.log('🔄 Updated AR object:', id, updates);
  }, [selectedObject]);

  const removeObject = useCallback((id: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== id));
    if (selectedObject?.id === id) {
      setSelectedObject(null);
    }
    console.log('🗑️ Removed AR object:', id);
  }, [selectedObject]);

  const selectObject = useCallback((id: string | null) => {
    if (id) {
      const object = objects.find(obj => obj.id === id);
      setSelectedObject(object || null);
    } else {
      setSelectedObject(null);
    }
  }, [objects]);

  const clearObjects = useCallback(() => {
    setObjects([]);
    setSelectedObject(null);
    console.log('🧹 Cleared all AR objects');
  }, []);

  // AR Session management
  const updateSession = useCallback((updates: Partial<ARSession>) => {
    setSession(prev => ({ ...prev, ...updates }));
  }, []);

  const initializeARSession = useCallback(async () => {
    try {
      console.log('🚀 Initializing AR session...');

      // Check WebXR support
      const isXRSupported = 'xr' in navigator;
      let isARSupported = false;
      let hasPermissions = false;

      if (isXRSupported) {
        try {
          isARSupported = await (navigator as any).xr.isSessionSupported('immersive-ar');
        } catch (err) {
          console.warn('AR session support check failed:', err);
        }
      }

      // Check camera permissions
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        try {
          const testStream = await navigator.mediaDevices.getUserMedia({ video: true });
          testStream.getTracks().forEach(track => track.stop());
          hasPermissions = true;

          updateSession({
            camera: {
              ...session.camera,
              isConnected: true
            }
          });
        } catch (err) {
          console.warn('Camera permission check failed:', err);
        }
      }

      updateSession({
        isSupported: isARSupported,
        hasPermissions,
        lastError: undefined
      });

      console.log('✅ AR session initialized:', { isXRSupported, isARSupported, hasPermissions });

    } catch (err: any) {
      console.error('❌ Failed to initialize AR session:', err);
      updateSession({
        isSupported: false,
        hasPermissions: false,
        lastError: err.message
      });
    }
  }, [session.camera, updateSession]);

  const terminateARSession = useCallback(() => {
    updateSession({
      isActive: false,
      camera: { ...session.camera, isConnected: false },
      lastError: undefined
    });
    console.log('🛑 AR session terminated');
  }, [session.camera, updateSession]);

  // Project management
  const loadProject = useCallback(async (projectId: string) => {
    try {
      console.log('📂 Loading project:', projectId);

      // In a real app, this would load from a database/API
      const savedProject = localStorage.getItem(`ar-project-${projectId}`);
      if (savedProject) {
        const projectData = JSON.parse(savedProject);
        setObjects(projectData.objects || []);
        setCurrentProject(projectId);
        console.log('✅ Project loaded:', projectData);
      } else {
        console.warn('Project not found:', projectId);
      }
    } catch (err) {
      console.error('❌ Failed to load project:', err);
    }
  }, []);

  const saveProject = useCallback(async (projectId: string) => {
    try {
      console.log('💾 Saving project:', projectId);

      const projectData = {
        id: projectId,
        objects,
        session: {
          mode: session.mode,
          device: session.device
        },
        savedAt: new Date().toISOString()
      };

      // In a real app, this would save to a database/API
      localStorage.setItem(`ar-project-${projectId}`, JSON.stringify(projectData));
      console.log('✅ Project saved:', projectData);
    } catch (err) {
      console.error('❌ Failed to save project:', err);
    }
  }, [objects, session.mode, session.device]);

  // Live sync functionality
  const toggleLiveSync = useCallback(() => {
    setIsLiveSync(prev => !prev);
    console.log('🔄 Live sync toggled:', !isLiveSync);
  }, [isLiveSync]);

  const syncWithRemote = useCallback(async () => {
    if (!isLiveSync || !currentProject) return;

    try {
      console.log('🌐 Syncing with remote...');
      // In a real app, this would sync with a remote server
      await saveProject(currentProject);
      console.log('✅ Synced with remote');
    } catch (err) {
      console.error('❌ Failed to sync with remote:', err);
    }
  }, [isLiveSync, currentProject, saveProject]);

  // Auto-save when objects change
  useEffect(() => {
    if (currentProject && objects.length > 0) {
      const timeoutId = setTimeout(() => {
        saveProject(currentProject);
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [objects, currentProject, saveProject]);

  // Live sync interval
  useEffect(() => {
    if (isLiveSync) {
      const interval = setInterval(syncWithRemote, 10000); // Sync every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isLiveSync, syncWithRemote]);

  const value: ARStateContextType = {
    // AR Objects
    objects,
    selectedObject,
    addObject,
    updateObject,
    removeObject,
    selectObject,
    clearObjects,

    // AR Session
    session,
    updateSession,
    initializeARSession,
    terminateARSession,

    // Project Management
    currentProject,
    setCurrentProject,
    loadProject,
    saveProject,

    // Live Sync
    isLiveSync,
    toggleLiveSync,
    syncWithRemote
  };

  return (
    <ARStateContext.Provider value={value}>
      {children}
    </ARStateContext.Provider>
  );
};

export default ARStateProvider;
