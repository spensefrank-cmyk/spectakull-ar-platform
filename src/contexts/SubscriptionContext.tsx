'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type SubscriptionTier = 'free' | 'business-card' | 'pro' | 'enterprise' | 'white-label';

export interface SubscriptionFeatures {
  maxProjects: number;
  additionalProjectPrice?: number; // For business card tier
  qrCodeGeneration: boolean;
  publishing: boolean;
  liveARPreview: boolean;
  analytics: boolean;
  qrCodeAnalytics: boolean;
  collaboration: boolean;
  customBranding: boolean;
  teamManagement: boolean;
  priority_support: boolean;
  storageGB: number;
}

export interface ProjectAnalytics {
  projectId: string;
  qrCodeId?: string;
  totalScans: number;
  dailyScans: { date: string; count: number }[];
  hourlyBreakdown: { hour: number; count: number }[];
  lastScanAt?: string;
  createdAt: string;
}

export interface TeamSubscription {
  id: string;
  name: string;
  tier: SubscriptionTier;
  members: Array<{
    id: string;
    email: string;
    role: 'owner' | 'admin' | 'member';
    joinedAt: string;
  }>;
  features: SubscriptionFeatures;
  billingCycle: 'monthly' | 'yearly';
  expiresAt: string;
}

interface SubscriptionContextType {
  currentTier: SubscriptionTier;
  features: SubscriptionFeatures;
  projectCount: number;
  additionalProjects: number; // For business card tier
  isFeatureAvailable: (feature: keyof SubscriptionFeatures) => boolean;
  canCreateProject: () => boolean;
  canCreateQRCode: () => boolean;
  upgradeRequired: (feature: keyof SubscriptionFeatures) => boolean;
  purchaseAdditionalProject: () => Promise<boolean>;
  getProjectAnalytics: (projectId: string) => ProjectAnalytics | null;
  getAllAnalytics: () => ProjectAnalytics[];

  // Team management
  currentTeam: TeamSubscription | null;
  teams: TeamSubscription[];
  createTeam: (name: string, tier: SubscriptionTier) => Promise<void>;
  joinTeam: (teamId: string, inviteCode: string) => Promise<void>;
  switchTeam: (teamId: string) => void;
  inviteToTeam: (email: string, role: 'admin' | 'member') => Promise<void>;
  leaveTeam: (teamId: string) => Promise<void>;

  // Upgrade flows
  upgradeTo: (tier: SubscriptionTier) => Promise<void>;
  setShowUpgradeModal: (show: boolean) => void;
  showUpgradeModal: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Updated subscription tier features
const TIER_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    maxProjects: 3,
    qrCodeGeneration: false, // KEY CHANGE: Free tier cannot create QR codes
    publishing: false, // KEY CHANGE: Free tier cannot publish/share
    liveARPreview: true,
    analytics: false,
    qrCodeAnalytics: false,
    collaboration: false,
    customBranding: false,
    teamManagement: false,
    priority_support: false,
    storageGB: 1,
  },
  'business-card': {
    maxProjects: 1, // Starts with 1 project
    additionalProjectPrice: 10, // $10 per additional project
    qrCodeGeneration: true,
    publishing: true,
    liveARPreview: true,
    analytics: true,
    qrCodeAnalytics: true, // Each project gets unique QR with analytics
    collaboration: false,
    customBranding: false,
    teamManagement: false,
    priority_support: false,
    storageGB: 5,
  },
  pro: {
    maxProjects: 7, // $39.99 tier gets 7 projects
    qrCodeGeneration: true,
    publishing: true,
    liveARPreview: true,
    analytics: true,
    qrCodeAnalytics: true,
    collaboration: true,
    customBranding: false,
    teamManagement: false,
    priority_support: true,
    storageGB: 25,
  },
  enterprise: {
    maxProjects: 50,
    qrCodeGeneration: true,
    publishing: true,
    liveARPreview: true,
    analytics: true,
    qrCodeAnalytics: true,
    collaboration: true,
    customBranding: true,
    teamManagement: true,
    priority_support: true,
    storageGB: 100,
  },
  'white-label': {
    maxProjects: 200,
    qrCodeGeneration: true,
    publishing: true,
    liveARPreview: true,
    analytics: true,
    qrCodeAnalytics: true,
    collaboration: true,
    customBranding: true,
    teamManagement: true,
    priority_support: true,
    storageGB: 500,
  },
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('free');
  const [projectCount, setProjectCount] = useState(0);
  const [additionalProjects, setAdditionalProjects] = useState(0); // For business card tier
  const [projectAnalytics, setProjectAnalytics] = useState<ProjectAnalytics[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Team management state
  const [currentTeam, setCurrentTeam] = useState<TeamSubscription | null>(null);
  const [teams, setTeams] = useState<TeamSubscription[]>([]);

  const features = TIER_FEATURES[currentTier];

  // Calculate actual project limit for business card tier
  const getActualProjectLimit = () => {
    if (currentTier === 'business-card') {
      return features.maxProjects + additionalProjects;
    }
    return features.maxProjects;
  };

  const isFeatureAvailable = (feature: keyof SubscriptionFeatures): boolean => {
    return features[feature] as boolean;
  };

  const canCreateProject = (): boolean => {
    const actualLimit = getActualProjectLimit();
    return projectCount < actualLimit;
  };

  const canCreateQRCode = (): boolean => {
    return isFeatureAvailable('qrCodeGeneration');
  };

  const upgradeRequired = (feature: keyof SubscriptionFeatures): boolean => {
    return !isFeatureAvailable(feature);
  };

  // Purchase additional project for business card tier
  const purchaseAdditionalProject = async (): Promise<boolean> => {
    if (currentTier !== 'business-card') return false;

    try {
      // In real implementation, this would call Stripe for $10 charge
      console.log('💳 Purchasing additional project for $10');

      // Simulate successful payment
      setAdditionalProjects(prev => prev + 1);

      // Track analytics
      console.log('📊 Additional project purchased:', {
        tier: currentTier,
        additionalProjects: additionalProjects + 1,
        totalProjectLimit: features.maxProjects + additionalProjects + 1
      });

      return true;
    } catch (error) {
      console.error('❌ Failed to purchase additional project:', error);
      return false;
    }
  };

  // Analytics functions
  const getProjectAnalytics = (projectId: string): ProjectAnalytics | null => {
    return projectAnalytics.find(analytics => analytics.projectId === projectId) || null;
  };

  const getAllAnalytics = (): ProjectAnalytics[] => {
    return projectAnalytics;
  };

  // Create unique QR code with analytics tracking
  const createQRCodeForProject = async (projectId: string): Promise<string> => {
    if (!canCreateQRCode()) {
      throw new Error('QR code creation requires subscription upgrade');
    }

    const qrCodeId = `qr_${projectId}_${Date.now()}`;

    // Initialize analytics for this QR code
    const newAnalytics: ProjectAnalytics = {
      projectId,
      qrCodeId,
      totalScans: 0,
      dailyScans: [],
      hourlyBreakdown: Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 })),
      createdAt: new Date().toISOString()
    };

    setProjectAnalytics(prev => [...prev, newAnalytics]);

    console.log('🎯 Created unique QR code with analytics:', qrCodeId);
    return qrCodeId;
  };

  // Track QR code scan
  const trackQRScan = async (qrCodeId: string) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const hour = now.getHours();

    setProjectAnalytics(prev => prev.map(analytics => {
      if (analytics.qrCodeId === qrCodeId) {
        // Update total scans
        const updatedAnalytics = {
          ...analytics,
          totalScans: analytics.totalScans + 1,
          lastScanAt: now.toISOString()
        };

        // Update daily scans
        const existingDay = updatedAnalytics.dailyScans.find(day => day.date === today);
        if (existingDay) {
          existingDay.count += 1;
        } else {
          updatedAnalytics.dailyScans.push({ date: today, count: 1 });
        }

        // Update hourly breakdown
        const hourData = updatedAnalytics.hourlyBreakdown.find(h => h.hour === hour);
        if (hourData) {
          hourData.count += 1;
        }

        console.log('📊 QR Scan tracked:', {
          qrCodeId,
          totalScans: updatedAnalytics.totalScans,
          date: today,
          hour
        });

        return updatedAnalytics;
      }
      return analytics;
    }));
  };

  // Team management functions
  const createTeam = async (name: string, tier: SubscriptionTier) => {
    const newTeam: TeamSubscription = {
      id: `team_${Date.now()}`,
      name,
      tier,
      members: [{
        id: user?.id || 'user_1',
        email: user?.email || 'user@example.com',
        role: 'owner',
        joinedAt: new Date().toISOString()
      }],
      features: TIER_FEATURES[tier],
      billingCycle: 'monthly',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    setTeams(prev => [...prev, newTeam]);
    setCurrentTeam(newTeam);
    setCurrentTier(tier);
  };

  const joinTeam = async (teamId: string, inviteCode: string) => {
    console.log('Joining team:', teamId, 'with code:', inviteCode);
  };

  const switchTeam = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setCurrentTeam(team);
      setCurrentTier(team.tier);
    }
  };

  const inviteToTeam = async (email: string, role: 'admin' | 'member') => {
    console.log('Inviting to team:', email, 'as', role);
  };

  const leaveTeam = async (teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
    if (currentTeam?.id === teamId) {
      setCurrentTeam(null);
      setCurrentTier('free');
    }
  };

  const upgradeTo = async (tier: SubscriptionTier) => {
    setCurrentTier(tier);
    console.log('🚀 Upgraded to:', tier);
  };

  // Expose QR functions to global context
  const contextValue: SubscriptionContextType = {
    currentTier,
    features,
    projectCount,
    additionalProjects,
    isFeatureAvailable,
    canCreateProject,
    canCreateQRCode,
    upgradeRequired,
    purchaseAdditionalProject,
    getProjectAnalytics,
    getAllAnalytics,
    currentTeam,
    teams,
    createTeam,
    joinTeam,
    switchTeam,
    inviteToTeam,
    leaveTeam,
    upgradeTo,
    setShowUpgradeModal,
    showUpgradeModal,
  };

  // Add QR functions to window for global access
  useEffect(() => {
    (window as any).spectakullQR = {
      createQRCodeForProject,
      trackQRScan
    };
  }, [createQRCodeForProject, trackQRScan]);

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
