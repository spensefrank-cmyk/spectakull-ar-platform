export interface PhysicsProperties {
  enabled: boolean;
  mass: number;                    // kg (0 = static/immovable)
  velocity: [number, number, number];  // m/s velocity vector
  friction: number;                // 0-1 surface friction coefficient
  restitution: number;             // 0-1 bounciness/elasticity
  drag: number;                    // 0-1 air resistance
  gravityScale: number;            // gravity multiplier for this object
  isKinematic: boolean;            // controlled by animation, not physics
  collider: 'box' | 'sphere' | 'mesh' | 'capsule'; // collision shape
  constraints?: {
    freezePositionX?: boolean;
    freezePositionY?: boolean;
    freezePositionZ?: boolean;
    freezeRotationX?: boolean;
    freezeRotationY?: boolean;
    freezeRotationZ?: boolean;
  };
}

export interface PhysicsWorld {
  gravity: [number, number, number];  // Global gravity vector
  enabled: boolean;                   // Master physics toggle
  paused: boolean;                    // Pause/resume simulation
}

export interface CollisionEvent {
  objectA: string;                    // Object ID
  objectB: string;                    // Object ID
  contactPoint: [number, number, number];
  timestamp: number;
}
