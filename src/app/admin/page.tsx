'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import {
  Shield, Users, BarChart3, Settings, Eye, Search,
  Download, AlertTriangle, CheckCircle, Clock,
  UserX, MessageCircle, Lock, Key, LogOut, Share2
} from 'lucide-react';
import { AdminShowcasePanel } from '@/components/AdminShowcasePanel';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'support_admin' | 'content_admin' | 'business_admin';
  lastLogin: string;
  permissions: string[];
}

interface AuditLogEntry {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetUser?: string;
  targetResource?: string;
  timestamp: string;
  ipAddress: string;
  reason?: string;
}

interface UserAccount {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'pro' | 'enterprise';
  joinDate: string;
  lastActive: string;
  projectCount: number;
  qrScans: number;
  status: 'active' | 'suspended' | 'pending';
}

export default function AdminDashboard() {
  const { qrMetrics, qrAnalytics } = useAnalytics();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'content' | 'analytics' | 'audit' | 'showcase'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [auditReason, setAuditReason] = useState('');

  // Admin credentials are configured server-side for security
  const ADMIN_CREDENTIALS: Record<string, any> = {
    // Credentials removed for security - configured in production environment
  };

  // Demo data
  const [users] = useState<UserAccount[]>([
    {
      id: '1',
      email: 'user1@company.com',
      name: 'Sarah Chen',
      subscription: 'pro',
      joinDate: '2024-01-15',
      lastActive: '2024-12-15',
      projectCount: 12,
      qrScans: 1245,
      status: 'active'
    },
    {
      id: '2',
      email: 'user2@startup.com',
      name: 'Marcus Rodriguez',
      subscription: 'enterprise',
      joinDate: '2024-03-22',
      lastActive: '2024-12-14',
      projectCount: 45,
      qrScans: 8930,
      status: 'active'
    },
    {
      id: '3',
      email: 'user3@demo.com',
      name: 'Test User',
      subscription: 'free',
      joinDate: '2024-12-01',
      lastActive: '2024-12-10',
      projectCount: 2,
      qrScans: 23,
      status: 'pending'
    }
  ]);

  const [auditLog] = useState<AuditLogEntry[]>([
    {
      id: '1',
      adminId: 'admin1',
      adminName: 'System Administrator',
      action: 'viewed_user_account',
      targetUser: 'user1@company.com',
      timestamp: '2024-12-15 14:30:00',
      ipAddress: '192.168.1.100',
      reason: 'Customer support ticket #1234'
    },
    {
      id: '2',
      adminId: 'support1',
      adminName: 'Customer Support',
      action: 'reset_password',
      targetUser: 'user2@startup.com',
      timestamp: '2024-12-15 13:15:00',
      ipAddress: '192.168.1.101',
      reason: 'User requested password reset'
    }
  ]);

  const handleLogin = (email: string, password: string) => {
    // In production, this would authenticate against a secure backend
    // For security, admin access is disabled in demo mode

    // Simulate authentication check
    if (email && password) {
      alert('Admin access is restricted in demo mode.\n\nIn production, this connects to a secure authentication system.');
      return;
    }

    alert('Please enter valid credentials');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentAdmin(null);
    setAdminPassword('');
  };

  const logAdminAction = (action: string, targetUser?: string, targetResource?: string) => {
    const logEntry: AuditLogEntry = {
      id: `log_${Date.now()}`,
      adminId: currentAdmin?.id || '',
      adminName: currentAdmin?.name || '',
      action,
      targetUser,
      targetResource,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.100', // In production, get real IP
      reason: auditReason || 'Standard administrative task'
    };

    console.log('📋 Admin action logged:', logEntry);
    // In production, this would be sent to secure logging service
  };

  const hasPermission = (permission: string): boolean => {
    return currentAdmin?.permissions.includes(permission) || false;
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600">Spectakull Administration Panel</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            handleLogin(email, password);
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin password"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Lock className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Secure Access:</strong><br />
              Admin credentials are managed securely.<br />
              Contact your system administrator for access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Spectakull Administration</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Logged in as: <span className="font-medium">{currentAdmin?.name}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {currentAdmin?.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users, permission: 'view_users' },
            { id: 'content', label: 'Content', icon: Eye, permission: 'view_content' },
            { id: 'analytics', label: 'Analytics', icon: BarChart3, permission: 'view_analytics' },
            { id: 'showcase', label: 'Social Showcase', icon: Share2, permission: 'view_content' },
            { id: 'audit', label: 'Audit Log', icon: Shield, permission: 'system_admin' }
          ].filter(tab => !tab.permission || hasPermission(tab.permission)).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total QR Scans</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {qrMetrics.totalScans.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.reduce((sum, user) => sum + user.projectCount, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {auditLog.slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{log.adminName}</p>
                      <p className="text-sm text-gray-600">{log.action} - {log.targetUser}</p>
                    </div>
                    <span className="text-sm text-gray-500">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && hasPermission('view_users') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">User Management</h2>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Scans</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users
                      .filter(user =>
                        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.subscription === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                            user.subscription === 'pro' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.subscription}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.projectCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.qrScans.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (window.confirm('View user account details?')) {
                                logAdminAction('viewed_user_account', user.email);
                                alert(`Viewing account: ${user.name}\nEmail: ${user.email}\nSubscription: ${user.subscription}`);
                              }
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && hasPermission('view_analytics') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">QR Code Analytics</h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Analytics
              </Button>
            </div>

            {/* QR Metrics Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total QR Codes</p>
                    <p className="text-2xl font-bold text-gray-900">{qrMetrics.totalQRCodes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Scans</p>
                    <p className="text-2xl font-bold text-gray-900">{qrMetrics.totalScans}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Scans/QR</p>
                    <p className="text-2xl font-bold text-gray-900">{qrMetrics.averageScansPerQR}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing QR Codes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing QR Codes</h3>
              <div className="space-y-3">
                {qrMetrics.topPerformingQRs.length > 0 ? (
                  qrMetrics.topPerformingQRs.map((qr, index) => (
                    <div key={qr.qrCodeId} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{qr.projectName}</p>
                          <p className="text-sm text-gray-500">QR ID: {qr.qrCodeId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{qr.scans.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">scans</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No QR codes created yet</p>
                    <p className="text-sm">QR analytics will appear when users create and share QR codes</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent QR Code Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent QR Activity</h3>
              <div className="space-y-3">
                {qrAnalytics.length > 0 ? (
                  qrAnalytics.slice(0, 5).map((analytics) => (
                    <div key={analytics.qrCodeId} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{analytics.projectName}</p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(analytics.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{analytics.totalScans} scans</p>
                        <p className="text-sm text-gray-500">{analytics.uniqueScans} unique</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No QR code analytics available</p>
                    <p className="text-sm">Analytics will show when users create AR experiences with QR codes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Audit Log */}
        {activeTab === 'audit' && hasPermission('system_admin') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Audit Log</h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auditLog.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.adminName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.targetUser || log.targetResource || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.reason || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Showcase */}
        {activeTab === 'showcase' && hasPermission('view_content') && (
          <AdminShowcasePanel
            onApprove={(projectId) => {
              console.log('Approved showcase project:', projectId);
              // In production, this would call an API to approve the project
              alert(`Project ${projectId} approved for social media showcase!`);
            }}
            onReject={(projectId) => {
              console.log('Rejected showcase project:', projectId);
              // In production, this would call an API to reject the project
              alert(`Project ${projectId} rejected from social media showcase.`);
            }}
          />
        )}
      </div>
    </div>
  );
}
