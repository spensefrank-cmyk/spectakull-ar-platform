'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RealWebAR } from '@/components/RealWebAR';
import { useSubscription } from '@/contexts/SubscriptionContext';
import Link from 'next/link';
import { ArrowLeft, Eye, QrCode, Share2 } from 'lucide-react';

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

interface ARProjectClientProps {
  projectId: string;
}

export default function ARProjectClient({ projectId }: ARProjectClientProps) {
  const { getProjectAnalytics } = useSubscription();
  const [project, setProject] = useState<any>(null);
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadProject = async () => {
      try {
        console.log('🎯 Loading AR project:', projectId);

        // Check if this is a QR code scan with tracking
        const urlParams = new URLSearchParams(window.location.search);
        const qrId = urlParams.get('qr');

        if (qrId) {
          console.log('📊 QR code scan detected:', qrId);
          // Track the QR code scan
          if (typeof window !== 'undefined' && (window as any).spectakullQR) {
            await (window as any).spectakullQR.trackQRScan(qrId);
          }
        }

        // Load project data (mock data for demo)
        const mockProject = {
          id: projectId,
          name: `AR Project ${projectId}`,
          description: 'An immersive AR experience',
          createdAt: new Date().toISOString(),
          objects: [
            {
              id: 'obj1',
              type: 'cube',
              name: 'Demo Cube',
              position: [0, 0, -2] as [number, number, number],
              rotation: [0, 45, 0] as [number, number, number],
              scale: [1, 1, 1] as [number, number, number],
              color: '#3b82f6',
              visible: true,
              src: 'https://threejs.org/examples/models/gltf/Lantern/glTF/Lantern.gltf'
            },
            {
              id: 'obj2',
              type: 'sphere',
              name: 'Demo Sphere',
              position: [2, 1, -3] as [number, number, number],
              rotation: [0, 0, 0] as [number, number, number],
              scale: [0.8, 0.8, 0.8] as [number, number, number],
              color: '#ef4444',
              visible: true
            }
          ]
        };

        setProject(mockProject);
        setObjects(mockProject.objects);

        // Get analytics if available
        const analytics = getProjectAnalytics(projectId);
        if (analytics) {
          console.log('📊 Project analytics:', analytics);
        }

      } catch (err: any) {
        console.error('❌ Failed to load project:', err);
        setError('Failed to load AR project. Please check the link and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId, getProjectAnalytics]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading AR Experience</h2>
          <p className="text-blue-200">Preparing your immersive experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <Button asChild className="bg-white text-red-900 hover:bg-gray-100">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-4">Project Not Available</h2>
          <p className="text-white/80 mb-6">
            This AR project may have been deleted or is no longer accessible.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/studio">Create Your Own</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="text-white hover:bg-white/10">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">{project.name}</h1>
              <p className="text-sm text-white/70">{project.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-white/80">
              <Eye className="w-4 h-4" />
              <span className="text-sm">AR Viewer</span>
            </div>
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* AR Experience */}
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          {/* Instructions */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <QrCode className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-semibold">AR Experience Ready</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <span>Allow camera access when prompted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <span>Point your device at a flat surface</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <span>Tap to place AR objects</span>
              </div>
            </div>
          </div>

          {/* AR Viewer */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden">
            <RealWebAR
              objects={objects}
              mode="floor"
              className="w-full h-[600px]"
            />
          </div>

          {/* Project Info */}
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">About This Experience</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Project Details</h4>
                <div className="space-y-2 text-sm text-white/80">
                  <div>Project ID: {project.id}</div>
                  <div>Objects: {objects.filter(obj => obj.visible).length}</div>
                  <div>Created: {new Date(project.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">AR Objects</h4>
                <div className="space-y-1">
                  {objects.filter(obj => obj.visible).map(obj => (
                    <div key={obj.id} className="text-sm text-white/80 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span>{obj.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 text-center">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Create Your Own AR Experience</h3>
              <p className="text-cyan-100 mb-4">
                Build professional AR projects with Spectakull's no-code AR platform
              </p>
              <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/studio">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
