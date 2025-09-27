'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscription, ProjectAnalytics } from '@/contexts/SubscriptionContext';
import {
  BarChart,
  LineChart,
  Download,
  Calendar,
  Clock,
  QrCode,
  TrendingUp,
  Eye,
  Share2,
  Filter,
  RefreshCw
} from 'lucide-react';

interface QRAnalyticsDashboardProps {
  projectId?: string; // Optional: show analytics for specific project
  onClose?: () => void;
}

export function QRAnalyticsDashboard({ projectId, onClose }: QRAnalyticsDashboardProps) {
  const { getAllAnalytics, getProjectAnalytics, isFeatureAvailable } = useSubscription();
  const [analytics, setAnalytics] = useState<ProjectAnalytics[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>(projectId || '');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has access to analytics
  const hasAnalyticsAccess = isFeatureAvailable('qrCodeAnalytics');

  useEffect(() => {
    loadAnalytics();
  }, [selectedProject, dateRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      if (selectedProject) {
        const projectAnalytics = getProjectAnalytics(selectedProject);
        setAnalytics(projectAnalytics ? [projectAnalytics] : []);
      } else {
        setAnalytics(getAllAnalytics());
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalScans = () => {
    return analytics.reduce((total, item) => total + item.totalScans, 0);
  };

  const getAvgScansPerDay = () => {
    const totalDays = analytics.reduce((total, item) => total + item.dailyScans.length, 0);
    return totalDays > 0 ? Math.round(getTotalScans() / totalDays) : 0;
  };

  const getMostActiveHour = () => {
    const hourlyTotals = Array.from({ length: 24 }, () => 0);

    analytics.forEach(item => {
      item.hourlyBreakdown.forEach(hour => {
        hourlyTotals[hour.hour] += hour.count;
      });
    });

    const maxIndex = hourlyTotals.indexOf(Math.max(...hourlyTotals));
    return `${maxIndex}:00 - ${maxIndex + 1}:00`;
  };

  const getRecentScans = () => {
    return analytics
      .filter(item => item.lastScanAt)
      .sort((a, b) => new Date(b.lastScanAt!).getTime() - new Date(a.lastScanAt!).getTime())
      .slice(0, 5);
  };

  const exportAnalytics = () => {
    const csvData = [
      ['Project ID', 'QR Code ID', 'Total Scans', 'Last Scan', 'Created At'],
      ...analytics.map(item => [
        item.projectId,
        item.qrCodeId || 'N/A',
        item.totalScans.toString(),
        item.lastScanAt || 'Never',
        item.createdAt
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `spectakull-qr-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  if (!hasAnalyticsAccess) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600 mb-4">
            QR code analytics are available with Business Card, Pro, Enterprise, and White Label plans.
          </p>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              Upgrade Plan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">

        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">QR Code Analytics</h2>
              <p className="text-gray-600">Track and analyze your QR code performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={exportAnalytics}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </Button>
              <Button
                variant="outline"
                onClick={loadAnalytics}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Date Range:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d')}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>

            {!projectId && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Project:</span>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">All Projects</option>
                  {analytics.map(item => (
                    <option key={item.projectId} value={item.projectId}>
                      {item.projectId}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          {analytics.length === 0 ? (
            <div className="text-center py-12">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h3>
              <p className="text-gray-600">
                Create QR codes for your projects to start tracking analytics.
              </p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Total Scans</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{getTotalScans()}</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <QrCode className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Active QR Codes</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">{analytics.length}</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Avg/Day</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">{getAvgScansPerDay()}</div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">Peak Hour</span>
                  </div>
                  <div className="text-sm font-bold text-orange-900">{getMostActiveHour()}</div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid md:grid-cols-2 gap-6">

                {/* Daily Scans Chart */}
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <BarChart className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Daily Scans</h3>
                  </div>

                  <div className="space-y-3">
                    {analytics.map(item => (
                      <div key={item.projectId} className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">
                          Project: {item.projectId}
                        </div>
                        <div className="space-y-1">
                          {item.dailyScans.slice(-7).map(day => (
                            <div key={day.date} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{new Date(day.date).toLocaleDateString()}</span>
                              <div className="flex items-center space-x-2">
                                <div
                                  className="bg-blue-200 h-2 rounded"
                                  style={{ width: `${Math.max(day.count * 10, 8)}px` }}
                                ></div>
                                <span className="font-medium w-8 text-right">{day.count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hourly Breakdown Chart */}
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <LineChart className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Hourly Activity</h3>
                  </div>

                  <div className="space-y-2">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const totalForHour = analytics.reduce((total, item) => {
                        const hourData = item.hourlyBreakdown.find(h => h.hour === hour);
                        return total + (hourData?.count || 0);
                      }, 0);

                      const maxHourly = Math.max(...analytics.flatMap(item =>
                        item.hourlyBreakdown.map(h => h.count)
                      ));

                      return (
                        <div key={hour} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 w-12">{hour}:00</span>
                          <div className="flex items-center space-x-2 flex-1 ml-4">
                            <div
                              className="bg-green-200 h-2 rounded"
                              style={{
                                width: `${Math.max((totalForHour / Math.max(maxHourly, 1)) * 100, 2)}%`,
                                minWidth: totalForHour > 0 ? '8px' : '2px'
                              }}
                            ></div>
                            <span className="font-medium w-8 text-right">{totalForHour}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Project Details Table */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Share2 className="w-5 h-5" />
                    <span>Project Details</span>
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Project ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">QR Code ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total Scans</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Scan</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {analytics.map((item, index) => (
                        <tr key={item.projectId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {item.projectId}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                            {item.qrCodeId ? item.qrCodeId.substring(0, 20) + '...' : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                            {item.totalScans}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {item.lastScanAt
                              ? new Date(item.lastScanAt).toLocaleString()
                              : 'Never'
                            }
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              item.totalScans > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.totalScans > 0 ? 'Active' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                </div>

                <div className="space-y-3">
                  {getRecentScans().length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  ) : (
                    getRecentScans().map(item => (
                      <div key={item.projectId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-gray-900">Project: {item.projectId}</div>
                          <div className="text-sm text-gray-600">
                            Last scanned: {item.lastScanAt ? new Date(item.lastScanAt).toLocaleString() : 'Never'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg text-blue-600">{item.totalScans}</div>
                          <div className="text-xs text-gray-500">total scans</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
