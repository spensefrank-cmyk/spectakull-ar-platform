export interface AnalyticsEvent {
  id: string;
  type: 'view' | 'interaction' | 'share' | 'create' | 'error';
  timestamp: number;
  userId?: string;
  sessionId: string;
  projectId?: string;
  data: Record<string, any>;
  location?: {
    latitude: number;
    longitude: number;
    country?: string;
    city?: string;
  };
}

export interface UserSession {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: number;
  interactions: number;
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
  };
}

export interface ProjectAnalytics {
  projectId: string;
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
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  frameRate: number;
  memoryUsage: number;
  errors: number;
}

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
