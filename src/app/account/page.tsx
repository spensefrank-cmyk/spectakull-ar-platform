'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  User, CreditCard, Settings, Shield, Bell, Database,
  ArrowLeft, Mail, Calendar, Crown, LogOut, CheckCircle,
  AlertCircle, BarChart3, Users, Download
} from 'lucide-react';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { currentTier, projectCount, setShowUpgradeModal } = useSubscription();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access your account.</p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'usage', label: 'Usage', icon: BarChart3 }
  ];

  const planFeatures = {
    free: [
      '3 AR Projects',
      'Basic 3D Objects',
      'QR Code Sharing',
      '1GB Storage'
    ],
    pro: [
      'Unlimited AR Projects',
      'Advanced 3D Objects & Materials',
      'QR Analytics & Tracking',
      'Physics & Animation',
      'Face & Body Tracking',
      'Team Collaboration (5 members)',
      '10GB Storage'
    ],
    enterprise: [
      'Everything in Professional',
      'Unlimited Team Members',
      'White Label Publishing',
      'Custom Branding',
      'Dedicated Support',
      'API Access',
      'Unlimited Storage'
    ]
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{user.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-900">{user.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-600 font-mono text-sm">{user.id}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    user.plan === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                    user.plan === 'pro' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Account Active</p>
                      <p className="text-sm text-green-700">Your account is in good standing</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  currentTier === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                  currentTier === 'pro' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {currentTier === 'enterprise' && <Crown className="w-4 h-4 mr-1" />}
                  {currentTier === 'pro' && <Crown className="w-4 h-4 mr-1" />}
                  {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Plan
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Plan Features</h4>
                  <ul className="space-y-2">
                    {planFeatures[currentTier as keyof typeof planFeatures].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Usage Overview</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Projects</span>
                        <span className="text-gray-900">{projectCount}/{user.projectLimit === -1 ? '∞' : user.projectLimit}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${user.projectLimit === -1 ? 20 : Math.min((projectCount / user.projectLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Storage</span>
                        <span className="text-gray-900">{user.storageUsed}MB/{user.storageLimit === -1 ? '∞' : `${user.storageLimit}MB`}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${user.storageLimit === -1 ? 15 : Math.min((user.storageUsed / user.storageLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {currentTier === 'free' && (
                <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                  <h4 className="font-medium text-cyan-900 mb-2">Upgrade Your Plan</h4>
                  <p className="text-cyan-700 text-sm mb-3">
                    Unlock unlimited projects, advanced features, and team collaboration.
                  </p>
                  <Button
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing & Invoices</h3>
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No billing history available</p>
                <p className="text-sm">Upgrade to a paid plan to manage billing</p>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates about your projects and account</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Privacy Settings</p>
                    <p className="text-sm text-gray-600">Control how your data is used</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Privacy</h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export Account Data
                </Button>
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        );

      case 'usage':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Analytics</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{projectCount}</div>
                  <div className="text-sm text-blue-700">Active Projects</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{user.storageUsed}MB</div>
                  <div className="text-sm text-green-700">Storage Used</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-purple-700">QR Scans</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-600">Manage your profile and preferences</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
