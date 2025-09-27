'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, Crown, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        <p className="text-gray-600">Please wait while we process your subscription...</p>
      </div>
    </div>
  );
}

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { upgradeTo, currentTier } = useSubscription();
  const { user } = useAuth();
  const [isActivating, setIsActivating] = useState(true);
  const [activationComplete, setActivationComplete] = useState(false);

  const tier = searchParams?.get('tier') as 'pro' | 'enterprise' | null;
  const sessionId = searchParams?.get('session_id');

  useEffect(() => {
    if (tier && sessionId) {
      const activateSubscription = async () => {
        try {
          console.log('🎉 Activating subscription:', tier);
          await upgradeTo(tier);
          setActivationComplete(true);
          setIsActivating(false);
          console.log('✅ Subscription activated successfully');
        } catch (error) {
          console.error('❌ Subscription activation failed:', error);
          setIsActivating(false);
        }
      };
      activateSubscription();
    } else {
      setIsActivating(false);
    }
  }, [tier, sessionId, upgradeTo]);

  const planDetails = {
    pro: {
      name: 'Professional',
      price: '$39.99/month',
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
      price: '$99.99/month',
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

  const currentPlan = tier ? planDetails[tier] : null;

  if (isActivating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Activating Your Subscription</h2>
          <p className="text-gray-600">Please wait while we set up your account...</p>
        </div>
      </div>
    );
  }

  if (!tier || !currentPlan || !activationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Activation Failed</h2>
          <p className="text-gray-600 mb-6">There was an issue activating your subscription.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/subscription">Try Again</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <img src="/spectakull_logo.png" alt="Spectakull" className="h-10 w-auto" />
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentTier === 'pro' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {currentTier?.charAt(0).toUpperCase() + currentTier?.slice(1)} Plan
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to {currentPlan.name}!</h1>
          <p className="text-xl text-gray-600 mb-2">Your subscription has been activated successfully.</p>
          <p className="text-gray-500">You now have access to all {currentPlan.name} features.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Crown className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{currentPlan.name} Plan</h3>
                <p className="text-gray-600">{currentPlan.price}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Your new features:</h4>
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Create Unlimited AR Projects</h4>
                  <p className="text-gray-600 text-sm">Start building professional AR experiences</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Access Team Collaboration</h4>
                  <p className="text-gray-600 text-sm">Invite your team members to collaborate</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Generate QR Analytics</h4>
                  <p className="text-gray-600 text-sm">Track engagement and performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 text-lg">
            <Link href="/studio">
              <ArrowRight className="w-5 h-5 mr-2" />
              Start Creating AR Projects
            </Link>
          </Button>

          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/teams">Manage Team</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/analytics">View Analytics</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/contact">Get Support</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Confirmation</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Plan:</span>
              <span className="ml-2 font-medium">{currentPlan.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Amount:</span>
              <span className="ml-2 font-medium">{currentPlan.price}</span>
            </div>
            <div>
              <span className="text-gray-600">Session ID:</span>
              <span className="ml-2 font-mono text-xs">{sessionId}</span>
            </div>
            <div>
              <span className="text-gray-600">Date:</span>
              <span className="ml-2">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            A receipt has been sent to your email address. You can manage your subscription anytime from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}
