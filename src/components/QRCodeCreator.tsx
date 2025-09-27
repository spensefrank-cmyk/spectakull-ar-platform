'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscription, SubscriptionFeatures } from '@/contexts/SubscriptionContext';
import { QrCode, Download, Share2, Copy, Eye, Settings, Crown, BarChart3, AlertTriangle } from 'lucide-react';
import { QRAnalyticsDashboard } from './QRAnalyticsDashboard';

interface QRCodeCreatorProps {
  projectId: string;
  projectName: string;
  onClose?: () => void;
}

export function QRCodeCreator({ projectId, projectName, onClose }: QRCodeCreatorProps) {
  const { currentTier, canCreateQRCode, setShowUpgradeModal, getProjectAnalytics } = useSubscription();
  const [qrSize, setQrSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState('M');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [qrCodeId, setQrCodeId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectUrl, setProjectUrl] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [projectAnalytics, setProjectAnalytics] = useState(getProjectAnalytics(projectId));

  // Check if user has access to QR code generation
  const hasAccess = canCreateQRCode();
  const isWhiteLabel = currentTier === 'white-label';
  const hasAnalytics = currentTier !== 'free';

  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://spectakull.com';
    setProjectUrl(`${baseUrl}/ar/${projectId}`);
  }, [projectId]);

  // Auto-generate QR code when component loads
  useEffect(() => {
    if (hasAccess) {
      generateQRCode();
    }
  }, [hasAccess]);

  // Refresh analytics data
  useEffect(() => {
    setProjectAnalytics(getProjectAnalytics(projectId));
  }, [projectId, getProjectAnalytics]);

  const generateQRCode = useCallback(async () => {
    if (!hasAccess) {
      setShowUpgradeModal(true);
      return;
    }

    setIsGenerating(true);

    try {
      // Create unique QR code for this project
      const uniqueQrId = await (window as any).spectakullQR?.createQRCodeForProject?.(projectId) ||
                         `qr_${projectId}_${Date.now()}`;
      setQrCodeId(uniqueQrId);

      // Generate QR code with tracking URL
      const trackingUrl = `${projectUrl}?qr=${uniqueQrId}`;

      // Create QR code with embedded Spectakull branding
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = qrSize;
      canvas.height = qrSize;

      // Generate QR code pattern (simplified for demo)
      const modules = generateQRPattern(trackingUrl, errorLevel);
      const moduleSize = qrSize / modules.length;

      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, qrSize, qrSize);

      // Draw QR code
      ctx.fillStyle = '#000000';
      for (let row = 0; row < modules.length; row++) {
        for (let col = 0; col < modules[row].length; col++) {
          if (modules[row][col]) {
            ctx.fillRect(
              col * moduleSize,
              row * moduleSize,
              moduleSize,
              moduleSize
            );
          }
        }
      }

      // Add Spectakull branding in center (unless white-label)
      if (!isWhiteLabel) {
        const centerX = qrSize / 2;
        const centerY = qrSize / 2;
        const brandingSize = qrSize * 0.15;

        // Clear center area
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(
          centerX - brandingSize,
          centerY - brandingSize,
          brandingSize * 2,
          brandingSize * 2
        );

        // Add border
        ctx.strokeStyle = '#004AAD';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          centerX - brandingSize,
          centerY - brandingSize,
          brandingSize * 2,
          brandingSize * 2
        );

        // Add text
        ctx.fillStyle = '#004AAD';
        ctx.font = `${brandingSize * 0.3}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SPECTAKULL', centerX, centerY);
      }

      setQrCodeDataUrl(canvas.toDataURL('image/png'));

      // Refresh analytics after QR creation
      setTimeout(() => {
        setProjectAnalytics(getProjectAnalytics(projectId));
      }, 500);

      console.log('🎯 QR Code generated with analytics tracking:', {
        projectId,
        qrCodeId: uniqueQrId,
        trackingUrl
      });

    } catch (error) {
      console.error('QR generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [hasAccess, setShowUpgradeModal, qrSize, projectUrl, errorLevel, isWhiteLabel, projectId, getProjectAnalytics]);

  // Simplified QR pattern generator (in production, use proper QR library)
  const generateQRPattern = (text: string, errorLevel: string) => {
    const size = 25; // 25x25 modules for demo
    const pattern = Array(size).fill(null).map(() => Array(size).fill(false));

    // Add finder patterns (corners)
    addFinderPattern(pattern, 0, 0);
    addFinderPattern(pattern, size - 7, 0);
    addFinderPattern(pattern, 0, size - 7);

    // Add some data pattern (simplified)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!isFinderPattern(i, j, size)) {
          pattern[i][j] = Math.random() > 0.5;
        }
      }
    }

    return pattern;
  };

  const addFinderPattern = (pattern: boolean[][], startX: number, startY: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const shouldFill =
          i === 0 || i === 6 || j === 0 || j === 6 ||
          (i >= 2 && i <= 4 && j >= 2 && j <= 4);
        pattern[startX + i][startY + j] = shouldFill;
      }
    }
  };

  const isFinderPattern = (x: number, y: number, size: number) => {
    return (
      (x < 7 && y < 7) ||
      (x < 7 && y >= size - 7) ||
      (x >= size - 7 && y < 7)
    );
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.download = `spectakull-qr-${projectName}-${Date.now()}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      alert('QR Code URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = projectUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('QR Code URL copied to clipboard!');
    }
  };

  const shareQRCode = async () => {
    if (navigator.share && qrCodeDataUrl) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(qrCodeDataUrl);
        const blob = await response.blob();
        const file = new File([blob], `spectakull-qr-${projectName}.png`, { type: 'image/png' });

        await navigator.share({
          title: `AR Experience: ${projectName}`,
          text: `Check out this AR experience created with Spectakull!`,
          url: projectUrl,
          files: [file]
        });
      } catch (error) {
        console.error('Sharing failed:', error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  if (!hasAccess) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">QR Code Generation</h2>
          <p className="text-gray-600 mb-4">
            QR code generation and publishing are available with Business Card, Pro, Enterprise, and White Label plans.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 text-blue-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Free Plan Limitation</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              You can create projects but need to upgrade to share them via QR codes.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button
              onClick={() => setShowUpgradeModal(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Upgrade Plan
            </Button>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Current plan: {currentTier || 'Free'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">

        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">QR Code Generator</h2>
              <p className="text-gray-600">Create a unique QR code for: {projectName}</p>
            </div>
            <div className="flex items-center space-x-2">
              {hasAnalytics && projectAnalytics && (
                <Button
                  variant="outline"
                  onClick={() => setShowAnalytics(true)}
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                  {projectAnalytics.totalScans > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {projectAnalytics.totalScans}
                    </span>
                  )}
                </Button>
              )}
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* QR Code Display */}
          <div className="text-center">
            {isGenerating ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Generating unique QR code with analytics tracking...</p>
              </div>
            ) : qrCodeDataUrl ? (
              <div className="space-y-4">
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                  <img
                    src={qrCodeDataUrl}
                    alt={`QR Code for ${projectName}`}
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    QR Code ID: <span className="font-mono text-xs">{qrCodeId}</span>
                  </p>
                  {projectAnalytics && (
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span>{projectAnalytics.totalScans} scans</span>
                      </span>
                      {projectAnalytics.lastScanAt && (
                        <span className="text-gray-500">
                          Last: {new Date(projectAnalytics.lastScanAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* URL Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">AR Experience URL:</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={projectUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
              />
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* QR Code Settings */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Size (pixels):</label>
              <select
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={128}>128x128</option>
                <option value={256}>256x256</option>
                <option value={512}>512x512</option>
                <option value={1024}>1024x1024</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Error Correction:</label>
              <select
                value={errorLevel}
                onChange={(e) => setErrorLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="L">Low (~7%)</option>
                <option value="M">Medium (~15%)</option>
                <option value="Q">Quartile (~25%)</option>
                <option value="H">High (~30%)</option>
              </select>
            </div>
          </div>

          {/* Branding Info */}
          {!isWhiteLabel && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-blue-800 mb-2">
                <Crown className="w-4 h-4" />
                <span className="font-medium">Spectakull Branded</span>
              </div>
              <p className="text-sm text-blue-700">
                QR codes include Spectakull branding. Upgrade to White Label plan for custom branding.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={generateQRCode}
              disabled={isGenerating}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <QrCode className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Regenerate QR Code'}
            </Button>

            {qrCodeDataUrl && (
              <>
                <Button
                  variant="outline"
                  onClick={downloadQRCode}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>

                <Button
                  variant="outline"
                  onClick={shareQRCode}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </>
            )}
          </div>

          {/* Analytics Preview */}
          {hasAnalytics && projectAnalytics && projectAnalytics.totalScans > 0 && (
            <div className="bg-gray-50 border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Quick Analytics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{projectAnalytics.totalScans}</div>
                  <div className="text-sm text-gray-600">Total Scans</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {projectAnalytics.dailyScans.slice(-7).reduce((sum, day) => sum + day.count, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Last 7 Days</div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowAnalytics(true)}
                className="w-full mt-3"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Detailed Analytics
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Dashboard Modal */}
      {showAnalytics && (
        <QRAnalyticsDashboard
          projectId={projectId}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </div>
  );
}
