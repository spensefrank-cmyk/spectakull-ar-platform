'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PhysicsProperties, PhysicsWorld } from '@/types/physics';

interface PhysicsContextType {
  physicsWorld: PhysicsWorld;
  isSimulating: boolean;
  objectPhysics: Map<string, PhysicsProperties>;

  // World controls
  updateGravity: (gravity: [number, number, number]) => void;
  togglePhysics: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;

  // Object controls
  setObjectPhysics: (objectId: string, physics: PhysicsProperties) => void;
  getObjectPhysics: (objectId: string) => PhysicsProperties | null;
  applyForce: (objectId: string, force: [number, number, number]) => void;

  // Presets
  physicsMaterials: Array<{
    name: string;
    friction: number;
    restitution: number;
    description: string;
  }>;
}

const defaultPhysicsWorld: PhysicsWorld = {
  gravity: [0, -9.81, 0],
  enabled: true,
  paused: false
};

const defaultPhysicsProperties: PhysicsProperties = {
  enabled: false,
  mass: 1.0,
  velocity: [0, 0, 0],
  friction: 0.6,
  restitution: 0.3,
  drag: 0.05,
  gravityScale: 1.0,
  isKinematic: false,
  collider: 'box'
};

const physicsMaterials = [
  { name: 'Steel', friction: 0.7, restitution: 0.1, description: 'Heavy, low bounce' },
  { name: 'Rubber', friction: 1.0, restitution: 0.9, description: 'Very bouncy' },
  { name: 'Ice', friction: 0.1, restitution: 0.05, description: 'Slippery surface' },
  { name: 'Wood', friction: 0.6, restitution: 0.3, description: 'Balanced properties' },
  { name: 'Plastic', friction: 0.4, restitution: 0.5, description: 'Smooth, medium bounce' },
  { name: 'Glass', friction: 0.2, restitution: 0.1, description: 'Smooth, fragile' }
];

const PhysicsContext = createContext<PhysicsContextType | undefined>(undefined);

export function PhysicsProvider({ children }: { children: ReactNode }) {
  const [physicsWorld, setPhysicsWorld] = useState<PhysicsWorld>(defaultPhysicsWorld);
  const [isSimulating, setIsSimulating] = useState(false);
  const [objectPhysics, setObjectPhysics] = useState<Map<string, PhysicsProperties>>(new Map());

  const updateGravity = useCallback((gravity: [number, number, number]) => {
    setPhysicsWorld(prev => ({ ...prev, gravity }));
  }, []);

  const togglePhysics = useCallback(() => {
    setPhysicsWorld(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
    setPhysicsWorld(prev => ({ ...prev, paused: false }));
  }, []);

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsSimulating(false);
    setObjectPhysics(prev => {
      const updated = new Map();
      prev.forEach((physics, objectId) => {
        updated.set(objectId, { ...physics, velocity: [0, 0, 0] });
      });
      return updated;
    });
  }, []);

  const setObjectPhysicsProps = useCallback((objectId: string, physics: PhysicsProperties) => {
    setObjectPhysics(prev => {
      const updated = new Map(prev);
      updated.set(objectId, physics);
      return updated;
    });
  }, []);

  const getObjectPhysics = useCallback((objectId: string): PhysicsProperties | null => {
    return objectPhysics.get(objectId) || null;
  }, [objectPhysics]);

  const applyForce = useCallback((objectId: string, force: [number, number, number]) => {
    const physics = objectPhysics.get(objectId);
    if (!physics || physics.mass === 0) return;

    const acceleration = [
      force[0] / physics.mass,
      force[1] / physics.mass,
      force[2] / physics.mass
    ] as [number, number, number];

    const newVelocity = [
      physics.velocity[0] + acceleration[0] * 0.016, // 60fps timestep
      physics.velocity[1] + acceleration[1] * 0.016,
      physics.velocity[2] + acceleration[2] * 0.016
    ] as [number, number, number];

    setObjectPhysicsProps(objectId, { ...physics, velocity: newVelocity });
  }, [objectPhysics, setObjectPhysicsProps]);

  return (
    <PhysicsContext.Provider value={{
      physicsWorld,
      isSimulating,
      objectPhysics,
      updateGravity,
      togglePhysics,
      startSimulation,
      stopSimulation,
      resetSimulation,
      setObjectPhysics: setObjectPhysicsProps,
      getObjectPhysics,
      applyForce,
      physicsMaterials
    }}>
      {children}
    </PhysicsContext.Provider>
  );
}

export function usePhysics() {
  const context = useContext(PhysicsContext);
  if (context === undefined) {
    throw new Error('usePhysics must be used within a PhysicsProvider');
  }
  return context;
}

export function createDefaultPhysics(): PhysicsProperties {
  return { ...defaultPhysicsProperties };
}
