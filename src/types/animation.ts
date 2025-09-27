export type EasingFunction = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic' | 'back';

export interface Keyframe {
  time: number; // seconds from start
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  opacity?: number;
  easing?: EasingFunction;
  tension?: number; // for elastic/bounce easing
}

export interface MotionPath {
  enabled: boolean;
  points: Array<[number, number, number]>;
  lookAtNext: boolean; // rotate to face direction of movement
  smoothing: number;   // path smoothing 0-1
}

export interface AnimationClip {
  id: string;
  name: string;
  objectId: string;
  keyframes: Keyframe[];
  duration: number;   // total animation duration in seconds
  playing: boolean;
  loop: boolean;
  pingPong: boolean;  // reverse animation on loop
  speed: number;      // playback speed multiplier
  currentTime: number; // current playback time
  motionPath?: MotionPath;
}

export interface AnimationTimeline {
  clips: AnimationClip[];
  globalTime: number;
  playing: boolean;
  loop: boolean;
  duration: number; // total timeline duration
}
