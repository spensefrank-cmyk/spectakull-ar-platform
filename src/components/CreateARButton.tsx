'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { QrCode, Crown, Zap } from 'lucide-react';
import { QRCodeCreator } from './QRCodeCreator';
import Link from 'next/link';

interface CreateARButtonProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function CreateARButton({ className = '', size = 'default', variant = 'default' }: CreateARButtonProps) {
  const { user } = useAuth();
  const { isFeatureAvailable, setShowUpgradeModal } = useSubscription();
  const [showQRCreator, setShowQRCreator] = useState(false);

  const handleCreateAR = () => {
    // Check if user is logged in
    if (!user) {
      // Redirect to studio (which will handle auth)
      window.location.href = '/studio';
      return;
    }

    // Check if user has QR generation feature
    if (isFeatureAvailable('qrCodeGeneration')) {
      // Open QR creator for existing project or demo project
      setShowQRCreator(true);
    } else {
      // Redirect to subscription page
      window.location.href = '/subscription';
    }
  };

  const canCreateAR = user && isFeatureAvailable('qrCodeGeneration');

  return (
    <>
      <Button
        onClick={handleCreateAR}
        className={`${className} ${canCreateAR ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}
        size={size}
        variant={variant}
      >
        {canCreateAR ? (
          <>
            <QrCode className="w-4 h-4 mr-2" />
            Create AR QR
          </>
        ) : (
          <>
            <Crown className="w-4 h-4 mr-2" />
            Create AR
          </>
        )}
      </Button>

      {/* QR Creator Modal for subscribers */}
      {showQRCreator && canCreateAR && (
        <QRCodeCreator
          projectId="demo-project"
          projectName="My AR Experience"
          onClose={() => setShowQRCreator(false)}
        />
      )}
    </>
  );
}

// Alternative version for call-to-action sections
export function CreateARCTA({ className = '' }: { className?: string }) {
  const { user } = useAuth();
  const { isFeatureAvailable } = useSubscription();

  const canCreateAR = user && isFeatureAvailable('qrCodeGeneration');

  if (canCreateAR) {
    return (
      <CreateARButton
        className={`${className} text-lg px-8 py-4`}
        size="lg"
      />
    );
  }

  return (
    <Button asChild size="lg" className={`${className} bg-orange-600 hover:bg-orange-700 text-lg px-8 py-4`}>
      <Link href="/subscription">
        <Crown className="w-5 h-5 mr-2" />
        Create AR - Upgrade Required
      </Link>
    </Button>
  );
}
