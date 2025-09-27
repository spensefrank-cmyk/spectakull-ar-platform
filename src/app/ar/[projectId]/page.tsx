'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useAnalytics } from '@/contexts/AnalyticsContext';

export default function ARViewerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { trackQRScan } = useAnalytics();
  const [trackingCompleted, setTrackingCompleted] = useState(false);

  const projectId = params?.projectId as string;
  const qrCodeId = searchParams?.get('qr');

  useEffect(() => {
    // Track QR scan if accessed via QR code
    if (qrCodeId && projectId && !trackingCompleted) {
      trackQRScan(qrCodeId, projectId).then(() => {
        setTrackingCompleted(true);
        console.log('🔍 QR code scan tracked:', qrCodeId);
      });
    }
  }, [qrCodeId, projectId, trackQRScan, trackingCompleted]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* AR Viewer Interface */}
      <div className="text-center text-white p-8">
        <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🥽</span>
        </div>

        <h1 className="text-3xl font-bold mb-4">AR Experience</h1>
        <p className="text-xl text-gray-300 mb-8">
          Project ID: {projectId}
        </p>

        {qrCodeId && (
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 mb-6">
            <p className="text-green-400 text-sm">
              ✅ QR Code scan tracked successfully
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-6 rounded-lg transition-colors">
            📷 Start AR Camera
          </button>

          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors">
            🔗 Share Experience
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          <p>This is a demo AR viewer.</p>
          <p>In production, this would load the full AR experience.</p>
        </div>
      </div>
    </div>
  );
}
