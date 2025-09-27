'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface QRCodeScan {
  id: string;
  qrCodeId: string;
  projectId: string;
  timestamp: number;
  userAgent: string;
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    country?: string;
    city?: string;
    ip?: string;
  };
  referrer?: string;
  sessionId: string;
}

export interface QRCodeAnalytics {
  qrCodeId: string;
  projectId: string;
  projectName: string;
  qrCodeUrl: string;
  createdAt: number;
  totalScans: number;
  uniqueScans: number;
  scans: QRCodeScan[];
  topCountries: Array<{
    country: string;
    scans: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  hourlyScans: number[]; // Last 24 hours
  dailyScans: number[];  // Last 30 days
}

export interface QRCodeMetrics {
  totalQRCodes: number;
  totalScans: number;
  averageScansPerQR: number;
  topPerformingQRs: Array<{
    qrCodeId: string;
    projectName: string;
    scans: number;
  }>;
}

export interface ProjectAnalytics {
  projectId: string;
  projectName: string;
  totalViews: number;
  uniqueViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  shares: number;
  interactions: number;
  topLocations: Array<{
    country: string;
    views: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  popularObjects: Array<{
    type: string;
    interactions: number;
  }>;
  geographicData: Array<{
    country: string;
    users: number;
  }>;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  country?: string;
  city?: string;
  ip?: string;
}

interface AnalyticsContextType {
  // QR Code Analytics
  qrAnalytics: QRCodeAnalytics[];
  qrMetrics: QRCodeMetrics;
  trackQRScan: (qrCodeId: string, projectId: string) => Promise<void>;
  getQRAnalytics: (qrCodeId: string) => QRCodeAnalytics | null;
  getProjectQRCodes: (projectId: string) => QRCodeAnalytics[];
  createQRCode: (projectId: string, projectName: string) => string;
  // Project Analytics
  getAllAnalytics: () => ProjectAnalytics[];
  exportAnalytics: (format: 'csv' | 'json') => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [qrAnalytics, setQrAnalytics] = useState<QRCodeAnalytics[]>([]);
  const [qrMetrics, setQrMetrics] = useState<QRCodeMetrics>({
    totalQRCodes: 0,
    totalScans: 0,
    averageScansPerQR: 0,
    topPerformingQRs: []
  });

  // Load QR analytics from localStorage
  useEffect(() => {
    if (user) {
      const savedQRAnalytics = localStorage.getItem(`spectakull_qr_analytics_${user.id}`);
      if (savedQRAnalytics) {
        try {
          const data = JSON.parse(savedQRAnalytics) as QRCodeAnalytics[];
          setQrAnalytics(data);
          updateQRMetrics(data);
        } catch (error) {
          console.error('Error loading QR analytics:', error);
        }
      }
    }
  }, [user]);

  // Save QR analytics to localStorage
  useEffect(() => {
    if (user && qrAnalytics.length > 0) {
      localStorage.setItem(`spectakull_qr_analytics_${user.id}`, JSON.stringify(qrAnalytics));
      updateQRMetrics(qrAnalytics);
    }
  }, [user, qrAnalytics]);

  const updateQRMetrics = (analytics: QRCodeAnalytics[]) => {
    const totalQRCodes = analytics.length;
    const totalScans = analytics.reduce((sum, qr) => sum + qr.totalScans, 0);
    const averageScansPerQR = totalQRCodes > 0 ? Math.round(totalScans / totalQRCodes) : 0;

    const topPerformingQRs = analytics
      .sort((a, b) => b.totalScans - a.totalScans)
      .slice(0, 5)
      .map(qr => ({
        qrCodeId: qr.qrCodeId,
        projectName: qr.projectName,
        scans: qr.totalScans
      }));

    setQrMetrics({
      totalQRCodes,
      totalScans,
      averageScansPerQR,
      topPerformingQRs
    });
  };

  const createQRCode = useCallback((projectId: string, projectName: string): string => {
    const qrCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const qrCodeUrl = `https://spectakull.com/ar/${projectId}?qr=${qrCodeId}`;

    const newQRAnalytics: QRCodeAnalytics = {
      qrCodeId,
      projectId,
      projectName,
      qrCodeUrl,
      createdAt: Date.now(),
      totalScans: 0,
      uniqueScans: 0,
      scans: [],
      topCountries: [],
      deviceBreakdown: { mobile: 0, tablet: 0, desktop: 0 },
      hourlyScans: new Array(24).fill(0),
      dailyScans: new Array(30).fill(0)
    };

    setQrAnalytics(prev => [...prev, newQRAnalytics]);
    return qrCodeId;
  }, []);

  const trackQRScan = useCallback(async (qrCodeId: string, projectId: string): Promise<void> => {
    // Get device info
    const deviceInfo = getDeviceInfo();

    // Get location (mock for demo - in production use geolocation API)
    const location = await getMockLocation();

    const newScan: QRCodeScan = {
      id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      qrCodeId,
      projectId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      device: deviceInfo,
      location,
      referrer: document.referrer,
      sessionId: `session_${Date.now()}`
    };

    setQrAnalytics(prev => prev.map(qr => {
      if (qr.qrCodeId === qrCodeId) {
        const updatedScans = [...qr.scans, newScan];
        const hour = new Date().getHours();
        const day = Math.floor((Date.now() - qr.createdAt) / (24 * 60 * 60 * 1000));

        const hourlyScans = [...qr.hourlyScans];
        hourlyScans[hour] = (hourlyScans[hour] || 0) + 1;

        const dailyScans = [...qr.dailyScans];
        if (day < 30) {
          dailyScans[day] = (dailyScans[day] || 0) + 1;
        }

        // Update country stats
        const countryStats = qr.topCountries.slice();
        const existingCountry = countryStats.find(c => c.country === location?.country);
        if (existingCountry) {
          existingCountry.scans += 1;
        } else if (location?.country) {
          countryStats.push({ country: location.country, scans: 1 });
        }

        // Update device stats
        const deviceBreakdown = { ...qr.deviceBreakdown };
        deviceBreakdown[deviceInfo.type] += 1;

        // Calculate unique scans (simplified - in production use more sophisticated logic)
        const uniqueScans = new Set(updatedScans.map(s => s.sessionId)).size;

        return {
          ...qr,
          totalScans: qr.totalScans + 1,
          uniqueScans,
          scans: updatedScans,
          hourlyScans,
          dailyScans,
          topCountries: countryStats.sort((a, b) => b.scans - a.scans),
          deviceBreakdown
        };
      }
      return qr;
    }));
  }, []);

  const getQRAnalytics = useCallback((qrCodeId: string): QRCodeAnalytics | null => {
    return qrAnalytics.find(qr => qr.qrCodeId === qrCodeId) || null;
  }, [qrAnalytics]);

  const getProjectQRCodes = useCallback((projectId: string): QRCodeAnalytics[] => {
    return qrAnalytics.filter(qr => qr.projectId === projectId);
  }, [qrAnalytics]);

  const getAllAnalytics = useCallback((): ProjectAnalytics[] => {
    // Mock analytics data for demo purposes
    return [
      {
        projectId: 'proj_1',
        projectName: 'Product Showcase',
        totalViews: 1234,
        uniqueViews: 892,
        averageSessionDuration: 45,
        bounceRate: 0.23,
        shares: 67,
        interactions: 234,
        topLocations: [
          { country: 'United States', views: 456 },
          { country: 'United Kingdom', views: 234 },
          { country: 'Germany', views: 123 }
        ],
        deviceBreakdown: { mobile: 789, tablet: 234, desktop: 211 },
        popularObjects: [
          { type: 'cube', interactions: 123 },
          { type: 'sphere', interactions: 89 }
        ],
        geographicData: [
          { country: 'United States', users: 234 },
          { country: 'United Kingdom', users: 123 }
        ]
      }
    ];
  }, []);

  const exportAnalytics = useCallback((format: 'csv' | 'json') => {
    const analytics = getAllAnalytics();
    const dataStr = format === 'json'
      ? JSON.stringify(analytics, null, 2)
      : 'projectId,projectName,totalViews,uniqueViews\n' +
        analytics.map(a => `${a.projectId},${a.projectName},${a.totalViews},${a.uniqueViews}`).join('\n');

    const dataBlob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  }, [getAllAnalytics]);

  return (
    <AnalyticsContext.Provider value={{
      qrAnalytics,
      qrMetrics,
      trackQRScan,
      getQRAnalytics,
      getProjectQRCodes,
      createQRCode,
      getAllAnalytics,
      exportAnalytics
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// Helper functions
function getDeviceInfo(): DeviceInfo {
  const userAgent = navigator.userAgent;
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';

  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
    deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
  }

  let os = 'Unknown';
  if (/Windows/.test(userAgent)) os = 'Windows';
  else if (/Mac/.test(userAgent)) os = 'macOS';
  else if (/Linux/.test(userAgent)) os = 'Linux';
  else if (/Android/.test(userAgent)) os = 'Android';
  else if (/iPhone|iPad/.test(userAgent)) os = 'iOS';

  let browser = 'Unknown';
  if (/Chrome/.test(userAgent)) browser = 'Chrome';
  else if (/Firefox/.test(userAgent)) browser = 'Firefox';
  else if (/Safari/.test(userAgent)) browser = 'Safari';
  else if (/Edge/.test(userAgent)) browser = 'Edge';

  return { type: deviceType, os, browser };
}

async function getMockLocation(): Promise<LocationInfo> {
  // Mock location data for demo - in production use geolocation API
  const mockLocations = [
    { latitude: 40.7128, longitude: -74.0060, country: 'United States', city: 'New York' },
    { latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', city: 'London' },
    { latitude: 52.5200, longitude: 13.4050, country: 'Germany', city: 'Berlin' },
    { latitude: 48.8566, longitude: 2.3522, country: 'France', city: 'Paris' }
  ];

  return mockLocations[Math.floor(Math.random() * mockLocations.length)];
}
