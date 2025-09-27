'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StripeCheckout } from '@/components/StripeCheckout';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Check, Crown, Zap, Building2, Star, Plus, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with AR Studio',
    icon: <Star className="w-6 h-6" />,
    features: [
      '3 AR projects',
      'Live AR preview',
      'Basic editing tools',
      '1GB storage'
    ],
    limitations: [
      'No QR code generation',
      'No publishing/sharing',
      'No analytics'
    ],
    buttonText: 'Current Plan',
    tier: 'free' as const,
    popular: false,
    ctaNote: 'Upgrade to share your AR projects'
  },
  {
    id: 'business-card',
    name: 'Business Card Creator',
    price: '$19.99',
    period: 'one-time',
    description: 'Perfect for business cards',
    icon: <Crown className="w-6 h-6" />,
    features: [
      '1 business card project',
      'Unique QR code with analytics',
      'Publishing & sharing',
      'Live AR preview',
      'QR scan tracking',
      '5GB storage'
    ],
    addOns: [
      'Additional projects: $10 each',
      'Each project gets unique QR code'
    ],
    buttonText: 'Get Started',
    tier: 'business-card' as const,
    popular: true,
    stripeProductId: 'prod_business_card',
    stripePriceId: 'price_business_card'
  },
  {
    id: 'pro',
    name: 'AR Studio Pro',
    price: '$39.99',
    period: 'monthly',
    description: 'Full AR creation suite',
    icon: <Zap className="w-6 h-6" />,
    features: [
      '7 AR projects',
      'Unique QR codes for all projects',
      'Advanced analytics dashboard',
      'Publishing & sharing',
      'Collaboration tools',
      'Priority support',
      '25GB storage'
    ],
    buttonText: 'Upgrade to Pro',
    tier: 'pro' as const,
    popular: false,
    stripeProductId: 'prod_pro',
    stripePriceId: 'price_pro'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$199',
    period: 'monthly',
    description: 'For teams and organizations',
    icon: <Building2 className="w-6 h-6" />,
    features: [
      '50 AR projects',
      'Team management',
      'Custom branding',
      'Advanced analytics',
      'Priority support',
      'API access',
      '100GB storage'
    ],
    buttonText: 'Contact Sales',
    tier: 'enterprise' as const,
    popular: false,
    isEnterprise: true
  },
  {
    id: 'white-label',
    name: 'White Label',
    price: '$499',
    period: 'monthly',
    description: 'Complete customization',
    icon: <Crown className="w-6 h-6" />,
    features: [
      '200 AR projects',
      'Complete white labeling',
      'Custom domain',
      'Advanced analytics',
      'Dedicated support',
      'Custom integrations',
      '500GB storage'
    ],
    buttonText: 'Contact Sales',
    tier: 'white-label' as const,
    popular: false,
    isEnterprise: true
  }
];

export default function SubscriptionPage() {
  const { currentTier, additionalProjects, purchaseAdditionalProject, canCreateProject } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanSelect = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return;

    if (plan.isEnterprise) {
      window.open('mailto:enterprise@spectakull.com?subject=Enterprise%20Plan%20Inquiry', '_blank');
      return;
    }

    if (plan.tier === 'free') {
      return; // Already on free plan
    }

    setSelectedPlan(planId);
    setShowCheckout(true);
  };

  const handleAdditionalProject = async () => {
    setIsProcessing(true);
    try {
      const success = await purchaseAdditionalProject();
      if (success) {
        alert('🎉 Additional project purchased successfully! You can now create one more business card.');
      } else {
        alert('❌ Failed to purchase additional project. Please try again.');
      }
    } catch (error) {
      console.error('Error purchasing additional project:', error);
      alert('❌ An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPlanButtonState = (plan: typeof subscriptionPlans[0]) => {
    if (plan.tier === currentTier) {
      return { disabled: true, text: 'Current Plan' };
    }
    if (plan.isEnterprise) {
      return { disabled: false, text: 'Contact Sales' };
    }
    return { disabled: false, text: plan.buttonText };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the full potential of AR creation with our flexible pricing plans
          </p>
        </div>

        {/* Current Plan Info */}
        {currentTier !== 'free' && (
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Current Plan: {subscriptionPlans.find(p => p.tier === currentTier)?.name}
                </h3>
                {currentTier === 'business-card' && (
                  <p className="text-blue-700 mt-1">
                    Project Limit: {1 + additionalProjects} business cards
                  </p>
                )}
              </div>

              {currentTier === 'business-card' && !canCreateProject() && (
                <Button
                  onClick={handleAdditionalProject}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Buy Additional Project ($10)'}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {subscriptionPlans.map((plan) => {
            const buttonState = getPlanButtonState(plan);

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? 'border-blue-500 scale-105'
                    : 'border-gray-200 hover:border-blue-300'
                } ${
                  plan.tier === currentTier ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {plan.tier === currentTier && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                      <div className={`p-3 rounded-full ${
                        plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {plan.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {plan.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      {plan.period}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}

                    {plan.limitations && plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-400 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </div>
                    ))}

                    {plan.addOns && plan.addOns.map((addOn, index) => (
                      <div key={index} className="flex items-center">
                        <Plus className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-blue-700 font-medium">{addOn}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={buttonState.disabled}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : buttonState.disabled
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gray-800 hover:bg-gray-900'
                    }`}
                  >
                    {buttonState.text}
                  </Button>

                  {plan.ctaNote && plan.tier === currentTier && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {plan.ctaNote}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            QR Code & Analytics Features
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Free Plan</h3>
              <p className="text-sm text-gray-600">
                Create 3 projects but cannot generate QR codes or publish for sharing
              </p>
            </div>

            <div className="text-center p-6 border-2 border-blue-500 rounded-lg">
              <Crown className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Business Card</h3>
              <p className="text-sm text-gray-600">
                Each project gets a unique QR code with detailed analytics tracking
              </p>
            </div>

            <div className="text-center p-6 border rounded-lg">
              <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Pro & Enterprise</h3>
              <p className="text-sm text-gray-600">
                All projects include unique QR codes with comprehensive analytics dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Back to Studio */}
        <div className="text-center">
          <Link href="/studio">
            <Button variant="outline" className="mr-4">
              Back to AR Studio
            </Button>
          </Link>
          <Link href="/business-card-ar">
            <Button variant="outline">
              Try Business Card Creator
            </Button>
          </Link>
        </div>
      </div>

      {/* Stripe Checkout Modal */}
      {showCheckout && selectedPlan && (
        <StripeCheckout
          tier={subscriptionPlans.find(p => p.id === selectedPlan)?.tier || 'pro'}
          onClose={() => {
            setShowCheckout(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </div>
  );
}
