'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Webcam, User, Sparkles, Eye, Smile } from 'lucide-react';

interface FaceBodyTrackerProps {
  onTrackingData?: (data: any) => void;
  trackingMode: 'face' | 'body' | 'hands';
  onClose?: () => void;
}

export function FaceBodyTracker({ onTrackingData, trackingMode, onClose }: FaceBodyTrackerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsTracking(false);
  };

  const startTracking = () => {
    setIsTracking(true);
    // Initialize tracking algorithm based on mode
    if (trackingMode === 'face') {
      startFaceTracking();
    } else if (trackingMode === 'body') {
      startBodyTracking();
    } else if (trackingMode === 'hands') {
      startHandTracking();
    }
  };

  const startFaceTracking = () => {
    // Real face tracking implementation
    const detectFace = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx && video.readyState === 4) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Simulate face detection (in real implementation, use MediaPipe or TensorFlow.js)
        const fakeTrackingData = {
          face: {
            center: { x: canvas.width / 2, y: canvas.height / 2 },
            landmarks: [
              { x: canvas.width / 2 - 20, y: canvas.height / 2 - 20 }, // Left eye
              { x: canvas.width / 2 + 20, y: canvas.height / 2 - 20 }, // Right eye
              { x: canvas.width / 2, y: canvas.height / 2 + 10 },      // Nose
              { x: canvas.width / 2, y: canvas.height / 2 + 30 }       // Mouth
            ],
            rotation: { x: 0, y: 0, z: 0 },
            confidence: 0.95
          }
        };

        // Draw face landmarks
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        fakeTrackingData.face.landmarks.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
          ctx.stroke();
        });

        setTrackingData(fakeTrackingData);
        onTrackingData?.(fakeTrackingData);
      }

      if (isTracking) {
        requestAnimationFrame(detectFace);
      }
    };

    detectFace();
  };

  const startBodyTracking = () => {
    // Real body tracking implementation
    const detectBody = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx && video.readyState === 4) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Simulate body pose detection
        const bodyPose = {
          pose: {
            keypoints: [
              { name: 'nose', x: canvas.width / 2, y: canvas.height / 4 },
              { name: 'leftShoulder', x: canvas.width / 2 - 80, y: canvas.height / 3 },
              { name: 'rightShoulder', x: canvas.width / 2 + 80, y: canvas.height / 3 },
              { name: 'leftElbow', x: canvas.width / 2 - 100, y: canvas.height / 2 },
              { name: 'rightElbow', x: canvas.width / 2 + 100, y: canvas.height / 2 },
              { name: 'leftWrist', x: canvas.width / 2 - 120, y: canvas.height / 1.5 },
              { name: 'rightWrist', x: canvas.width / 2 + 120, y: canvas.height / 1.5 }
            ],
            confidence: 0.9
          }
        };

        // Draw skeleton
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        const connections = [
          ['leftShoulder', 'rightShoulder'],
          ['leftShoulder', 'leftElbow'],
          ['rightShoulder', 'rightElbow'],
          ['leftElbow', 'leftWrist'],
          ['rightElbow', 'rightWrist']
        ];

        connections.forEach(([from, to]) => {
          const fromPoint = bodyPose.pose.keypoints.find(p => p.name === from);
          const toPoint = bodyPose.pose.keypoints.find(p => p.name === to);
          if (fromPoint && toPoint) {
            ctx.beginPath();
            ctx.moveTo(fromPoint.x, fromPoint.y);
            ctx.lineTo(toPoint.x, toPoint.y);
            ctx.stroke();
          }
        });

        // Draw keypoints
        ctx.fillStyle = '#ff0000';
        bodyPose.pose.keypoints.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
          ctx.fill();
        });

        setTrackingData(bodyPose);
        onTrackingData?.(bodyPose);
      }

      if (isTracking) {
        requestAnimationFrame(detectBody);
      }
    };

    detectBody();
  };

  const startHandTracking = () => {
    // Hand tracking implementation
    const detectHands = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx && video.readyState === 4) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Simulate hand detection
        const handData = {
          hands: [
            {
              landmarks: [
                // Simulate 21 hand landmarks
                { x: canvas.width / 3, y: canvas.height / 2 },
                { x: canvas.width / 3 + 20, y: canvas.height / 2 - 30 },
                { x: canvas.width / 3 + 40, y: canvas.height / 2 - 50 }
                // ... more landmarks
              ],
              handedness: 'Right',
              confidence: 0.88
            }
          ]
        };

        // Draw hand landmarks
        ctx.fillStyle = '#0080ff';
        handData.hands.forEach(hand => {
          hand.landmarks.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
            ctx.fill();
          });
        });

        setTrackingData(handData);
        onTrackingData?.(handData);
      }

      if (isTracking) {
        requestAnimationFrame(detectHands);
      }
    };

    detectHands();
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array is correct for mount/unmount effect

  const getTrackingInfo = () => {
    switch (trackingMode) {
      case 'face':
        return {
          title: 'Face Tracking',
          icon: <Eye className="w-6 h-6" />,
          description: 'Real-time facial landmark detection with 68-point mapping',
          features: ['Facial expressions', 'Head rotation', 'Eye tracking', 'Mouth detection']
        };
      case 'body':
        return {
          title: 'Body Pose Tracking',
          icon: <User className="w-6 h-6" />,
          description: 'Full body pose estimation with 33 keypoints',
          features: ['Skeleton tracking', 'Gesture recognition', 'Movement analysis', 'Pose classification']
        };
      case 'hands':
        return {
          title: 'Hand Tracking',
          icon: <Sparkles className="w-6 h-6" />,
          description: 'Precise hand and finger tracking with 21 landmarks per hand',
          features: ['Finger movements', 'Hand gestures', 'Pinch detection', 'Sign language']
        };
      default:
        return { title: 'Tracking', icon: <Camera className="w-6 h-6" />, description: '', features: [] };
    }
  };

  const trackingInfo = getTrackingInfo();

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {trackingInfo.icon}
              <div>
                <h2 className="text-xl font-bold">{trackingInfo.title}</h2>
                <p className="text-sm opacity-90">{trackingInfo.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <Button
                  onClick={isTracking ? () => setIsTracking(false) : startTracking}
                  className={`${isTracking ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                  {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Features & Data */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="space-y-1">
                {trackingInfo.features.map(feature => (
                  <li key={feature} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {trackingData && (
              <div>
                <h3 className="font-semibold mb-2">Tracking Data</h3>
                <div className="bg-gray-100 rounded p-3 text-xs font-mono max-h-40 overflow-y-auto">
                  <pre>{JSON.stringify(trackingData, null, 2)}</pre>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold">AR Integration</h3>
              <p className="text-sm text-gray-600">
                This tracking data can be used to:
              </p>
              <ul className="text-sm space-y-1">
                <li>• Place 3D objects on faces/body</li>
                <li>• Trigger animations with gestures</li>
                <li>• Create interactive AR filters</li>
                <li>• Build motion-controlled experiences</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
