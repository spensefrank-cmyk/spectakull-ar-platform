'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingTooltip } from '@/components/OnboardingTooltip';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { QRAnalyticsPanel } from '@/components/QRAnalyticsPanel';
import { MobileOptimizedStudio } from '@/components/MobileOptimizedStudio';
import { AnalyticsPanel } from '@/components/AnalyticsPanel';
import { TeamManagement } from '@/components/TeamManagement';
import { CollaborationPanel } from '@/components/CollaborationPanel';

// ... existing code ... <interface definitions>

export default function StudioPage() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Detect if mobile device
  useEffect(() => {
    const checkDevice = () => {
      const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setViewMode(isMobile ? 'mobile' : 'desktop');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Return the advanced mobile studio interface
  return (
    <div className="min-h-screen bg-black text-white">
      <MobileOptimizedStudio />
    </div>
  );
}
