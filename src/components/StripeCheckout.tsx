'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Crown, Check, X, CreditCard, Shield } from 'lucide-react';

interface StripeCheckoutProps {
  tier: 'pro' | 'enterprise';
  onClose?: () => void;
}

export function StripeCheckout({ tier, onClose }: StripeCheckoutProps) {
  const { upgradeTo } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const plans = {
    pro: {
      name: 'Professional',
      price: '$39.99',
      priceId: 'price_pro_monthly', // Replace with your actual Stripe price ID
      features: [
        'Unlimited AR Projects',
        'Advanced 3D Objects & Materials',
        'QR Analytics & Tracking',
        'Physics & Animation',
        'Face & Body Tracking',
        'Team Collaboration (5 members)'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: '$99.99',
      priceId: 'price_enterprise_monthly', // Replace with your actual Stripe price ID
      features: [
        'Everything in Professional',
        'Unlimited Team Members',
        'White Label Publishing',
        'Custom Branding',
        'Dedicated Support',
        'API Access'
      ]
    }
  };

  const currentPlan = plans[tier];

  const handleCheckout = async () => {
    setIsLoading(true);
    setError('');

    try {
      // This is where you'd integrate with your Stripe backend
      // For now, I'll simulate the flow since I don't have your Stripe keys

      // In a real implementation, you would:
      // 1. Call your backend API to create a Stripe checkout session
      // 2. Redirect to Stripe checkout
      // 3. Handle the success/cancel callbacks

      const response = await createStripeCheckoutSession({
        priceId: currentPlan.priceId,
        tier,
        successUrl: `${window.location.origin}/subscription/success?tier=${tier}`,
        cancelUrl: `${window.location.origin}/subscription/cancel`
      });

      if (response.url) {
        // Redirect to Stripe checkout
        window.location.href = response.url;
      } else {
        throw new Error('Failed to create checkout session');
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Upgrade to {currentPlan.name}</h2>
                <p className="text-gray-600 text-sm">Secure payment powered by Stripe</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Plan Details */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">{currentPlan.price}</div>
            <div className="text-gray-600 text-sm">per month</div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900 text-sm">What's included:</h3>
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 mb-6 p-3 bg-gray-50 rounded-lg">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">Secured by Stripe</span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Subscribe to {currentPlan.name}</span>
              </div>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-3">
            You can cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </div>
  );
}

// Mock function - replace with your actual Stripe integration
async function createStripeCheckoutSession(params: {
  priceId: string;
  tier: string;
  successUrl: string;
  cancelUrl: string;
}) {
  // This should call your backend API that creates a Stripe checkout session
  // Example backend endpoint: POST /api/checkout/create-session

  try {
    const response = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return await response.json();
  } catch (error) {
    // For demo purposes, simulate success
    console.log('🔄 Simulating Stripe checkout for demo...');

    // In production, remove this simulation
    return {
      url: `https://checkout.stripe.com/pay/cs_test_${Date.now()}#${params.tier}`
    };
  }
}
