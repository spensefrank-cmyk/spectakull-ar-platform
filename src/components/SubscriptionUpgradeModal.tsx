'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  Crown, Check, X, Zap, Users, BarChart3,
  Shield, Star, Palette, Camera, QrCode, Bot
} from 'lucide-react';

export function SubscriptionUpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, currentTier, upgradeTo } = useSubscription();
  const [selectedTier, setSelectedTier] = useState<'pro' | 'enterprise' | 'white-label'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!showUpgradeModal) return null;

  const pricing = {
    pro: {
      monthly: 39.99,
      yearly: 399.90, // 2 months free (saves $79.98)
      features: [
        'Up to 50 AR projects',
        'QR code generation with Spectakull branding',
        'Publishing to spectakull.com',
        'Advanced analytics dashboard',
        'Real-time team collaboration (up to 10 members)',
        'PBR materials and lighting',
        'Physics simulation',
        'Animation timeline',
        'AI design assistant',
        '50GB cloud storage',
        'Priority email support'
      ]
    },
    enterprise: {
      monthly: 99,
      yearly: 990, // 2 months free
      features: [
        'Unlimited AR projects',
        'QR code generation with Spectakull branding',
        'Publishing to spectakull.com',
        'Advanced analytics with custom reports',
        'Real-time team collaboration (unlimited members)',
        'All Pro features',
        'Custom integrations via API',
        'Advanced user permissions',
        'SSO (Single Sign-On)',
        '500GB cloud storage',
        'Dedicated account manager',
        'Phone & priority support'
      ]
    },
    'white-label': {
      monthly: 299,
      yearly: 2990, // 2 months free
      features: [
        'Everything in Enterprise',
        'Custom branding (remove Spectakull branding)',
        'Custom domain for AR experiences',
        'White-label QR codes',
        'Custom login page',
        'Custom color schemes',
        'Private deployment options',
        '1TB cloud storage',
        'Custom terms of service',
        'Dedicated infrastructure',
        '24/7 premium support',
        'Custom feature development'
      ]
    }
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await upgradeTo(selectedTier);
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const getPrice = (tier: keyof typeof pricing) => {
    const price = pricing[tier][billingCycle];
    return billingCycle === 'yearly' ? Math.round(price / 12) : price;
  };

  const getSavings = (tier: keyof typeof pricing) => {
    if (billingCycle === 'monthly') return 0;
    const monthlyTotal = pricing[tier].monthly * 12;
    const yearlyPrice = pricing[tier].yearly;
    return monthlyTotal - yearlyPrice;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
              <p className="text-cyan-100">Unlock powerful features for professional AR creation</p>
            </div>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pro Plan */}
            <div
              className={`rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                selectedTier === 'pro'
                  ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTier('pro')}
            >
              <div className="flex items-center space-x-2 mb-4">
                <Crown className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                {selectedTier === 'pro' && (
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Selected
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${getPrice('pro')}
                  </span>
                  <span className="text-gray-600">
                    /{billingCycle === 'yearly' ? 'month' : 'month'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="text-sm text-green-600 font-medium">
                    Save ${getSavings('pro')} per year
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {pricing.pro.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Perfect for</p>
                <p className="text-sm font-medium text-gray-900">
                  Small teams & freelancers
                </p>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div
              className={`rounded-2xl border-2 p-6 cursor-pointer transition-all relative ${
                selectedTier === 'enterprise'
                  ? 'border-purple-500 bg-purple-50 shadow-lg transform scale-105'
                  : 'border-purple-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedTier('enterprise')}
            >
              {/* Popular Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Most Popular
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-6 h-6 text-purple-500" />
                <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
                {selectedTier === 'enterprise' && (
                  <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                    Selected
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${getPrice('enterprise')}
                  </span>
                  <span className="text-gray-600">
                    /{billingCycle === 'yearly' ? 'month' : 'month'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="text-sm text-green-600 font-medium">
                    Save ${getSavings('enterprise')} per year
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {pricing.enterprise.features.slice(0, 8).map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
                <li className="text-purple-600 text-sm font-medium">
                  + {pricing.enterprise.features.length - 8} more features
                </li>
              </ul>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Perfect for</p>
                <p className="text-sm font-medium text-gray-900">
                  Growing companies & agencies
                </p>
              </div>
            </div>

            {/* White Label Plan */}
            <div
              className={`rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                selectedTier === 'white-label'
                  ? 'border-gold-500 bg-yellow-50 shadow-lg transform scale-105'
                  : 'border-yellow-200 hover:border-yellow-300'
              }`}
              onClick={() => setSelectedTier('white-label')}
            >
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-bold text-gray-900">White Label</h3>
                {selectedTier === 'white-label' && (
                  <div className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                    Selected
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${getPrice('white-label')}
                  </span>
                  <span className="text-gray-600">
                    /{billingCycle === 'yearly' ? 'month' : 'month'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="text-sm text-green-600 font-medium">
                    Save ${getSavings('white-label')} per year
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {pricing['white-label'].features.slice(0, 8).map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
                <li className="text-yellow-600 text-sm font-medium">
                  + Complete customization
                </li>
              </ul>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Perfect for</p>
                <p className="text-sm font-medium text-gray-900">
                  Enterprise & custom solutions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Plan Notice */}
        {currentTier !== 'free' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              You're currently on the <strong>{currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}</strong> plan.
              {selectedTier !== currentTier && ' Upgrade to unlock more features.'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 py-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <Button
              onClick={() => setShowUpgradeModal(false)}
              variant="outline"
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleUpgrade}
              disabled={isUpgrading || selectedTier === currentTier}
              className={`flex-1 text-white ${
                selectedTier === 'pro' ? 'bg-blue-600 hover:bg-blue-700' :
                selectedTier === 'enterprise' ? 'bg-purple-600 hover:bg-purple-700' :
                'bg-yellow-600 hover:bg-yellow-700'
              }`}
            >
              {isUpgrading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Upgrade to ${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}`
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            No setup fees • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}
