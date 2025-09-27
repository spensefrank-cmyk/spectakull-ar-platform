'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  QrCode, Eye, Users, Clock, MapPin, Smartphone, Monitor, Tablet,
  TrendingUp, Download, Calendar, BarChart3, Globe, Crown, X, Share2
} from 'lucide-react';

interface QRAnalyticsPanelProps {
  qrCodeId?: string;
  projectId?: string;
  onClose?: () => void;
}

export function QRAnalyticsPanel({ qrCodeId, projectId, onClose }: QRAnalyticsPanelProps) {
  const { getQRAnalytics, getProjectQRCodes, qrMetrics } = useAnalytics();
  const { isFeatureAvailable, setShowUpgradeModal } = useSubscription();
  const [selectedQR, setSelectedQR] = useState<string | null>(qrCodeId || null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  // Check if analytics feature is available
  if (!isFeatureAvailable('analytics')) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pro Feature Required</h3>
            <p className="text-gray-600 mb-6">
              QR Code Analytics is a Pro feature. Upgrade to track scans, user locations, and engagement metrics.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const analytics = selectedQR ? getQRAnalytics(selectedQR) : null;
  const projectQRs = projectId ? getProjectQRCodes(projectId) : [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">QR Code Analytics</h2>
                <p className="text-gray-600 text-sm">Track performance and user engagement</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">QR Codes</h3>

              {/* Global Metrics */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Overview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total QR Codes:</span>
                    <span className="font-medium">{qrMetrics.totalQRCodes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Scans:</span>
                    <span className="font-medium">{qrMetrics.totalScans}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Scans/QR:</span>
                    <span className="font-medium">{qrMetrics.averageScansPerQR}</span>
                  </div>
                </div>
              </div>

              {/* QR Code List */}
              <div className="space-y-2">
                {projectQRs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <QrCode className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No QR codes yet</p>
                  </div>
                ) : (
                  projectQRs.map((qr) => (
                    <div
                      key={qr.qrCodeId}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedQR === qr.qrCodeId
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedQR(qr.qrCodeId)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{qr.projectName}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(qr.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {qr.totalScans}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {qr.uniqueScans}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {analytics ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Scans</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.totalScans}</p>
                      </div>
                      <Eye className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Unique Scans</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.uniqueScans}</p>
                      </div>
                      <Users className="w-8 h-8 text-green-500" />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Countries</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.topCountries.length}</p>
                      </div>
                      <Globe className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(analytics.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                </div>

                {/* Device Breakdown */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Device Breakdown</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Smartphone className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{analytics.deviceBreakdown.mobile}</p>
                      <p className="text-sm text-gray-600">Mobile</p>
                    </div>
                    <div className="text-center">
                      <Tablet className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{analytics.deviceBreakdown.tablet}</p>
                      <p className="text-sm text-gray-600">Tablet</p>
                    </div>
                    <div className="text-center">
                      <Monitor className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{analytics.deviceBreakdown.desktop}</p>
                      <p className="text-sm text-gray-600">Desktop</p>
                    </div>
                  </div>
                </div>

                {/* Top Countries */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Top Countries</h4>
                  <div className="space-y-3">
                    {analytics.topCountries.slice(0, 5).map((country, index) => (
                      <div key={country.country} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="font-medium">{country.country}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${(country.scans / analytics.totalScans) * 100}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{country.scans}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share QR Code</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a QR Code</h3>
                <p className="text-gray-600">Choose a QR code from the sidebar to view detailed analytics</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
