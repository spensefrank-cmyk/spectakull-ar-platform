'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  BarChart3, TrendingUp, Users, Eye, QrCode, Download,
  Calendar, Globe, Smartphone, Monitor, Tablet, Crown
} from 'lucide-react';

export default function AnalyticsPage() {
  const { qrAnalytics, qrMetrics, exportAnalytics } = useAnalytics();
  const { isFeatureAvailable, setShowUpgradeModal } = useSubscription();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Check if analytics feature is available
  if (!isFeatureAvailable('analytics')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Pro Feature Required</h2>
          <p className="text-white/80 mb-6">
            Advanced analytics and insights are available with Pro subscription.
            Track user engagement, geographic data, and performance metrics.
          </p>
          <Button
            onClick={() => setShowUpgradeModal(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const totalViews = qrAnalytics.reduce((sum, qr) => sum + qr.totalScans, 0);
  const totalUnique = qrAnalytics.reduce((sum, qr) => sum + qr.uniqueScans, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-white/70">Track your AR experience performance and user engagement</p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value as typeof selectedTimeRange)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => exportAnalytics('csv')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => exportAnalytics('json')}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Total Views</p>
                <p className="text-3xl font-bold text-white">{formatNumber(totalViews)}</p>
              </div>
              <Eye className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm font-medium">+12%</span>
              <span className="text-white/60 text-sm ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Unique Viewers</p>
                <p className="text-3xl font-bold text-white">{formatNumber(totalUnique)}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm font-medium">+8%</span>
              <span className="text-white/60 text-sm ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">QR Codes</p>
                <p className="text-3xl font-bold text-white">{qrMetrics.totalQRCodes}</p>
              </div>
              <QrCode className="w-8 h-8 text-purple-400" />
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-white/60 text-sm">
                Avg {qrMetrics.averageScansPerQR} scans per QR
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Total Scans</p>
                <p className="text-3xl font-bold text-white">{formatNumber(qrMetrics.totalScans)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-400" />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm font-medium">+15%</span>
              <span className="text-white/60 text-sm ml-1">vs last period</span>
            </div>
          </div>
        </div>

        {/* QR Code Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Top Performing QR Codes</h3>
            <div className="space-y-4">
              {qrMetrics.topPerformingQRs.length === 0 ? (
                <div className="text-center py-8">
                  <QrCode className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/60">No QR codes yet</p>
                  <p className="text-white/40 text-sm">Create AR experiences to start tracking</p>
                </div>
              ) : (
                qrMetrics.topPerformingQRs.map((qr, index) => (
                  <div key={qr.qrCodeId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{qr.projectName}</p>
                        <p className="text-white/60 text-sm">QR Code</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{qr.scans}</p>
                      <p className="text-white/60 text-sm">scans</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Device Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-6 h-6 text-blue-400" />
                  <span className="text-white">Mobile</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-white/20 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-white font-medium w-8 text-right">65%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-6 h-6 text-green-400" />
                  <span className="text-white">Desktop</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-white/20 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-white font-medium w-8 text-right">25%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Tablet className="w-6 h-6 text-purple-400" />
                  <span className="text-white">Tablet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-white/20 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  <span className="text-white font-medium w-8 text-right">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent QR Code Activity</h3>
          <div className="space-y-3">
            {qrAnalytics.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60">No activity yet</p>
                <p className="text-white/40 text-sm">QR code scans will appear here</p>
              </div>
            ) : (
              qrAnalytics.slice(0, 5).map((qr) => (
                <div key={qr.qrCodeId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <QrCode className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-white font-medium">{qr.projectName}</p>
                      <p className="text-white/60 text-sm">
                        Created {new Date(qr.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{qr.totalScans} scans</p>
                    <p className="text-white/60 text-sm">{qr.uniqueScans} unique</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
